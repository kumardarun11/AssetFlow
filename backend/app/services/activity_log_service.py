from typing import Optional

from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog
from app.schemas.activity_log import ActivityLogCreate


# ------------------------------------------------------
# Reusable Activity Logger
# ------------------------------------------------------
def log_activity(
    db: Session,
    actor_id: int,
    action: str,
    entity_type: str,
    entity_id: Optional[int] = None,
):
    log = ActivityLog(
        actor_id=actor_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


# ------------------------------------------------------
# Create Activity Log
# ------------------------------------------------------
def create_activity_log(
    db: Session,
    activity: ActivityLogCreate,
):
    return log_activity(
        db=db,
        actor_id=activity.actor_id,
        action=activity.action,
        entity_type=activity.entity_type,
        entity_id=activity.entity_id,
    )


# ------------------------------------------------------
# List Activity Logs
# ------------------------------------------------------
def list_activity_logs(
    db: Session,
):
    return (
        db.query(ActivityLog)
        .order_by(ActivityLog.created_at.desc())
        .all()
    )


# ------------------------------------------------------
# Filter Activity Logs
# ------------------------------------------------------
def filter_activity_logs(
    db: Session,
    actor_id: Optional[int] = None,
    entity_type: Optional[str] = None,
    action: Optional[str] = None,
):

    query = db.query(ActivityLog)

    if actor_id is not None:
        query = query.filter(
            ActivityLog.actor_id == actor_id
        )

    if entity_type is not None:
        query = query.filter(
            ActivityLog.entity_type == entity_type
        )

    if action is not None:
        query = query.filter(
            ActivityLog.action == action
        )

    return (
        query.order_by(ActivityLog.created_at.desc())
        .all()
    )