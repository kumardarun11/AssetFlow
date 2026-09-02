from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.enums import UserRole
from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.user import User
from app.schemas.asset_category import (
    AssetCategoryCreate,
    AssetCategoryResponse,
    AssetCategoryUpdate,
)
from app.services.category_service import (
    create_category,
    deactivate_category,
    get_category,
    list_categories,
    update_category,
)


router = APIRouter(
    prefix="/api/categories",
    tags=["Asset Categories"],
)


admin_only = require_roles(UserRole.ADMIN)


@router.post(
    "",
    response_model=AssetCategoryResponse,
)
def create(
    data: AssetCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    return create_category(db, data)


@router.get(
    "",
    response_model=list[AssetCategoryResponse],
)
def list_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    return list_categories(db)


@router.get(
    "/{category_id}",
    response_model=AssetCategoryResponse,
)
def get_one(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    return get_category(db, category_id)


@router.put(
    "/{category_id}",
    response_model=AssetCategoryResponse,
)
def update(
    category_id: int,
    data: AssetCategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    return update_category(
        db,
        category_id,
        data,
    )


@router.put(
    "/{category_id}/deactivate",
    response_model=AssetCategoryResponse,
)
def deactivate(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    return deactivate_category(
        db,
        category_id,
    )