from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.activity_log import (
    ActivityLogCreate,
    ActivityLogResponse,
)

from app.services.activity_log_service import (
    create_activity_log,
    list_activity_logs,
    filter_activity_logs,
)

router = APIRouter(
    prefix="/activity-logs",
    tags=["Activity Logs"],
)


# ------------------------------------------------------
# Create Activity Log
# ------------------------------------------------------
@router.post(
    "/",
    response_model=ActivityLogResponse,
    status_code=201,
)
def create_activity_log_api(
    activity: ActivityLogCreate,
    db: Session = Depends(get_db),
):
    return create_activity_log(
        db,
        activity,
    )


# ------------------------------------------------------
# List / Filter Activity Logs
# ------------------------------------------------------
@router.get(
    "/",
    response_model=list[ActivityLogResponse],
)
def list_activity_logs_api(
    actor_id: Optional[int] = None,
    entity_type: Optional[str] = None,
    action: Optional[str] = None,
    db: Session = Depends(get_db),
):

    if (
        actor_id is not None
        or entity_type is not None
        or action is not None
    ):
        return filter_activity_logs(
            db,
            actor_id,
            entity_type,
            action,
        )

    return list_activity_logs(db)