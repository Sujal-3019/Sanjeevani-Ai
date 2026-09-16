from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.router import router as api_router
from app.core.config import settings
from app.db.session import engine


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


@app.get("/")
def root():
    return {
        "message": "Welcome to Sanjeevani AI API",
        "version": "1.0.0",
    }


@app.get("/api/database-test")
def database_test():
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT current_database(), version()")
        )

        database_name, database_version = result.fetchone()

    return {
        "status": "connected",
        "database": database_name,
        "postgresql": database_version,
    }