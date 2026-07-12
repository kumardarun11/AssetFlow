from datetime import date

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.enums import AssetStatus, UserStatus
from app.models.allocation import AssetAllocation
from app.models.asset import Asset
from app.models.department import Department
from app.models.user import User
from app.schemas.allocation import AllocationCreate


def create_allocation(
    db: Session,
    data: AllocationCreate,
    allocated_by_id: int,
) -> AssetAllocation:
    asset = db.get(Asset, data.asset_id)

    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found",
        )

    active_allocation = (
        db.query(AssetAllocation)
        .filter(
            AssetAllocation.asset_id == data.asset_id,
            AssetAllocation.is_active.is_(True),
        )
        .first()
    )

    if active_allocation:
        holder = (
            f"employee {active_allocation.employee_id}"
            if active_allocation.employee_id
            else f"department {active_allocation.department_id}"
        )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Asset is already allocated to {holder}",
        )

    if asset.status != AssetStatus.AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Asset is not available. Current status: {asset.status.value}",
        )

    if data.employee_id is not None:
        employee = db.get(User, data.employee_id)

        if employee is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )

        if employee.status != UserStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Cannot allocate asset to inactive employee",
            )

    if data.department_id is not None:
        department = db.get(
            Department,
            data.department_id,
        )

        if department is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found",
            )

    if (
        data.expected_return_date is not None
        and data.expected_return_date < date.today()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expected return date cannot be in the past",
        )

    allocation = AssetAllocation(
        asset_id=data.asset_id,
        employee_id=data.employee_id,
        department_id=data.department_id,
        allocated_by_id=allocated_by_id,
        expected_return_date=data.expected_return_date,
        notes=data.notes,
    )

    asset.status = AssetStatus.ALLOCATED

    db.add(allocation)
    db.commit()
    db.refresh(allocation)

    return allocation


def get_allocations(
    db: Session,
) -> list[AssetAllocation]:
    return (
        db.query(AssetAllocation)
        .order_by(AssetAllocation.id.desc())
        .all()
    )


def get_allocation_by_id(
    db: Session,
    allocation_id: int,
) -> AssetAllocation:
    allocation = db.get(
        AssetAllocation,
        allocation_id,
    )

    if allocation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Allocation not found",
        )

    return allocation


def get_active_allocations(
    db: Session,
) -> list[AssetAllocation]:
    return (
        db.query(AssetAllocation)
        .filter(AssetAllocation.is_active.is_(True))
        .order_by(AssetAllocation.id.desc())
        .all()
    )


def is_allocation_overdue(
    allocation: AssetAllocation,
) -> bool:
    return (
        allocation.is_active
        and allocation.expected_return_date is not None
        and allocation.expected_return_date < date.today()
    )