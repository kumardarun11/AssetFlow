from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models

from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.allocations import router as allocations_router
from app.api.transfers import router as transfers_router
from app.api.returns import router as returns_router

from app.api import booking
from app.api import notification
from app.api import maintenance
from app.api import activity_log

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


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Core Routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(allocations_router)
app.include_router(transfers_router)
app.include_router(returns_router)


# Booking APIs
app.include_router(
    booking.router,
    prefix="/api/bookings",
    tags=["Bookings"],
)

# Notification APIs
app.include_router(
    notification.router,
    prefix="/api/notifications",
    tags=["Notifications"],
)

# Maintenance APIs
app.include_router(
    maintenance.router,
    prefix="/api/maintenance",
    tags=["Maintenance"],
)

# Activity Log APIs
app.include_router(
    activity_log.router,
    prefix="/api",
    tags=["Activity Logs"],
)


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