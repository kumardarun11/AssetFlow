from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.core.enums import NotificationType


# ------------------------------------------------------
# Create Notification
# ------------------------------------------------------
class NotificationCreate(BaseModel):
    user_id: int
    type: NotificationType
    message: str


# ------------------------------------------------------
# Mark Notification Read
# ------------------------------------------------------
class NotificationRead(BaseModel):
    is_read: bool = True


# ------------------------------------------------------
# Notification Response
# ------------------------------------------------------
class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    type: NotificationType
    message: str
    is_read: bool
    created_at: datetime


# ------------------------------------------------------
# Notification List Response
# ------------------------------------------------------
class NotificationList(BaseModel):
    total: int
    notifications: list[NotificationResponse]