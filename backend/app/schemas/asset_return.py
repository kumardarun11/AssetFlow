from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.core.enums import AssetCondition, ReturnStatus


class ReturnCreate(BaseModel):
    allocation_id: int


class ReturnApprove(BaseModel):
    condition: AssetCondition
    check_in_notes: str | None = None


class ReturnResponse(BaseModel):
    id: int
    allocation_id: int
    requested_by_id: int
    approved_by_id: int | None
    condition: AssetCondition | None
    check_in_notes: str | None
    status: ReturnStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)