from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
from pydantic import BaseModel
import sys
import os

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

@app.post("/api/optimize")
async def optimize(
    algorithm: str = Form(...),
    droneCount: int = Form(...),
    droneSpeed: int = Form(...),
    truckSpeed: int = Form(...),
    batteryLimit: int = Form(...),
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
                dataset_path=dataset_path
            )
        elif algorithm == 'genetic':
            result = geneticalgosolution.api_solve(
                drone_count=droneCount,
                drone_speed=droneSpeed,
                truck_speed=truckSpeed,
                battery_limit=batteryLimit,
                dataset_path=dataset_path
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid algorithm selected")
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
