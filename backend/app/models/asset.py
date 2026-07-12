from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    JSON,
    Numeric,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.enums import AssetCondition, AssetStatus
from app.db.base import Base


class Asset(Base):
    __tablename__ = "assets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    asset_tag: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(String(150))

    category_id: Mapped[int] = mapped_column(
        ForeignKey("asset_categories.id")
    )

    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("departments.id"),
        nullable=True,
    )

    serial_number: Mapped[str | None] = mapped_column(
        String(150),
        unique=True,
        nullable=True,
    )

    acquisition_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    acquisition_cost: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    condition: Mapped[AssetCondition] = mapped_column(
        Enum(AssetCondition),
        default=AssetCondition.GOOD,
    )

    status: Mapped[AssetStatus] = mapped_column(
        Enum(AssetStatus),
        default=AssetStatus.AVAILABLE,
    )

    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    is_bookable: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    photo_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    custom_data: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    category = relationship(
        "AssetCategory",
        back_populates="assets",
    )

    department = relationship("Department")

    allocations = relationship(
        "AssetAllocation",
        back_populates="asset",
    )

    maintenance_requests = relationship(
        "MaintenanceRequest",
        back_populates="asset",
    )