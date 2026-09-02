from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.enums import AssetStatus, UserRole
from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.user import User
from app.schemas.asset import (
    AssetCreate,
    AssetResponse,
    AssetUpdate,
)
from app.services.asset_service import (
    create_asset,
    get_asset,
    list_assets,
    update_asset,
    update_asset_status,
)


router = APIRouter(
    prefix="/api/assets",
    tags=["Assets"],
)


asset_manager_roles = require_roles(
    UserRole.ADMIN,
    UserRole.ASSET_MANAGER,
)


@router.post(
    "",
    response_model=AssetResponse,
)
def create(
    data: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(asset_manager_roles),
):
    return create_asset(db, data)


@router.get(
    "",
    response_model=list[AssetResponse],
)
def list_all(
    category_id: int | None = None,
    department_id: int | None = None,
    status_filter: AssetStatus | None = Query(
        default=None,
        alias="status",
    ),
    location: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(asset_manager_roles),
):
    return list_assets(
        db=db,
        category_id=category_id,
        department_id=department_id,
        status_filter=status_filter,
        location=location,
        search=search,
    )


@router.get(
    "/{asset_id}",
    response_model=AssetResponse,
)
def get_one(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(asset_manager_roles),
):
    return get_asset(db, asset_id)


@router.put(
    "/{asset_id}",
    response_model=AssetResponse,
)
def update(
    asset_id: int,
    data: AssetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(asset_manager_roles),
):
    return update_asset(
        db,
        asset_id,
        data,
    )


@router.patch(
    "/{asset_id}/status",
    response_model=AssetResponse,
)
def change_status(
    asset_id: int,
    new_status: AssetStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(asset_manager_roles),
):
    return update_asset_status(
        db,
        asset_id,
        new_status,
    )