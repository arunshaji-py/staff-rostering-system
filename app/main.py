from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import scheduler as scheduler_routes
from app.routes import shift as shift_routes
from app.routes import assignment as assignment_routes
from app.routes import employee as employee_routes
from app.routes import auth

from app.database.db import engine, Base
from app.models import employee, assignment, availability, shift
from app.routes import ward as ward_routes


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create tables
Base.metadata.create_all(bind=engine)

# register routes
app.include_router(employee_routes.router)
app.include_router(assignment_routes.router)
app.include_router(shift_routes.router)
app.include_router(scheduler_routes.router)
app.include_router(auth.router)
app.include_router(ward_routes.router)
