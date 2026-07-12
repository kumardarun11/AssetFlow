from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.core.enums import (
    MaintenancePriority,
    MaintenanceStatus,
)


# ------------------------------------------------------
# Raise Maintenance Request
# ------------------------------------------------------
class MaintenanceCreate(BaseModel):
    asset_id: int
    requested_by_id: int
    issue_description: str
    priority: MaintenancePriority = MaintenancePriority.MEDIUM
    photo_url: Optional[str] = None


# ------------------------------------------------------
# Approve Maintenance
# ------------------------------------------------------
class MaintenanceApprove(BaseModel):
    approved_by_id: int


# ------------------------------------------------------
# Reject Maintenance
# ------------------------------------------------------
class MaintenanceReject(BaseModel):
    approved_by_id: int


# ------------------------------------------------------
# Assign Technician
# ------------------------------------------------------
class AssignTechnician(BaseModel):
    technician_id: int


# ------------------------------------------------------
# Update Status
# ------------------------------------------------------
class MaintenanceStatusUpdate(BaseModel):
    status: MaintenanceStatus


# ------------------------------------------------------
# Maintenance Response
# ------------------------------------------------------
class MaintenanceResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int

    asset_id: int

    requested_by_id: int

    approved_by_id: Optional[int]

    technician_id: Optional[int]

    issue_description: str

    priority: MaintenancePriority

    status: MaintenanceStatus

    photo_url: Optional[str]

    resolved_at: Optional[datetime]

    created_at: datetime

    updated_at: datetime


# ------------------------------------------------------
# Maintenance History Response
# ------------------------------------------------------
class MaintenanceHistory(BaseModel):

    total: int

    maintenance_requests: list[MaintenanceResponse]