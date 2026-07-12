from datetime import datetime

from pydantic import BaseModel, ConfigDict, model_validator

from app.core.enums import TransferStatus


class TransferCreate(BaseModel):
    asset_id: int
    target_employee_id: int | None = None
    target_department_id: int | None = None
    reason: str | None = None

    @model_validator(mode="after")
    def validate_target(self):
        if (
            self.target_employee_id is None
            and self.target_department_id is None
        ):
            raise ValueError(
                "Either target_employee_id or target_department_id is required"
            )

        if (
            self.target_employee_id is not None
            and self.target_department_id is not None
        ):
            raise ValueError(
                "Transfer target must be either employee or department, not both"
            )

        return self


class TransferResponse(BaseModel):
    id: int
    asset_id: int
    requested_by_id: int
    target_employee_id: int | None
    target_department_id: int | None
    approved_by_id: int | None
    status: TransferStatus
    reason: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)