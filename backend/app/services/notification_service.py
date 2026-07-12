from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.notification import Notification
from app.models.user import User

from app.schemas.notification import NotificationCreate

from app.core.enums import NotificationType
from app.models.user import User


# ------------------------------------------------------
# Check User Exists
# ------------------------------------------------------
def get_user(
    db: Session,
    user_id: int,
):
    """
    Returns the user if present.
    Raises 404 otherwise.
    """

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    return user


# ------------------------------------------------------
# Create Notification
# ------------------------------------------------------
def create_notification(
    db: Session,
    notification: NotificationCreate,
):
    """
    Reusable notification creation service.
    """

    # Check whether user exists
    get_user(db, notification.user_id)

    new_notification = Notification(
        user_id=notification.user_id,
        type=notification.type,
        message=notification.message,
        is_read=False,
    )

    db.add(new_notification)

    db.commit()

    db.refresh(new_notification)

    return new_notification
# ------------------------------------------------------
# List User Notifications
# ------------------------------------------------------
def list_user_notifications(
    db: Session,
    user_id: int,
):
    """
    Returns all notifications for a user.
    """

    # Check user exists
    get_user(db, user_id)

    notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id
        )
        .order_by(Notification.created_at.desc())
        .all()
    )

    return notifications


# ------------------------------------------------------
# List Unread Notifications
# ------------------------------------------------------
def unread_notifications(
    db: Session,
    user_id: int,
):
    """
    Returns unread notifications for a user.
    """

    # Check user exists
    get_user(db, user_id)

    notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        )
        .order_by(Notification.created_at.desc())
        .all()
    )

    return notifications


# ------------------------------------------------------
# Mark Notification as Read
# ------------------------------------------------------
def mark_notification_read(
    db: Session,
    notification_id: int,
):
    """
    Marks a notification as read.
    """

    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id
        )
        .first()
    )

    if notification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found."
        )

    notification.is_read = True

    db.commit()
    db.refresh(notification)

    return notification


# ------------------------------------------------------
# Mark All Notifications as Read
# ------------------------------------------------------
def mark_all_notifications_read(
    db: Session,
    user_id: int,
):
    """
    Marks all notifications of a user as read.
    """

    # Check user exists
    get_user(db, user_id)

    notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        )
        .all()
    )

    for notification in notifications:
        notification.is_read = True

    db.commit()

    return {
        "message": "All notifications marked as read."
    }