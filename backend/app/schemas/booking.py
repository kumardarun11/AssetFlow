from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.core.enums import BookingStatus


# -----------------------------
# Create Booking Schema
# -----------------------------
class BookingCreate(BaseModel):
    asset_id: int
    booked_by_id: int
    department_id: Optional[int] = None

    start_time: datetime
    end_time: datetime

    purpose: Optional[str] = None


# -----------------------------
# Update Booking Schema
# (Used for Reschedule)
# -----------------------------
class BookingUpdate(BaseModel):
    start_time: datetime
    end_time: datetime
    purpose: Optional[str] = None


# -----------------------------
# Booking Status Update
# -----------------------------
class BookingStatusUpdate(BaseModel):
    status: BookingStatus


# -----------------------------
# Booking Response Schema
# -----------------------------
class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int

    asset_id: int
    booked_by_id: int
    department_id: Optional[int]

    start_time: datetime
    end_time: datetime

    purpose: Optional[str]

    status: BookingStatus

    created_at: datetime
    updated_at: datetime


# -----------------------------
# Booking Calendar Response
# -----------------------------
class BookingCalendar(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int

    asset_id: int

    start_time: datetime
    end_time: datetime

    status: BookingStatus


# -----------------------------
# Booking List Response
# -----------------------------
class BookingList(BaseModel):
    total: int
    bookings: list[BookingResponse]