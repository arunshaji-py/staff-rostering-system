#!/bin/zsh

# Move to project folder
cd ~/Projects/staff-rostering-system

# Activate virtual environment
source venv/bin/activate

# Start FastAPI server
uvicorn app.main:app --reload
