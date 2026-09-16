from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


from app.models import (
    OAuthAccount,
    OTPVerification,
    RefreshToken,
    User,
)