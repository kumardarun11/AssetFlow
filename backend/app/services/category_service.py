from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.asset_category import AssetCategory
from app.schemas.asset_category import (
    AssetCategoryCreate,
    AssetCategoryUpdate,
)


def create_category(
    db: Session,
    data: AssetCategoryCreate,
) -> AssetCategory:

    existing = (
        db.query(AssetCategory)
        .filter(AssetCategory.name == data.name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Asset category already exists",
        )

    category = AssetCategory(
        name=data.name,
        custom_fields=data.custom_fields,
        status=data.status,
    )

    db.add(category)
    db.commit()
    db.refresh(category)

    return category


def list_categories(
    db: Session,
) -> list[AssetCategory]:

    return (
        db.query(AssetCategory)
        .order_by(AssetCategory.name.asc())
        .all()
    )


def get_category(
    db: Session,
    category_id: int,
) -> AssetCategory:

    category = (
        db.query(AssetCategory)
        .filter(AssetCategory.id == category_id)
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset category not found",
        )

    return category


def update_category(
    db: Session,
    category_id: int,
    data: AssetCategoryUpdate,
) -> AssetCategory:

    category = get_category(db, category_id)

    if data.name is not None and data.name != category.name:

        existing = (
            db.query(AssetCategory)
            .filter(
                AssetCategory.name == data.name,
                AssetCategory.id != category_id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Asset category already exists",
            )

        category.name = data.name

    if data.custom_fields is not None:
        category.custom_fields = data.custom_fields

    if data.status is not None:

        if data.status not in ("ACTIVE", "INACTIVE"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status must be ACTIVE or INACTIVE",
            )

        category.status = data.status

    db.commit()
    db.refresh(category)

    return category


def deactivate_category(
    db: Session,
    category_id: int,
) -> AssetCategory:

    category = get_category(db, category_id)

    category.status = "INACTIVE"

    db.commit()
    db.refresh(category)

    return category