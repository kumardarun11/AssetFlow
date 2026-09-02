from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AssetCategoryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    custom_fields: dict | None = None
    status: str = "ACTIVE"


class AssetCategoryUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )
    custom_fields: dict | None = None
    status: str | None = None


class AssetCategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    custom_fields: dict | None
    status: str
    created_at: datetime
    updated_at: datetime