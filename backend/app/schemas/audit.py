from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.core.enums import AuditItemStatus, AuditStatus


class AuditCycleCreate(BaseModel):
    name: str
    department_id: int | None = None
    location: str | None = None
    start_date: date
    end_date: date
    created_by_id: int


class AuditAuditorCreate(BaseModel):
    auditor_id: int


class AuditItemCreate(BaseModel):
    asset_id: int


class AuditItemVerify(BaseModel):
    status: AuditItemStatus
    discrepancy_notes: str | None = None
    verified_by_id: int


class AuditCycleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    department_id: int | None
    location: str | None
    start_date: date
    end_date: date
    status: AuditStatus
    created_by_id: int
    created_at: datetime
    updated_at: datetime


class AuditAuditorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    audit_cycle_id: int
    auditor_id: int


class AuditItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    audit_cycle_id: int
    asset_id: int
    verified_by_id: int | None
    status: AuditItemStatus
    discrepancy_notes: str | None
    verified_at: datetime | None


class AuditDiscrepancyResponse(BaseModel):
    total: int
    items: list[AuditItemResponse]