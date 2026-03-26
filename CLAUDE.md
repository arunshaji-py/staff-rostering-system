# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend
```bash
# Activate virtual environment and start the API server
source venv/bin/activate
uvicorn app.main:app --reload
```

### Frontend
```bash
cd rostering-ui
npm run dev       # Start dev server (default: http://localhost:5173)
npm run build     # Production build to dist/
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Architecture

This is a full-stack healthcare staff rostering system. The backend is a FastAPI REST API, and the frontend is a React SPA.

### Backend (`app/`)
- **`main.py`** — FastAPI app entry point; registers all routers, sets up CORS (wildcard), and auto-creates DB tables on startup.
- **`database/db.py`** — SQLAlchemy engine connecting to PostgreSQL at `postgresql://arunshaji@localhost/roster_db`. All models inherit from `Base` defined here.
- **`models/`** — SQLAlchemy ORM: `Employee`, `Shift`, `Ward`, `Assignment` (employee↔shift join), `Availability` (employee scheduling constraints).
- **`schemas/`** — Pydantic request/response validation schemas.
- **`routes/`** — FastAPI routers for each resource. `scheduler.py` exposes `POST /generate-schedule`.
- **`services/scheduler.py`** — Core scheduling algorithm using **Google OR-Tools constraint programming**. Assigns employees to shifts while respecting max hours, availability windows, ward gender requirements, and skill matching.
- **`auth.py`** — JWT token creation using `python-jose`. Secret key is hardcoded (`"supersecretkey"`) — development only.

### Frontend (`rostering-ui/src/`)
- **`App.jsx`** — React Router setup with 3 routes: `/` (Login), `/admin` (AdminDashboard), `/employee` (EmployeeDashboard).
- **`pages/AdminDashboard.jsx`** — Primary admin UI; handles employee/shift/availability management and triggers schedule generation via Axios calls to the backend.
- **`pages/EmployeeDashboard.jsx`** — Read-only employee view of assigned shifts.
- Axios is used for all API calls. Bootstrap 5 handles styling.

### Data Flow
1. Admin creates employees, wards, shifts, and availability constraints via AdminDashboard.
2. Admin triggers `POST /generate-schedule` → backend runs OR-Tools CP solver → stores results as `Assignment` records.
3. Employees view their assignments via EmployeeDashboard.
