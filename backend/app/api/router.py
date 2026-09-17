from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.test_protected import router as test_protected_router


router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Sanjeevani AI API",
    }


router.include_router(
    auth_router,
    prefix="/auth",
)

router.include_router(
    test_protected_router,
)