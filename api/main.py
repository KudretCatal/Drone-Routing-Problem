from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
from pydantic import BaseModel
import sys
import os
import time
import uuid
import threading
import psutil

# Add core_engine to sys.path so we can import from it
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'core_engine'))

import gurobisolution
import geneticalgosolution

app = FastAPI()

# Allow CORS for UI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for running batch-comparison jobs (single-user local tool, so a plain dict is fine)
batch_jobs = {}


def _summarize(values):
    n = len(values)
    avg = sum(values) / n
    variance = sum((v - avg) ** 2 for v in values) / n
    return {
        "values": values,
        "average": avg,
        "min": min(values),
        "max": max(values),
        "std_dev": variance ** 0.5
    }


def _run_batch_job(job_id, runs, droneCount, droneSpeed, truckSpeed, batteryLimit, launchPenalty, popSize, generations, dataset_path):
    job = batch_jobs[job_id]
    process = psutil.Process(os.getpid())

    gurobi_total_times, gurobi_cpu_times, gurobi_wall_times = [], [], []
    genetic_total_times, genetic_cpu_times, genetic_wall_times = [], [], []

    try:
        for i in range(runs):
            job["current_run"] = i + 1

            # --- Gurobi run ---
            job["current_algorithm"] = "gurobi"
            cpu_before = process.cpu_times()
            wall_start = time.perf_counter()
            g_result = gurobisolution.api_solve(
                drone_count=droneCount, drone_speed=droneSpeed,
                truck_speed=truckSpeed, battery_limit=batteryLimit,
                launch_penalty=launchPenalty, dataset_path=dataset_path
            )
            wall_end = time.perf_counter()
            cpu_after = process.cpu_times()
            gurobi_total_times.append(g_result["total_time"])
            gurobi_cpu_times.append((cpu_after.user - cpu_before.user) + (cpu_after.system - cpu_before.system))
            gurobi_wall_times.append(wall_end - wall_start)

            # --- Genetic Algorithm run ---
            job["current_algorithm"] = "genetic"
            cpu_before = process.cpu_times()
            wall_start = time.perf_counter()
            e_result = geneticalgosolution.api_solve(
                drone_count=droneCount, drone_speed=droneSpeed,
                truck_speed=truckSpeed, battery_limit=batteryLimit,
                launch_penalty=launchPenalty, pop_size=popSize,
                generations=generations, dataset_path=dataset_path
            )
            wall_end = time.perf_counter()
            cpu_after = process.cpu_times()
            genetic_total_times.append(e_result["total_time"])
            genetic_cpu_times.append((cpu_after.user - cpu_before.user) + (cpu_after.system - cpu_before.system))
            genetic_wall_times.append(wall_end - wall_start)

        gurobi_wins = sum(1 for g, e in zip(gurobi_total_times, genetic_total_times) if g < e)
        genetic_wins = sum(1 for g, e in zip(gurobi_total_times, genetic_total_times) if e < g)
        ties = runs - gurobi_wins - genetic_wins

        job["summary"] = {
            "runs_count": runs,
            "gurobi": {
                "total_time": _summarize(gurobi_total_times),
                "cpu_time": _summarize(gurobi_cpu_times),
                "wall_time": _summarize(gurobi_wall_times),
                "wins": gurobi_wins
            },
            "genetic": {
                "total_time": _summarize(genetic_total_times),
                "cpu_time": _summarize(genetic_cpu_times),
                "wall_time": _summarize(genetic_wall_times),
                "wins": genetic_wins
            },
            "ties": ties
        }
        job["status"] = "done"
    except Exception as e:
        job["status"] = "error"
        job["error"] = str(e)

