from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.user import User
from app.models.maintenance import MaintenanceRequest

from app.schemas.maintenance import MaintenanceCreate
from app.schemas.maintenance import MaintenanceStatusUpdate

from app.core.enums import (
    AssetStatus,
    MaintenanceStatus,
)


# ------------------------------------------------------
# Check Asset Exists
# ------------------------------------------------------
def get_asset(
    db: Session,
    asset_id: int,
):
    asset = (
        db.query(Asset)
        .filter(Asset.id == asset_id)
        .first()
    )

    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found."
        )

    return asset


# ------------------------------------------------------
# Check User Exists
# ------------------------------------------------------
def get_user(
    db: Session,
    user_id: int,
):
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
# Raise Maintenance Request
# ------------------------------------------------------
def create_maintenance_request(
    db: Session,
    maintenance: MaintenanceCreate,
):
    """
    Raise a new maintenance request.
    """

    get_asset(db, maintenance.asset_id)
    get_user(db, maintenance.requested_by_id)

    request = MaintenanceRequest(
        asset_id=maintenance.asset_id,
        requested_by_id=maintenance.requested_by_id,
        issue_description=maintenance.issue_description,
        priority=maintenance.priority,
        photo_url=maintenance.photo_url,
        status=MaintenanceStatus.PENDING,
    )

    db.add(request)

    db.commit()

    db.refresh(request)

    return request


# ------------------------------------------------------
# List Maintenance Requests
# ------------------------------------------------------
def list_maintenance_requests(
    db: Session,
):
    return (
        db.query(MaintenanceRequest)
        .order_by(
            MaintenanceRequest.created_at.desc()
        )
        .all()
    )


# ------------------------------------------------------
# Get Maintenance Details
# ------------------------------------------------------
def get_maintenance_request(
    db: Session,
    maintenance_id: int,
):
    request = (
        db.query(MaintenanceRequest)
        .filter(
            MaintenanceRequest.id == maintenance_id
        )
        .first()
    )

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Maintenance request not found."
        )

    return request
# ------------------------------------------------------
# Approve Maintenance Request
# ------------------------------------------------------
def approve_maintenance_request(
    db: Session,
    maintenance_id: int,
    approved_by_id: int,
):
    """
    Approve a maintenance request and
    change the asset status to UNDER_MAINTENANCE.
    """

    request = get_maintenance_request(db, maintenance_id)

    get_user(db, approved_by_id)

    asset = get_asset(db, request.asset_id)

    if request.status != MaintenanceStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending requests can be approved."
        )

    request.approved_by_id = approved_by_id
    request.status = MaintenanceStatus.APPROVED

    asset.status = AssetStatus.UNDER_MAINTENANCE

    db.commit()
    db.refresh(request)

    return request


# ------------------------------------------------------
# Reject Maintenance Request
# ------------------------------------------------------
def reject_maintenance_request(
    db: Session,
    maintenance_id: int,
    approved_by_id: int,
):
    """
    Reject a maintenance request.
    """

    request = get_maintenance_request(db, maintenance_id)

    get_user(db, approved_by_id)

    if request.status != MaintenanceStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending requests can be rejected."
        )

    request.approved_by_id = approved_by_id
    request.status = MaintenanceStatus.REJECTED

    db.commit()
    db.refresh(request)

    return request


# ------------------------------------------------------
# Assign Technician
# ------------------------------------------------------
def assign_technician(
    db: Session,
    maintenance_id: int,
    technician_id: int,
):
    """
    Assign a technician to a maintenance request.
    """

    request = get_maintenance_request(db, maintenance_id)

    get_user(db, technician_id)

    if request.status != MaintenanceStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maintenance request must be approved first."
        )

    request.technician_id = technician_id
    request.status = MaintenanceStatus.TECHNICIAN_ASSIGNED

    db.commit()
    db.refresh(request)

    return request
# ------------------------------------------------------
# Mark Maintenance IN_PROGRESS
# ------------------------------------------------------
def start_maintenance(
    db: Session,
    maintenance_id: int,
):
    """
    Change maintenance status to IN_PROGRESS.
    """

    request = get_maintenance_request(db, maintenance_id)

    if request.status != MaintenanceStatus.TECHNICIAN_ASSIGNED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Technician must be assigned first."
        )

    request.status = MaintenanceStatus.IN_PROGRESS

    db.commit()
    db.refresh(request)

    return request


# ------------------------------------------------------
# Resolve Maintenance
# ------------------------------------------------------
def resolve_maintenance(
    db: Session,
    maintenance_id: int,
):
    """
    Resolve maintenance request and make asset AVAILABLE.
    """

    request = get_maintenance_request(db, maintenance_id)

    if request.status != MaintenanceStatus.IN_PROGRESS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maintenance must be IN_PROGRESS before resolving."
        )

    asset = get_asset(db, request.asset_id)

    request.status = MaintenanceStatus.RESOLVED

    request.resolved_at = datetime.utcnow()

    asset.status = AssetStatus.AVAILABLE

    db.commit()
    db.refresh(request)

    return request


# ------------------------------------------------------
# Maintenance History
# ------------------------------------------------------
def maintenance_history(
    db: Session,
):
    """
    Returns all maintenance requests ordered by newest first.
    """

    history = (
        db.query(MaintenanceRequest)
        .order_by(
            MaintenanceRequest.created_at.desc()
        )
        .all()
    )

    return {
    "total": len(history),
    "maintenance_requests": history,
}
def update_maintenance_status(
    db: Session,
    maintenance_id: int,
    data: MaintenanceStatusUpdate,
):
    """
    Update maintenance status.
    Only allows:
    TECHNICIAN_ASSIGNED -> IN_PROGRESS
    IN_PROGRESS -> RESOLVED
    """

    if data.status == MaintenanceStatus.IN_PROGRESS:
        return start_maintenance(db, maintenance_id)

    elif data.status == MaintenanceStatus.RESOLVED:
        return resolve_maintenance(db, maintenance_id)

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid maintenance status transition."
        )