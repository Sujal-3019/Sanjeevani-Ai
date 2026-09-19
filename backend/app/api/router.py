from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.test_protected import router as test_protected_router
from app.api.patient import router as patient_router
from app.api.emergency_contacts import (
    router as emergency_contacts_router,
)

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

router.include_router(
    patient_router,
    prefix="/patient",
)

router.include_router(
    emergency_contacts_router,
    prefix="/patient",
)