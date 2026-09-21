import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class EmergencyEventStatus(str, enum.Enum):
    CREATED = "CREATED"
    ASSESSING = "ASSESSING"
    COORDINATING = "COORDINATING"
    HOSPITAL_SELECTED = "HOSPITAL_SELECTED"
    AMBULANCE_ASSIGNMENT = "AMBULANCE_ASSIGNMENT"
    AMBULANCE_ASSIGNED = "AMBULANCE_ASSIGNED"
    PARAMEDIC_ASSIGNED = "PARAMEDIC_ASSIGNED"
    PATIENT_PICKED_UP = "PATIENT_PICKED_UP"
    TRANSPORTING = "TRANSPORTING"
    ARRIVED_AT_HOSPITAL = "ARRIVED_AT_HOSPITAL"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class EmergencyEvent(Base):
    __tablename__ = "emergency_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    sos_request_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "sos_requests.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        unique=True,
        index=True,
    )

    status: Mapped[EmergencyEventStatus] = mapped_column(
        Enum(
            EmergencyEventStatus,
            name="emergency_event_status",
            native_enum=True,
        ),
        nullable=False,
        default=EmergencyEventStatus.CREATED,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    sos_request = relationship(
        "SOSRequest",
        back_populates="emergency_event",
    )