from contextlib import asynccontextmanager

from fastapi import FastAPI

import app.models

from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.bookings import router as bookings_router
from app.api.maintenance import router as maintenance_router
from app.api.notifications import router as notifications_router
from app.api.activity_log import router as activity_log_router

from app.db.base import Base
from app.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="AssetFlow API",
    description="Enterprise Asset & Resource Management System",
    version="1.0.0",
    lifespan=lifespan,
)


# Register API Routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(bookings_router)
app.include_router(maintenance_router)
app.include_router(notifications_router)
app.include_router(activity_log_router)


@app.get("/")
def root():
    return {
        "application": "AssetFlow",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }