from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.asset import Asset
from app.models.booking import ResourceBooking

from app.schemas.booking import BookingCreate

from app.core.enums import (
    AssetStatus,
    BookingStatus,
)


# ------------------------------------------------------
# Helper Function
# Check whether booking overlaps with existing bookings
# ------------------------------------------------------
def check_booking_overlap(
    db: Session,
    asset_id: int,
    start_time,
    end_time,
):
    """
    Returns an existing booking if overlap exists,
    otherwise returns None.
    """

    return (
        db.query(ResourceBooking)
        .filter(
            ResourceBooking.asset_id == asset_id,

            # Ignore cancelled bookings
            ResourceBooking.status != BookingStatus.CANCELLED,

            # Overlap Logic
            ResourceBooking.start_time < end_time,
            ResourceBooking.end_time > start_time,
        )
        .first()
    )


# ------------------------------------------------------
# Create Booking
# ------------------------------------------------------
def create_booking(
    db: Session,
    booking: BookingCreate,
):
    """
    Creates a new booking after validation.
    """

    # --------------------------------------------------
    # Step 1
    # Check Asset Exists
    # --------------------------------------------------

    asset = (
        db.query(Asset)
        .filter(
            Asset.id == booking.asset_id
        )
        .first()
    )

    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found."
        )

    # --------------------------------------------------
    # Step 2
    # Check Asset Bookable
    # --------------------------------------------------

    if not asset.is_bookable:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This asset is not bookable."
        )

    # --------------------------------------------------
    # Step 3
    # Check Asset Status
    # --------------------------------------------------

    if asset.status != AssetStatus.AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Asset is currently unavailable for booking."
        )

    # --------------------------------------------------
    # Step 4
    # Validate Time
    # --------------------------------------------------

    if booking.start_time >= booking.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be earlier than end time."
        )

    # --------------------------------------------------
    # Step 5
    # Overlap Validation
    # --------------------------------------------------

    existing_booking = check_booking_overlap(
        db=db,
        asset_id=booking.asset_id,
        start_time=booking.start_time,
        end_time=booking.end_time,
    )

    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking overlaps with an existing booking."
        )

    # --------------------------------------------------
    # Step 6
    # Create Booking Object
    # --------------------------------------------------

    new_booking = ResourceBooking(
        asset_id=booking.asset_id,
        booked_by_id=booking.booked_by_id,
        department_id=booking.department_id,
        start_time=booking.start_time,
        end_time=booking.end_time,
        purpose=booking.purpose,
        status=BookingStatus.UPCOMING,
    )

    # --------------------------------------------------
    # Step 7
    # Save to Database
    # --------------------------------------------------

    db.add(new_booking)

    db.commit()

    db.refresh(new_booking)

    return new_booking


# ------------------------------------------------------
# List All Bookings
# ------------------------------------------------------
def list_bookings(
    db: Session,
):
    """
    Returns all bookings ordered by latest booking first.
    """

    bookings = (
        db.query(ResourceBooking)
        .order_by(ResourceBooking.created_at.desc())
        .all()
    )

    return bookings


# ------------------------------------------------------
# Get Booking By ID
# ------------------------------------------------------
def get_booking(
    db: Session,
    booking_id: int,
):
    """
    Returns booking details by ID.
    """

    booking = (
        db.query(ResourceBooking)
        .filter(
            ResourceBooking.id == booking_id
        )
        .first()
    )

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found."
        )

    return booking


# ------------------------------------------------------
# Calendar Booking Data
# ------------------------------------------------------
def calendar_bookings(
    db: Session,
):
    """
    Returns booking data formatted for calendar view.
    """

    bookings = (
        db.query(ResourceBooking)
        .order_by(ResourceBooking.start_time.asc())
        .all()
    )

    calendar_events = []

    for booking in bookings:

        calendar_events.append(
            {
                "id": booking.id,
                "asset_id": booking.asset_id,
                "start_time": booking.start_time,
                "end_time": booking.end_time,
                "status": booking.status,
                "purpose": booking.purpose,
            }
        )

    return calendar_events

# ------------------------------------------------------
# Cancel Booking
# ------------------------------------------------------
def cancel_booking(
    db: Session,
    booking_id: int,
):
    """
    Cancel an existing booking.
    """

    booking = (
        db.query(ResourceBooking)
        .filter(ResourceBooking.id == booking_id)
        .first()
    )

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found."
        )

    if booking.status == BookingStatus.CANCELLED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is already cancelled."
        )

    booking.status = BookingStatus.CANCELLED

    db.commit()
    db.refresh(booking)

    return booking


# ------------------------------------------------------
# Reschedule Booking
# ------------------------------------------------------
def reschedule_booking(
    db: Session,
    booking_id: int,
    booking_update,
):
    """
    Reschedule an existing booking.
    """

    booking = (
        db.query(ResourceBooking)
        .filter(ResourceBooking.id == booking_id)
        .first()
    )

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found."
        )

    # ----------------------------------------------
    # Validate Time
    # ----------------------------------------------
    if booking_update.start_time >= booking_update.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time."
        )

    # ----------------------------------------------
    # Check Overlap
    # Ignore current booking
    # ----------------------------------------------
    existing_booking = (
        db.query(ResourceBooking)
        .filter(
            ResourceBooking.asset_id == booking.asset_id,

            ResourceBooking.id != booking.id,

            ResourceBooking.status != BookingStatus.CANCELLED,

            ResourceBooking.start_time < booking_update.end_time,

            ResourceBooking.end_time > booking_update.start_time,
        )
        .first()
    )

    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rescheduled booking overlaps with another booking."
        )

    booking.start_time = booking_update.start_time
    booking.end_time = booking_update.end_time
    booking.purpose = booking_update.purpose

    db.commit()
    db.refresh(booking)

    return booking


# ------------------------------------------------------
# Update Booking Status
# ------------------------------------------------------
def update_booking_status(
    db: Session,
    booking_id: int,
    new_status: BookingStatus,
):
    """
    Update booking status.
    """

    booking = (
        db.query(ResourceBooking)
        .filter(ResourceBooking.id == booking_id)
        .first()
    )

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found."
        )

    booking.status = new_status

    db.commit()
    db.refresh(booking)

    return booking