@app.post("/api/optimize")
async def optimize(
    algorithm: str = Form(...),
    droneCount: int = Form(...),
    droneSpeed: int = Form(...),
    truckSpeed: int = Form(...),
    batteryLimit: int = Form(...),
    launchPenalty: float = Form(0),
    popSize: int = Form(250),
    generations: int = Form(800),
    file: UploadFile = File(None)
):
    # Save uploaded file temporarily if provided
    dataset_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'veri_seti.txt')
    if file:
        temp_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'temp_veri_seti.txt')
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        dataset_path = temp_path

    # Need to patch the solvers to use the custom dataset path instead of hardcoded
    # We will temporarily override the hardcoded paths in the api_solve function
    # Wait, the solvers hardcode the path inside api_solve. We need to pass dataset_path to api_solve.
    # I will modify the api_solve signatures in the next step to accept dataset_path.

    try:
        if algorithm == 'gurobi':
            result = gurobisolution.api_solve(
                drone_count=droneCount,
                drone_speed=droneSpeed,
                truck_speed=truckSpeed,
                battery_limit=batteryLimit,
                launch_penalty=launchPenalty,
                dataset_path=dataset_path
            )
        elif algorithm == 'genetic':
            result = geneticalgosolution.api_solve(
                drone_count=droneCount,
                drone_speed=droneSpeed,
                truck_speed=truckSpeed,
                battery_limit=batteryLimit,
                launch_penalty=launchPenalty,
                pop_size=popSize,
                generations=generations,
                dataset_path=dataset_path
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid algorithm selected")
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/compare")
async def compare(
    droneCount: int = Form(...),
    droneSpeed: int = Form(...),
    truckSpeed: int = Form(...),
    batteryLimit: int = Form(...),
    launchPenalty: float = Form(0),
    popSize: int = Form(250),
    generations: int = Form(800),
    file: UploadFile = File(None)
):
    # Save uploaded file temporarily if provided
    dataset_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'veri_seti.txt')
    if file:
        temp_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'temp_veri_seti.txt')
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        dataset_path = temp_path

    def run_gurobi():
        return gurobisolution.api_solve(
            drone_count=droneCount,
            drone_speed=droneSpeed,
            truck_speed=truckSpeed,
            battery_limit=batteryLimit,
            launch_penalty=launchPenalty,
            dataset_path=dataset_path
        )

    def run_genetic():
        return geneticalgosolution.api_solve(
            drone_count=droneCount,
            drone_speed=droneSpeed,
            truck_speed=truckSpeed,
            battery_limit=batteryLimit,
            launch_penalty=launchPenalty,
            pop_size=popSize,
            generations=generations,
            dataset_path=dataset_path
        )

    def measured(fn):
        # Run sequentially with isolated CPU/wall-clock measurement (concurrent execution
        # would contaminate per-algorithm CPU times since they share one process).
        process = psutil.Process(os.getpid())
        cpu_before = process.cpu_times()
        wall_start = time.perf_counter()
        result = fn()
        wall_end = time.perf_counter()
        cpu_after = process.cpu_times()
        result["cpu_time"] = (cpu_after.user - cpu_before.user) + (cpu_after.system - cpu_before.system)
        result["wall_time"] = wall_end - wall_start
        return result

    try:
        gurobi_result = measured(run_gurobi)
        genetic_result = measured(run_genetic)

        return {
            "gurobi": gurobi_result,
            "genetic": genetic_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/compare-batch")
async def compare_batch(
    droneCount: int = Form(...),
    droneSpeed: int = Form(...),
    truckSpeed: int = Form(...),
    batteryLimit: int = Form(...),
    launchPenalty: float = Form(0),
    popSize: int = Form(250),
    generations: int = Form(800),
    runs: int = Form(...),
    file: UploadFile = File(None)
):
    if runs < 1:
        raise HTTPException(status_code=400, detail="runs must be at least 1")

    dataset_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'veri_seti.txt')
    if file:
        temp_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'temp_veri_seti.txt')
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        dataset_path = temp_path

    job_id = str(uuid.uuid4())
    batch_jobs[job_id] = {
        "status": "running",
        "total_runs": runs,
        "current_run": 0,
        "current_algorithm": None,
        "summary": None,
        "error": None
    }

    # Run sequentially in a background thread: this lets us isolate per-algorithm CPU
    # measurements cleanly (no contention from a concurrently-running counterpart) and
    # lets the UI poll for live progress without blocking the request.
    thread = threading.Thread(
        target=_run_batch_job,
        args=(job_id, runs, droneCount, droneSpeed, truckSpeed, batteryLimit, launchPenalty, popSize, generations, dataset_path),
        daemon=True
    )
    thread.start()

    return {"job_id": job_id}


@app.get("/api/compare-batch/status/{job_id}")
async def compare_batch_status(job_id: str):
    job = batch_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
