from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class DepartmentCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    parent_department_id: int | None = None
    department_head_id: int | None = None
    status: str = "ACTIVE"


class DepartmentUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    parent_department_id: int | None = None
    department_head_id: int | None = None
    status: str | None = None


class DepartmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    parent_department_id: int | None
    department_head_id: int | None
    status: str
    created_at: datetime
    updated_at: datetime