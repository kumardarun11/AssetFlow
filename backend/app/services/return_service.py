from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.enums import (
    AssetCondition,
    AssetStatus,
    ReturnStatus,
)
from app.models.allocation import AssetAllocation
from app.models.asset import Asset
from app.models.asset_return import AssetReturn
from app.schemas.asset_return import ReturnApprove, ReturnCreate


def get_return_by_id(
    db: Session,
    return_id: int,
) -> AssetReturn:
    asset_return = db.get(AssetReturn, return_id)

    if asset_return is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Return request not found",
        )

    return asset_return


def get_returns(
    db: Session,
) -> list[AssetReturn]:
    return (
        db.query(AssetReturn)
        .order_by(AssetReturn.id.desc())
        .all()
    )


def create_return(
    db: Session,
    data: ReturnCreate,
    requested_by_id: int,
) -> AssetReturn:
    allocation = db.get(
        AssetAllocation,
        data.allocation_id,
    )

    if allocation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Allocation not found",
        )

    if not allocation.is_active:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot return an inactive allocation",
        )

    existing_request = (
        db.query(AssetReturn)
        .filter(
            AssetReturn.allocation_id == data.allocation_id,
            AssetReturn.status == ReturnStatus.REQUESTED,
        )
        .first()
    )

    if existing_request:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A pending return request already exists",
        )

    asset_return = AssetReturn(
        allocation_id=data.allocation_id,
        requested_by_id=requested_by_id,
        status=ReturnStatus.REQUESTED,
    )

    db.add(asset_return)
    db.commit()
    db.refresh(asset_return)

    return asset_return


def approve_return(
    db: Session,
    return_id: int,
    data: ReturnApprove,
    approved_by_id: int,
) -> AssetReturn:
    asset_return = get_return_by_id(db, return_id)

    if asset_return.status != ReturnStatus.REQUESTED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Return request has already been reviewed",
        )

    allocation = db.get(
        AssetAllocation,
        asset_return.allocation_id,
    )

    if allocation is None or not allocation.is_active:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Active allocation no longer exists",
        )

    asset = db.get(Asset, allocation.asset_id)

    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found",
        )

    now = datetime.utcnow()

    allocation.is_active = False
    allocation.returned_at = now

    asset_return.status = ReturnStatus.APPROVED
    asset_return.approved_by_id = approved_by_id
    asset_return.condition = data.condition
    asset_return.check_in_notes = data.check_in_notes

    asset.condition = data.condition

    if data.condition in (
        AssetCondition.POOR,
        AssetCondition.DAMAGED,
    ):
        asset.status = AssetStatus.UNDER_MAINTENANCE
    else:
        asset.status = AssetStatus.AVAILABLE

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    db.refresh(asset_return)

    return asset_return


def reject_return(
    db: Session,
    return_id: int,
    approved_by_id: int,
) -> AssetReturn:
    asset_return = get_return_by_id(db, return_id)

    if asset_return.status != ReturnStatus.REQUESTED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Return request has already been reviewed",
        )

    asset_return.status = ReturnStatus.REJECTED
    asset_return.approved_by_id = approved_by_id

    db.commit()
    db.refresh(asset_return)

    return asset_return