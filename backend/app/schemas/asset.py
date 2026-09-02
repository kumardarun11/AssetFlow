from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.core.enums import AssetCondition, AssetStatus


class AssetCreate(BaseModel):
    name: str
    category_id: int
    department_id: int | None = None
    serial_number: str | None = None
    acquisition_date: date | None = None
    acquisition_cost: Decimal | None = None
    condition: AssetCondition = AssetCondition.GOOD
    location: str | None = None
    is_bookable: bool = False
    photo_url: str | None = None
    custom_data: dict | None = None


class AssetUpdate(BaseModel):
    name: str | None = None
    category_id: int | None = None
    department_id: int | None = None
    serial_number: str | None = None
    acquisition_date: date | None = None
    acquisition_cost: Decimal | None = None
    condition: AssetCondition | None = None
    status: AssetStatus | None = None
    location: str | None = None
    is_bookable: bool | None = None
    photo_url: str | None = None
    custom_data: dict | None = None


class AssetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    asset_tag: str
    name: str
    category_id: int
    department_id: int | None
    serial_number: str | None
    acquisition_date: date | None
    acquisition_cost: Decimal | None
    condition: AssetCondition
    status: AssetStatus
    location: str | None
    is_bookable: bool
    photo_url: str | None
    custom_data: dict | None
    created_at: datetime
    updated_at: datetime