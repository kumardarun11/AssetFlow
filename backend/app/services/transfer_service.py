from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.enums import TransferStatus, UserStatus
from app.models.allocation import AssetAllocation
from app.models.asset import Asset
from app.models.department import Department
from app.models.transfer import TransferRequest
from app.models.user import User
from app.schemas.transfer import TransferCreate


def get_transfer_by_id(
    db: Session,
    transfer_id: int,
) -> TransferRequest:
    transfer = db.get(TransferRequest, transfer_id)

    if transfer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transfer request not found",
        )

    return transfer


def get_transfers(
    db: Session,
) -> list[TransferRequest]:
    return (
        db.query(TransferRequest)
        .order_by(TransferRequest.id.desc())
        .all()
    )


def create_transfer(
    db: Session,
    data: TransferCreate,
    requested_by_id: int,
) -> TransferRequest:
    asset = db.get(Asset, data.asset_id)

    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found",
        )

    allocation = (
        db.query(AssetAllocation)
        .filter(
            AssetAllocation.asset_id == data.asset_id,
            AssetAllocation.is_active.is_(True),
        )
        .first()
    )

    if allocation is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Asset has no active allocation",
        )

    existing_request = (
        db.query(TransferRequest)
        .filter(
            TransferRequest.asset_id == data.asset_id,
            TransferRequest.status == TransferStatus.REQUESTED,
        )
        .first()
    )

    if existing_request:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A pending transfer request already exists",
        )

    if data.target_employee_id is not None:
        employee = db.get(User, data.target_employee_id)

        if employee is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Target employee not found",
            )

        if employee.status != UserStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Cannot transfer asset to inactive employee",
            )

        if allocation.employee_id == data.target_employee_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Asset is already allocated to this employee",
            )

    if data.target_department_id is not None:
        department = db.get(
            Department,
            data.target_department_id,
        )

        if department is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Target department not found",
            )

        if allocation.department_id == data.target_department_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Asset is already allocated to this department",
            )

    transfer = TransferRequest(
        asset_id=data.asset_id,
        requested_by_id=requested_by_id,
        target_employee_id=data.target_employee_id,
        target_department_id=data.target_department_id,
        reason=data.reason,
        status=TransferStatus.REQUESTED,
    )

    db.add(transfer)
    db.commit()
    db.refresh(transfer)

    return transfer


def approve_transfer(
    db: Session,
    transfer_id: int,
    approved_by_id: int,
) -> TransferRequest:
    transfer = get_transfer_by_id(db, transfer_id)

    if transfer.status != TransferStatus.REQUESTED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Transfer request has already been reviewed",
        )

    allocation = (
        db.query(AssetAllocation)
        .filter(
            AssetAllocation.asset_id == transfer.asset_id,
            AssetAllocation.is_active.is_(True),
        )
        .first()
    )

    if allocation is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Active allocation no longer exists",
        )

    now = datetime.now(timezone.utc).replace(tzinfo=None)

    allocation.is_active = False
    allocation.returned_at = now

    new_allocation = AssetAllocation(
        asset_id=allocation.asset_id,
        employee_id=transfer.target_employee_id,
        department_id=transfer.target_department_id,
        allocated_by_id=approved_by_id,
        expected_return_date=allocation.expected_return_date,
        notes=f"Created from transfer request {transfer.id}",
    )

    transfer.status = TransferStatus.APPROVED
    transfer.approved_by_id = approved_by_id

    db.add(new_allocation)

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    db.refresh(transfer)

    return transfer


def reject_transfer(
    db: Session,
    transfer_id: int,
    approved_by_id: int,
) -> TransferRequest:
    transfer = get_transfer_by_id(db, transfer_id)

    if transfer.status != TransferStatus.REQUESTED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Transfer request has already been reviewed",
        )

    transfer.status = TransferStatus.REJECTED
    transfer.approved_by_id = approved_by_id

    db.commit()
    db.refresh(transfer)

    return transfer