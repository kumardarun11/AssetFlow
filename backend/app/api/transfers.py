from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.enums import UserRole
from app.core.permissions import get_current_user, require_roles
from app.db.session import get_db
from app.models.user import User
from app.schemas.transfer import TransferCreate, TransferResponse
from app.services.transfer_service import (
    approve_transfer,
    create_transfer,
    get_transfer_by_id,
    get_transfers,
    reject_transfer,
)


router = APIRouter(
    prefix="/api/transfers",
    tags=["Asset Transfer"],
)


@router.get(
    "",
    response_model=list[TransferResponse],
)
def list_transfers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_transfers(db)


@router.post(
    "",
    response_model=TransferResponse,
    status_code=201,
)
def request_transfer(
    data: TransferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_transfer(
        db,
        data,
        current_user.id,
    )


@router.get(
    "/{transfer_id}",
    response_model=TransferResponse,
)
def get_transfer(
    transfer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_transfer_by_id(db, transfer_id)


@router.patch(
    "/{transfer_id}/approve",
    response_model=TransferResponse,
)
def approve_transfer_request(
    transfer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.ASSET_MANAGER,
        )
    ),
):
    return approve_transfer(
        db,
        transfer_id,
        current_user.id,
    )


@router.patch(
    "/{transfer_id}/reject",
    response_model=TransferResponse,
)
def reject_transfer_request(
    transfer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.ASSET_MANAGER,
        )
    ),
):
    return reject_transfer(
        db,
        transfer_id,
        current_user.id,
    )