
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencies import require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.ambulance import (
    AmbulanceCreate,
    AmbulanceResponse,
    AmbulanceUpdate,
)
from app.services.ambulance_service import (
    AmbulanceNotFoundError,
    HospitalProfileRequiredError,
    create_ambulance,
    delete_ambulance,
    get_hospital_for_admin,
    list_ambulances,
    update_ambulance,
)


router = APIRouter(
    prefix="/hospital/ambulances",
    tags=["Hospital Ambulances"],
)

hospital_admin_dependency = require_roles(
    UserRole.HOSPITAL_ADMIN,
)


def get_hospital_id(db: Session, admin: User):
    try:
        hospital = get_hospital_for_admin(db, admin)
        return hospital.id
    except HospitalProfileRequiredError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.get(
    "",
    response_model=list[AmbulanceResponse],
)
def get_ambulances(
    current_user: User = Depends(hospital_admin_dependency),
    db: Session = Depends(get_db),
):
    hospital_id = get_hospital_id(db, current_user)

    return list_ambulances(db, hospital_id)


@router.post(
    "",
    response_model=AmbulanceResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_ambulance(
    data: AmbulanceCreate,
    current_user: User = Depends(hospital_admin_dependency),
    db: Session = Depends(get_db),
):
    hospital_id = get_hospital_id(db, current_user)

    try:
        return create_ambulance(db, hospital_id, data)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "An ambulance with this code or registration "
                "number already exists for your hospital."
            ),
        ) from exc


@router.put(
    "/{ambulance_id}",
    response_model=AmbulanceResponse,
)
def edit_ambulance(
    ambulance_id: UUID,
    data: AmbulanceUpdate,
    current_user: User = Depends(hospital_admin_dependency),
    db: Session = Depends(get_db),
):
    hospital_id = get_hospital_id(db, current_user)

    try:
        return update_ambulance(
            db,
            hospital_id,
            ambulance_id,
            data,
        )
    except AmbulanceNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "An ambulance with this code or registration "
                "number already exists for your hospital."
            ),
        ) from exc


@router.delete(
    "/{ambulance_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_ambulance(
    ambulance_id: UUID,
    current_user: User = Depends(hospital_admin_dependency),
    db: Session = Depends(get_db),
):
    hospital_id = get_hospital_id(db, current_user)

    try:
        delete_ambulance(db, hospital_id, ambulance_id)
    except AmbulanceNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return None
