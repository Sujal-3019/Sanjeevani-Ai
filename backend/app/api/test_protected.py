from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user, require_roles
from app.models.user import User, UserRole


router = APIRouter(
    prefix="/test",
    tags=[" Temporary Authorization Test"],
)


@router.get("/authenticated")
def authenticated_endpoint(
    current_user: User = Depends(get_current_user),
):
    return {
        "message": "Authenticated access successful.",
        "user_id": str(current_user.id),
        "role": current_user.role.value,
    }


@router.get("/patient")
def patient_endpoint(
    current_user: User = Depends(
        require_roles(UserRole.PATIENT)
    ),
):
    return {
        "message": "Patient-only access successful.",
        "user_id": str(current_user.id),
        "role": current_user.role.value,
    }


@router.get("/hospital-admin")
def hospital_admin_endpoint(
    current_user: User = Depends(
        require_roles(UserRole.HOSPITAL_ADMIN)
    ),
):
    return {
        "message": "Hospital admin access successful.",
        "user_id": str(current_user.id),
        "role": current_user.role.value,
    }


@router.get("/paramedic")
def paramedic_endpoint(
    current_user: User = Depends(
        require_roles(UserRole.PARAMEDIC)
    ),
):
    return {
        "message": "Paramedic access successful.",
        "user_id": str(current_user.id),
        "role": current_user.role.value,
    }