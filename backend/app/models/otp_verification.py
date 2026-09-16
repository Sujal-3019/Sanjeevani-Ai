import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class OTPPurpose(str, enum.Enum):
    LOGIN = "LOGIN"
    REGISTRATION = "REGISTRATION"
    PHONE_VERIFICATION = "PHONE_VERIFICATION"
    EMAIL_VERIFICATION = "EMAIL_VERIFICATION"
    PASSWORD_RESET = "PASSWORD_RESET"


class OTPChannel(str, enum.Enum):
    SMS = "SMS"
    EMAIL = "EMAIL"


class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    channel: Mapped[OTPChannel] = mapped_column(
        Enum(
            OTPChannel,
            name="otp_channel",
            native_enum=True,
        ),
        nullable=False,
        index=True,
    )

    destination: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    otp_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    purpose: Mapped[OTPPurpose] = mapped_column(
        Enum(
            OTPPurpose,
            name="otp_purpose",
            native_enum=True,
        ),
        nullable=False,
        index=True,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    attempts: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    used_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )