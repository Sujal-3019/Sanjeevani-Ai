from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class EmergencyContactCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=150,
    )

    relationship: str = Field(
        min_length=2,
        max_length=50,
    )

    mobile_number: str = Field(
        min_length=10,
        max_length=15,
    )

    email: EmailStr | None = None

    is_primary: bool = False

    @field_validator(
        "name",
        "relationship",
    )
    @classmethod
    def validate_text(
        cls,
        value: str,
    ) -> str:
        value = value.strip()

        if not value:
            raise ValueError(
                "This field cannot be empty."
            )

        return value

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_number(
        cls,
        value: str,
    ) -> str:
        digits = "".join(
            character
            for character in value
            if character.isdigit()
        )

        if len(digits) != 10:
            raise ValueError(
                "Mobile number must contain exactly 10 digits."
            )

        if not digits.startswith(
            ("6", "7", "8", "9")
        ):
            raise ValueError(
                "Please enter a valid Indian mobile number."
            )

        return digits

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value):
        if value is None:
            return None

        value = str(value).strip()

        return value.lower() if value else None


class EmergencyContactUpdate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=150,
    )

    relationship: str = Field(
        min_length=2,
        max_length=50,
    )

    mobile_number: str = Field(
        min_length=10,
        max_length=15,
    )

    email: EmailStr | None = None

    is_primary: bool = False

    @field_validator(
        "name",
        "relationship",
    )
    @classmethod
    def validate_text(
        cls,
        value: str,
    ) -> str:
        value = value.strip()

        if not value:
            raise ValueError(
                "This field cannot be empty."
            )

        return value

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_number(
        cls,
        value: str,
    ) -> str:
        digits = "".join(
            character
            for character in value
            if character.isdigit()
        )

        if len(digits) != 10:
            raise ValueError(
                "Mobile number must contain exactly 10 digits."
            )

        if not digits.startswith(
            ("6", "7", "8", "9")
        ):
            raise ValueError(
                "Please enter a valid Indian mobile number."
            )

        return digits

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value):
        if value is None:
            return None

        value = str(value).strip()

        return value.lower() if value else None


class EmergencyContactResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID
    name: str
    relationship: str
    mobile_number: str
    email: str | None
    is_primary: bool


class EmergencyContactListResponse(BaseModel):
    contacts: list[EmergencyContactResponse]