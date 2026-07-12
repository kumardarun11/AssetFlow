from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.enums import UserRole
from app.core.permissions import get_current_user, require_roles
from app.db.session import get_db
from app.models.user import User
from app.schemas.allocation import (
    AllocationCreate,
    AllocationResponse,
)
from app.services.allocation_service import (
    create_allocation,
    get_active_allocations,
    get_allocation_by_id,
    get_allocations,
    is_allocation_overdue,
)


router = APIRouter(
    prefix="/api/allocations",
    tags=["Asset Allocation"],
)


def build_allocation_response(allocation):
    return AllocationResponse(
        id=allocation.id,
        asset_id=allocation.asset_id,
        employee_id=allocation.employee_id,
        department_id=allocation.department_id,
        allocated_by_id=allocation.allocated_by_id,
        allocated_at=allocation.allocated_at,
        expected_return_date=allocation.expected_return_date,
        returned_at=allocation.returned_at,
        is_active=allocation.is_active,
        notes=allocation.notes,
        is_overdue=is_allocation_overdue(allocation),
    )


@router.post(
    "",
    response_model=AllocationResponse,
    status_code=201,
)
def allocate_asset(
    data: AllocationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.ASSET_MANAGER,
        )
    ),
):
    allocation = create_allocation(
        db,
        data,
        current_user.id,
    )

    return build_allocation_response(allocation)


@router.get(
    "",
    response_model=list[AllocationResponse],
)
def list_allocations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    allocations = get_allocations(db)

    return [
        build_allocation_response(allocation)
        for allocation in allocations
    ]


@router.get(
    "/active",
    response_model=list[AllocationResponse],
)
def list_active_allocations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    allocations = get_active_allocations(db)

    return [
        build_allocation_response(allocation)
        for allocation in allocations
    ]


@router.get(
    "/{allocation_id}",
    response_model=AllocationResponse,
)
def get_allocation(
    allocation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    allocation = get_allocation_by_id(
        db,
        allocation_id,
    )

    return build_allocation_response(allocation)