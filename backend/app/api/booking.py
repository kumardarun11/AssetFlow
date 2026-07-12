from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.booking import (
    BookingCreate,
    BookingUpdate,
    BookingResponse,
)

from app.core.enums import BookingStatus

from app.services.booking_service import (
    create_booking,
    list_bookings,
    get_booking,
    calendar_bookings,
    cancel_booking,
    reschedule_booking,
    update_booking_status,
)

router = APIRouter()


# ------------------------------------------------------
# Create Booking
# ------------------------------------------------------
@router.post(
    "/",
    response_model=BookingResponse,
    status_code=201,
)
def create_booking_api(
    booking: BookingCreate,
    db: Session = Depends(get_db),
):
    return create_booking(db, booking)


# ------------------------------------------------------
# List All Bookings
# ------------------------------------------------------
@router.get(
    "/",
    response_model=list[BookingResponse],
)
def list_bookings_api(
    db: Session = Depends(get_db),
):
    return list_bookings(db)


# ------------------------------------------------------
# Get Booking By ID
# ------------------------------------------------------
@router.get(
    "/{booking_id}",
    response_model=BookingResponse,
)
def get_booking_api(
    booking_id: int,
    db: Session = Depends(get_db),
):
    return get_booking(db, booking_id)


# ------------------------------------------------------
# Calendar Data
# ------------------------------------------------------
@router.get("/calendar")
def booking_calendar_api(
    db: Session = Depends(get_db),
):
    return calendar_bookings(db)


# ------------------------------------------------------
# Cancel Booking
# ------------------------------------------------------
@router.put(
    "/{booking_id}/cancel",
    response_model=BookingResponse,
)
def cancel_booking_api(
    booking_id: int,
    db: Session = Depends(get_db),
):
    return cancel_booking(db, booking_id)


# ------------------------------------------------------
# Reschedule Booking
# ------------------------------------------------------
@router.put(
    "/{booking_id}/reschedule",
    response_model=BookingResponse,
)
def reschedule_booking_api(
    booking_id: int,
    booking: BookingUpdate,
    db: Session = Depends(get_db),
):
    return reschedule_booking(
        db,
        booking_id,
        booking,
    )


# ------------------------------------------------------
# Update Booking Status
# ------------------------------------------------------
@router.put(
    "/{booking_id}/status",
    response_model=BookingResponse,
)
def update_booking_status_api(
    booking_id: int,
    booking_status: BookingStatus,
    db: Session = Depends(get_db),
):
    return update_booking_status(
        db,
        booking_id,
        booking_status,
    )