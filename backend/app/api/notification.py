from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.notification import (
    NotificationCreate,
    NotificationResponse,
)

from app.services.notification_service import (
    create_notification,
    list_user_notifications,
    unread_notifications,
    mark_notification_read,
    mark_all_notifications_read,
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


# ------------------------------------------------------
# Create Notification
# ------------------------------------------------------
@router.post(
    "/",
    response_model=NotificationResponse,
    status_code=201,
)
def create_notification_api(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
):
    return create_notification(
        db,
        notification,
    )


# ------------------------------------------------------
# List All Notifications of a User
# ------------------------------------------------------
@router.get(
    "/user/{user_id}",
    response_model=list[NotificationResponse],
)
def list_notifications_api(
    user_id: int,
    db: Session = Depends(get_db),
):
    return list_user_notifications(
        db,
        user_id,
    )


# ------------------------------------------------------
# List Unread Notifications
# ------------------------------------------------------
@router.get(
    "/user/{user_id}/unread",
    response_model=list[NotificationResponse],
)
def unread_notifications_api(
    user_id: int,
    db: Session = Depends(get_db),
):
    return unread_notifications(
        db,
        user_id,
    )


# ------------------------------------------------------
# Mark One Notification as Read
# ------------------------------------------------------
@router.put(
    "/{notification_id}/read",
    response_model=NotificationResponse,
)
def mark_notification_read_api(
    notification_id: int,
    db: Session = Depends(get_db),
):
    return mark_notification_read(
        db,
        notification_id,
    )


# ------------------------------------------------------
# Mark All Notifications as Read
# ------------------------------------------------------
@router.put(
    "/user/{user_id}/read-all",
)
def mark_all_notifications_read_api(
    user_id: int,
    db: Session = Depends(get_db),
):
    return mark_all_notifications_read(
        db,
        user_id,
    )