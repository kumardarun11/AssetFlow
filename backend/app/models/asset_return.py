from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.enums import AssetCondition, ReturnStatus
from app.db.base import Base


class AssetReturn(Base):
    __tablename__ = "asset_returns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    allocation_id: Mapped[int] = mapped_column(
        ForeignKey("asset_allocations.id")
    )

    requested_by_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    approved_by_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    condition: Mapped[AssetCondition | None] = mapped_column(
        Enum(AssetCondition),
        nullable=True,
    )

    check_in_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[ReturnStatus] = mapped_column(
        Enum(ReturnStatus),
        default=ReturnStatus.REQUESTED,
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