# My Contributions to the Project — Meriç Baş

## Role on the Team

On this project, Kudret built the **core optimization engine** — the Gurobi exact solver and the Genetic Algorithm that actually solve the drone routing problem. My responsibility was to turn that engine into a complete, usable product. I designed and built the **user interface (UI/UX)**, developed the **FastAPI backend** that connects everything together, and made the **small adjustments inside the core engine** that were needed for it to work cleanly with the web layer.

In short: Kudret made the algorithms; I made them into an application that anyone can actually run, see, and compare through a browser.

## Where the Project Started

When I joined the development, the project was two standalone Python scripts — one solving the problem with Gurobi, one with a Genetic Algorithm. There was no server, no interface, and no way to interact with them other than running a script in a terminal and reading printed text or a Matplotlib chart. Everything I describe below is what I added on top of that starting point.

## 1. The FastAPI Backend

I built the backend server from scratch using FastAPI. This is the layer that lets a web browser talk to the Python solvers. It includes:

- A main **optimization endpoint** where the user picks an algorithm and supplies the operational parameters — drone count, drone and truck speed, battery limit — and gets back a structured result.
- **File upload support**, so users can optionally upload their own dataset instead of using the default one.
- **CORS configuration**, so the browser-based interface is allowed to communicate with the server.
- A **comparison endpoint** that runs both algorithms and returns their results together.
- A **batch-comparison endpoint** that runs both algorithms many times in a background thread, with a separate status endpoint the interface polls for live progress.

## 2. The Integration Layer (core engine ↔ backend)

The original solver scripts produced raw internal data — graph nodes, path objects, internal route structures — that a web frontend cannot read directly. So inside each solver I wrote an **`api_solve` integration function** that runs the full solving pipeline and converts the raw output into a clean, simple structure the frontend can render: total operation time, step-by-step truck movements, depot and customer coordinates, the visiting order, and the truck's route.

I also made the **dataset path configurable** instead of hard-coded, which is what made the "upload your own dataset" feature possible.

## 3. The Web Interface (UI/UX)

I designed and built the entire web interface from the ground up, using **plain HTML, CSS, and JavaScript with no external UI framework**. It includes:

- A sidebar form where the user configures the run — algorithm choice, drone settings, battery limit, dataset upload, and a run button with a loading spinner.
- An **interactive map** built with Leaflet.js that draws the depot, customers, the drone visiting order, and the truck's physical route.
- A complete **visual design** written in vanilla CSS (glassmorphism style, dark/light friendly), with no dependency on any styling library.
- **Bilingual support (English / Turkish)** that switches the entire interface instantly and re-renders the active report in the chosen language.

## 4. The Algorithm Comparison Feature

I designed and implemented an entirely new feature: running both algorithms on the same problem and comparing them directly, instead of running them one at a time by hand.

- On the interface side, I added a **side-by-side comparison view** with two separate maps — one for Gurobi, one for the Genetic Algorithm — each labeled and color-coded, with a detailed report underneath.
- On the server side, I built the mechanism that runs both solvers and returns their results together, then wrote the client logic that draws both routes and builds a **detailed comparison report**: total operation time, number of truck stops, total distance, packages delivered, drone-type split, which algorithm performed better, and by how much.

## 5. The Batch Comparison and Statistical Benchmarking System

Because the Genetic Algorithm involves randomness, a single run can be misleading. So I built a second, more rigorous comparison mode: **running both algorithms a chosen number of times and averaging the results.**

- I added a **background job system**: the server starts the runs in a separate thread, and the interface polls it for progress.
- I built a **live progress modal** showing a "run X of N" counter, which algorithm is currently running, and an animated progress bar.
- I made sure all statistics are based on **real, measured data**: I used actual process-level CPU-time measurements and wall-clock timers to record, for every run, how much processor time and real time each algorithm consumed and the quality of its solution. From these I computed averages, minimums, maximums, standard deviations, and how many runs each algorithm "won" — giving an honest, statistically grounded comparison.

## 6. Updates Inside the Core Engine (for UI compatibility)

While integrating everything, I made several adjustments inside Kudret's core engine so it would run reliably with the web layer:

- I fixed a **Windows encoding bug**: the original scripts printed emoji and Turkish accented characters directly to the console, which crashed or garbled the output on Windows terminals. I replaced these with plain-text equivalents so the backend runs reliably.
- I **tuned and optimized the Genetic Algorithm**: I increased its population (150 → 250) and generations (400 → 800) for better solutions, and at the same time made it faster by precomputing a full distance matrix, caching each route's fitness once per generation, and replacing a slow list-scan in route building with a fast set-based lookup — so it searches harder without taking longer.
- I added new **user-adjustable parameters** that flow from the UI down into the engine: a **launch penalty** (drone loading time added per sortie), and exposed the GA **population size, generations, and crossover rate (0.85)** so they can be changed from the interface.
- I extended the comparison endpoints to report **real CPU and wall-clock time** for single runs as well, and expanded the dataset used by the system.

## 7. Documentation

I wrote the project's documentation, explaining things that weren't written down anywhere before:

- A full **README** explaining how to install, run, and use the web-based version.
- A detailed, end-to-end **system explainer** that walks through the entire project — what problem it solves, how the three layers fit together, how the solving pipeline works step by step, how each algorithm works internally, and how to correctly interpret the comparison numbers.
- A **changelog** documenting the comparison feature, the batch/averaged mode, the bilingual reports, the bug fixes, the GA tuning, and a practical note about Gurobi's license size limits.

## In Short

I took this project from a pair of disconnected research scripts to a complete, working, documented web application. I built the FastAPI backend and the entire user interface, designed and implemented the full algorithm-comparison feature — from the simple side-by-side view to a statistically rigorous batch-benchmarking system with real CPU and timing measurements — improved the Genetic Algorithm's quality and speed, made the core engine compatible with the web layer, and wrote the documentation that explains how it all works.
