import enum
import uuid
from datetime import datetime

from geoalchemy2 import Geography
from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class SOSRequestStatus(str, enum.Enum):
    CREATED = "CREATED"
    CANCELLED = "CANCELLED"


class EmergencyType(str, enum.Enum):
    CHEST_PAIN = "CHEST_PAIN"
    BREATHING_DIFFICULTY = "BREATHING_DIFFICULTY"
    STROKE = "STROKE"
    SEVERE_BLEEDING = "SEVERE_BLEEDING"
    ROAD_ACCIDENT = "ROAD_ACCIDENT"
    BURNS = "BURNS"
    UNCONSCIOUS = "UNCONSCIOUS"
    SEIZURE = "SEIZURE"
    PREGNANCY_EMERGENCY = "PREGNANCY_EMERGENCY"
    POISONING = "POISONING"
    SEVERE_ALLERGIC_REACTION = "SEVERE_ALLERGIC_REACTION"
    OTHER = "OTHER"


class SOSRequest(Base):
    __tablename__ = "sos_requests"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    patient_profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "patient_profiles.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    emergency_type: Mapped[EmergencyType] = mapped_column(
        Enum(
            EmergencyType,
            name="emergency_type",
            native_enum=True,
        ),
        nullable=False,
        index=True,
    )

    emergency_details: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    location: Mapped[object] = mapped_column(
        Geography(
            geometry_type="POINT",
            srid=4326,
            spatial_index=True,
        ),
        nullable=False,
    )

    status: Mapped[SOSRequestStatus] = mapped_column(
        Enum(
            SOSRequestStatus,
            name="sos_request_status",
            native_enum=True,
        ),
        nullable=False,
        default=SOSRequestStatus.CREATED,
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

    patient_profile = relationship(
        "PatientProfile",
        back_populates="sos_requests",
    )

    emergency_event = relationship(
        "EmergencyEvent",
        back_populates="sos_request",
        uselist=False,
        cascade="all, delete-orphan",
        passive_deletes=True,
    )