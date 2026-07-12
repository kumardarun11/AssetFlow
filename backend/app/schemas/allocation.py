from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, model_validator


class AllocationCreate(BaseModel):
    asset_id: int
    employee_id: int | None = None
    department_id: int | None = None
    expected_return_date: date | None = None
    notes: str | None = None

    @model_validator(mode="after")
    def validate_holder(self):
        if self.employee_id is None and self.department_id is None:
            raise ValueError(
                "Either employee_id or department_id is required"
            )

        if (
            self.employee_id is not None
            and self.department_id is not None
        ):
            raise ValueError(
                "Asset can be allocated to either an employee or department, not both"
            )

        return self


class AllocationResponse(BaseModel):
    id: int
    asset_id: int
    employee_id: int | None
    department_id: int | None
    allocated_by_id: int
    allocated_at: datetime
    expected_return_date: date | None
    returned_at: datetime | None
    is_active: bool
    notes: str | None
    is_overdue: bool = False

    model_config = ConfigDict(from_attributes=True)