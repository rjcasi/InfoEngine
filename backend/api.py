from fastapi import FastAPI
from backend.routes.api import router as organ_router

fastapi_app = FastAPI(
    title="InfoEngine Organ API",
    description="FastAPI backend for organ analysis",
    version="1.0.0"
)

# Mount all organ routes under /organs
fastapi_app.include_router(organ_router, prefix="/organs")