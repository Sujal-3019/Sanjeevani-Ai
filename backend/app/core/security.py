import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Callable

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User, UserRole


# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------

password_hash = PasswordHash(
    (
        Argon2Hasher(),
    )
)


def hash_password(password: str) -> str:
    """Hash a user password using Argon2."""
    return password_hash.hash(password)


def verify_password(
    password: str,
    password_hash_value: str,
) -> bool:
    """Verify a plain password against its Argon2 hash."""
    return password_hash.verify(
        password,
        password_hash_value,
    )


# ---------------------------------------------------------------------------
# OTP
# ---------------------------------------------------------------------------

OTP_LENGTH = 6
OTP_EXPIRE_MINUTES = 5
OTP_MAX_ATTEMPTS = 5


def generate_otp() -> str:
    """Generate a cryptographically secure six-digit OTP."""
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp(otp: str) -> str:
    """Hash an OTP before storing it in the database."""
    return hashlib.sha256(
        otp.encode("utf-8"),
    ).hexdigest()


def verify_otp(
    otp: str,
    otp_hash_value: str,
) -> bool:
    """Verify a plain OTP against its stored hash."""
    expected_hash = hash_otp(otp)

    return secrets.compare_digest(
        expected_hash,
        otp_hash_value,
    )


def get_otp_expiry() -> datetime:
    """Return the expiration timestamp for a newly generated OTP."""
    return datetime.now(timezone.utc) + timedelta(
        minutes=OTP_EXPIRE_MINUTES,
    )


# ---------------------------------------------------------------------------
# JWT
# ---------------------------------------------------------------------------

def create_access_token(
    user_id: str,
    role: str,
) -> str:
    """Create a JWT access token."""
    now = datetime.now(timezone.utc)

    expires_at = now + timedelta(
        minutes=settings.access_token_expire_minutes,
    )

    payload = {
        "sub": user_id,
        "role": role,
        "type": "access",
        "iat": now,
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def create_refresh_token(
    user_id: str,
) -> tuple[str, datetime]:
    """Create a JWT refresh token and return its expiration time."""
    now = datetime.now(timezone.utc)

    expires_at = now + timedelta(
        days=settings.refresh_token_expire_days,
    )

    payload = {
        "sub": user_id,
        "type": "refresh",
        "iat": now,
        "exp": expires_at,
        "jti": secrets.token_urlsafe(32),
    }

    token = jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )

    return token, expires_at


def decode_token(token: str) -> dict:
    """Decode and validate a JWT token."""
    return jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
    )


# ---------------------------------------------------------------------------
# Refresh-token storage
# ---------------------------------------------------------------------------

def hash_refresh_token(token: str) -> str:
    """Hash a refresh token before storing it in the database."""
    return hashlib.sha256(
        token.encode("utf-8"),
    ).hexdigest()


# ---------------------------------------------------------------------------
# FastAPI authentication
# ---------------------------------------------------------------------------

bearer_scheme = HTTPBearer(
    auto_error=False,
)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(
        bearer_scheme,
    ),
    db: Session = Depends(get_db),
) -> User:
    """
    Get the currently authenticated user from the JWT access token.
    """

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    token = credentials.credentials

    try:
        payload = decode_token(token)
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    try:
        user = db.scalar(
            select(User).where(
                User.id == user_id,
            )
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to verify the authenticated user.",
        )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )

    return user


# ---------------------------------------------------------------------------
# Role-based authorization
# ---------------------------------------------------------------------------

def require_roles(
    *allowed_roles: UserRole,
) -> Callable:
    """
    Create a FastAPI dependency that allows only the supplied roles.
    """

    def role_dependency(
        current_user: User = Depends(get_current_user),
    ) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource.",
            )

        return current_user

    return role_dependency