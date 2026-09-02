from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.enums import AssetStatus
from app.models.asset import Asset
from app.models.asset_category import AssetCategory
from app.models.department import Department
from app.schemas.asset import AssetCreate, AssetUpdate


def generate_asset_tag(db: Session) -> str:

    last_asset = (
        db.query(Asset)
        .order_by(Asset.id.desc())
        .first()
    )

    next_number = 1 if not last_asset else last_asset.id + 1

    tag = f"AF-{next_number:04d}"

    while (
        db.query(Asset)
        .filter(Asset.asset_tag == tag)
        .first()
    ):
        next_number += 1
        tag = f"AF-{next_number:04d}"

    return tag


def validate_category(
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

    if category.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Asset category is inactive",
        )

    return category


def validate_department(
    db: Session,
    department_id: int | None,
) -> None:

    if department_id is None:
        return

    department = (
        db.query(Department)
        .filter(Department.id == department_id)
        .first()
    )

    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found",
        )

    if department.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department is inactive",
        )


def create_asset(
    db: Session,
    data: AssetCreate,
) -> Asset:

    validate_category(
        db,
        data.category_id,
    )

    validate_department(
        db,
        data.department_id,
    )

    if data.serial_number:

        existing = (
            db.query(Asset)
            .filter(
                Asset.serial_number == data.serial_number
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Asset with this serial number already exists",
            )

    asset = Asset(
        asset_tag=generate_asset_tag(db),
        name=data.name,
        category_id=data.category_id,
        department_id=data.department_id,
        serial_number=data.serial_number,
        acquisition_date=data.acquisition_date,
        acquisition_cost=data.acquisition_cost,
        condition=data.condition,
        status=AssetStatus.AVAILABLE,
        location=data.location,
        is_bookable=data.is_bookable,
        photo_url=data.photo_url,
        custom_data=data.custom_data,
    )

    db.add(asset)
    db.commit()
    db.refresh(asset)

    return asset


def list_assets(
    db: Session,
    category_id: int | None = None,
    department_id: int | None = None,
    status_filter: AssetStatus | None = None,
    location: str | None = None,
    search: str | None = None,
) -> list[Asset]:

    query = db.query(Asset)

    if category_id is not None:
        query = query.filter(
            Asset.category_id == category_id
        )

    if department_id is not None:
        query = query.filter(
            Asset.department_id == department_id
        )

    if status_filter is not None:
        query = query.filter(
            Asset.status == status_filter
        )

    if location:
        query = query.filter(
            Asset.location.ilike(f"%{location}%")
        )

    if search:
        query = query.filter(
            (Asset.asset_tag.ilike(f"%{search}%"))
            | (Asset.name.ilike(f"%{search}%"))
            | (Asset.serial_number.ilike(f"%{search}%"))
        )

    return (
        query
        .order_by(Asset.id.desc())
        .all()
    )


def get_asset(
    db: Session,
    asset_id: int,
) -> Asset:

    asset = (
        db.query(Asset)
        .filter(Asset.id == asset_id)
        .first()
    )

    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found",
        )

    return asset


def update_asset(
    db: Session,
    asset_id: int,
    data: AssetUpdate,
) -> Asset:

    asset = get_asset(db, asset_id)

    if data.category_id is not None:

        validate_category(
            db,
            data.category_id,
        )

        asset.category_id = data.category_id

    if data.department_id is not None:

        validate_department(
            db,
            data.department_id,
        )

        asset.department_id = data.department_id

    if data.serial_number is not None:

        existing = (
            db.query(Asset)
            .filter(
                Asset.serial_number == data.serial_number,
                Asset.id != asset_id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Another asset already uses this serial number",
            )

        asset.serial_number = data.serial_number

    if data.name is not None:
        asset.name = data.name

    if data.acquisition_date is not None:
        asset.acquisition_date = data.acquisition_date

    if data.acquisition_cost is not None:
        asset.acquisition_cost = data.acquisition_cost

    if data.condition is not None:
        asset.condition = data.condition

    if data.status is not None:
        asset.status = data.status

    if data.location is not None:
        asset.location = data.location

    if data.is_bookable is not None:
        asset.is_bookable = data.is_bookable

    if data.photo_url is not None:
        asset.photo_url = data.photo_url

    if data.custom_data is not None:
        asset.custom_data = data.custom_data

    db.commit()
    db.refresh(asset)

    return asset


def update_asset_status(
    db: Session,
    asset_id: int,
    new_status: AssetStatus,
) -> Asset:

    asset = get_asset(db, asset_id)

    asset.status = new_status

    db.commit()
    db.refresh(asset)

    return asset