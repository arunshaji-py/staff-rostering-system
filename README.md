# Staff Rostering System

A full-stack healthcare staff rostering platform with constraint-based automated scheduling, role-based access control, and real-time shift coverage analytics.

---

## Overview

This system streamlines shift management for healthcare facilities by combining an intelligent scheduling engine with intuitive dashboards for both administrators and staff. Administrators can manage employees, wards, and shifts, trigger automatic schedule generation, or make manual assignments — while employees can submit their availability and view upcoming assignments in a clean calendar interface.

---

## Features

### Automated Scheduling
- Schedule generation powered by **Google OR-Tools** constraint programming
- Maximises total shift coverage while respecting all operational constraints
- Constraints enforced automatically:
  - Employee availability windows
  - Ward-specific gender requirements
  - Minimum 8-hour rest period between consecutive shifts
  - Per-employee maximum weekly hours
  - One employee per shift capacity limit
  - Balanced workload distribution across staff

### Admin Dashboard
- **Overview Panel** — real-time stats for total shifts, covered, uncovered, and coverage percentage
- **Employee Management** — add and remove employees with skill, gender, and max-hours configuration
- **Ward Management** — create and manage wards with gender-requirement policies
- **Shift Management** — create shifts with date, time range, and ward assignment
- **Manual Assignment** — two-step assignment flow with conflict detection and gender-eligibility filtering
- **Uncovered Shifts View** — split view of critical (overdue) vs upcoming uncovered shifts with status badges

### Employee Dashboard
- **Availability Calendar** — week-based calendar for submitting shift availability
  - Visual indicators for available, unavailable, and gender-ineligible slots
  - One availability submission per day enforced
  - Deduped shift cards per ward and date
- **My Assignments** — read-only table of confirmed assignments with today / upcoming / past status badges

### System-Wide
- JWT-based authentication with role detection (admin vs. employee)
- Shift overlap and conflict detection on manual assignments
- Overnight shift handling with correct time normalisation
- Toast notifications and confirmation dialogs throughout the UI
- RESTful API with auto-generated Swagger documentation at `/docs`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + React Router 7 |
| Frontend Build Tool | Vite |
| UI & Styling | Bootstrap 5 + Inline CSS |
| HTTP Client | Axios |
| Backend Framework | FastAPI |
| ORM | SQLAlchemy |
| Database | PostgreSQL |
| Scheduling Engine | Google OR-Tools (CP-SAT) |
| Authentication | python-jose (JWT) |
| API Documentation | Swagger UI (auto-generated) |

---

## Architecture

```
staff-rostering-system/
├── app/
│   ├── main.py               # FastAPI app entry point, route registration
│   ├── database/
│   │   └── db.py             # SQLAlchemy engine and session setup
│   ├── models/               # ORM table definitions
│   │   ├── employee.py
│   │   ├── assignment.py
│   │   ├── availability.py
│   │   └── shift.py
│   ├── schemas/              # Pydantic request/response schemas
│   │   ├── employee.py
│   │   ├── ward.py
│   │   └── availability.py
│   ├── routes/               # API route handlers
│   │   ├── auth.py
│   │   ├── employee.py
│   │   ├── shift.py
│   │   ├── ward.py
│   │   ├── assignment.py
│   │   ├── availability.py
│   │   └── scheduler.py
│   └── services/
│       └── scheduler.py      # OR-Tools constraint solver
└── rostering-ui/
    └── src/
        └── pages/
            ├── Login.jsx
            ├── AdminDashboard.jsx
            └── EmployeeDashboard.jsx
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/login` | Authenticate and receive JWT token |
| `GET` | `/employees` | List all employees |
| `POST` | `/employees` | Create a new employee |
| `DELETE` | `/employees/{id}` | Remove an employee |
| `GET` | `/shifts` | List all shifts |
| `POST` | `/shifts` | Create a new shift |
| `DELETE` | `/shifts/{id}` | Remove a shift |
| `GET` | `/shifts/upcoming` | List all future shifts with ward info |
| `GET` | `/wards` | List all wards |
| `POST` | `/wards` | Create a new ward |
| `DELETE` | `/wards/{id}` | Remove a ward |
| `GET` | `/assignments` | List all assignments (filterable by employee) |
| `POST` | `/assignments` | Manually assign an employee to a shift |
| `DELETE` | `/assignments/{id}` | Remove an assignment |
| `GET` | `/availability` | List availability records (filterable by employee) |
| `POST` | `/availability` | Submit employee availability |
| `DELETE` | `/availability/{id}` | Remove an availability record |
| `POST` | `/generate-schedule` | Trigger automated schedule generation |
| `GET` | `/uncovered-shifts` | List all shifts without assignments |

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create the PostgreSQL database
createdb roster_db

# Start the backend server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
Interactive API docs are at `http://localhost:8000/docs`.

### Frontend Setup

```bash
cd rostering-ui

# Install dependencies
npm install

# Start the development server
npm run dev
```

The UI will be available at `http://localhost:5173`.

---

## Screenshots

### Admin Dashboard
<img width="1470" height="956" alt="Screenshot 2026-03-25 at 11 13 50" src="https://github.com/user-attachments/assets/d4ccaca6-856a-4328-8ed0-9bb41ef811d1" />

---

## Workflow

1. **Admin** creates wards, employees, and shifts via the dashboard.
2. **Employees** log in and submit their availability using the weekly calendar.
3. **Admin** triggers automated schedule generation — the OR-Tools solver assigns staff optimally.
4. **Admin** reviews coverage stats and fills any uncovered shifts manually if needed.
5. **Employees** view their confirmed assignments on their dashboard.
