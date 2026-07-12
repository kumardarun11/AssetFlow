from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ------------------------------------------------------
# Create Activity Log
# ------------------------------------------------------
class ActivityLogCreate(BaseModel):
    actor_id: int
    action: str
    entity_type: str
    entity_id: Optional[int] = None


# ------------------------------------------------------
# Activity Log Response
# ------------------------------------------------------
class ActivityLogResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    actor_id: int
    action: str
    entity_type: str
    entity_id: Optional[int]
    created_at: datetime