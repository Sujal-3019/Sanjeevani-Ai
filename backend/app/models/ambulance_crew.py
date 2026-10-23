
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.ambulance import Ambulance


class AmbulanceCrew(Base):
    __tablename__ = "ambulance_crew"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    ambulance_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("ambulances.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(String(150), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False, default="Other")
    qualification: Mapped[str] = mapped_column(String(150), nullable=False, default="")
    is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    ambulance: Mapped["Ambulance"] = relationship(
        "Ambulance",
        back_populates="crew",
    )
