from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.enums import UserRole
from app.core.permissions import get_current_user, require_roles
from app.db.session import get_db
from app.models.user import User
from app.schemas.asset_return import (
    ReturnApprove,
    ReturnCreate,
    ReturnResponse,
)
from app.services.return_service import (
    approve_return,
    create_return,
    get_return_by_id,
    get_returns,
    reject_return,
)


router = APIRouter(
    prefix="/api/returns",
    tags=["Asset Return"],
)


@router.get(
    "",
    response_model=list[ReturnResponse],
)
def list_returns(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_returns(db)


@router.post(
    "",
    response_model=ReturnResponse,
    status_code=201,
)
def request_return(
    data: ReturnCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_return(
        db,
        data,
        current_user.id,
    )


@router.get(
    "/{return_id}",
    response_model=ReturnResponse,
)
def get_return(
    return_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_return_by_id(db, return_id)


@router.patch(
    "/{return_id}/approve",
    response_model=ReturnResponse,
)
def approve_return_request(
    return_id: int,
    data: ReturnApprove,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.ASSET_MANAGER,
        )
    ),
):
    return approve_return(
        db,
        return_id,
        data,
        current_user.id,
    )


@router.patch(
    "/{return_id}/reject",
    response_model=ReturnResponse,
)
def reject_return_request(
    return_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.ASSET_MANAGER,
        )
    ),
):
    return reject_return(
        db,
        return_id,
        current_user.id,
    )