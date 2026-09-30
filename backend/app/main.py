from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.router import router as api_router
from app.core.config import settings
from app.db.session import engine
from app.api.emergency_share import router as emergency_share_router

app = FastAPI(
    title=settings.app_name,
    description="AI-powered emergency healthcare coordination platform",
    version="1.0.0",
    debug=settings.debug,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    api_router,
    prefix="/api",
)

app.include_router(
    emergency_share_router,
    prefix="/api",
)

@app.get("/")
def root():
    return {
        "message": "Welcome to Sanjeevani AI API",
        "version": "1.0.0",
    }
