from datetime import datetime

from pydantic import BaseModel


class DashboardActivity(BaseModel):
    id: int
    actor_id: int
    action: str
    entity_type: str
    entity_id: int | None
    created_at: datetime


class DashboardSummary(BaseModel):
    total_assets: int
    available_assets: int
    active_allocations: int
    pending_transfers: int
    pending_returns: int
    open_maintenance: int
    unread_notifications: int
    recent_activity: list[DashboardActivity]