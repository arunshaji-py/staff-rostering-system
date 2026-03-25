# 🏥 Staff Rostering System

AI-powered staff rostering system with automated scheduling, manual assignment, and real-time shift coverage tracking.

---

## 🚀 Features

- ✅ Auto schedule generation
- ✅ Manual shift assignment
- ✅ Uncovered shift tracking
- ✅ Employee filtering (gender-based)
- ✅ Real-time coverage analytics
- ✅ Admin dashboard

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Axios
- Bootstrap

**Backend**
- FastAPI
- PostgreSQL
- SQLAlchemy

---

## 📊 System Overview

- Admin can generate schedules automatically
- Admin can manually assign employees to shifts
- System tracks uncovered shifts
- Coverage % calculated dynamically

---

## 📸 Screenshots

### Admin Dashboard<img width="1470" height="956" alt="Screenshot 2026-03-25 at 11 13 50" src="https://github.com/user-attachments/assets/d4ccaca6-856a-4328-8ed0-9bb41ef811d1" />

![Dashboard](./screenshots/dashboard.png)

---

## ⚙️ Installation

### Backend
```bash
cd app
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

## 🌐 API Endpoints

- `/generate-schedule` → Generate automatic shift schedule  
- `/assignments` → Get all assigned shifts / create assignment  
- `/uncovered-shifts` → Get shifts without assigned employees  
- `/employees` → Manage employee data  
- `/wards` → Manage ward data

## Author

Arun Shaji


uvicorn main:app --reload
