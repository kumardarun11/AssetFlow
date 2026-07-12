from contextlib import asynccontextmanager

from fastapi import FastAPI

import app.models
from app.api.auth import router as auth_router
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
app.include_router(auth_router)

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
        "status": "healthy"
    }