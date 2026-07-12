from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class AssetAllocation(Base):
    __tablename__ = "asset_allocations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    asset_id: Mapped[int] = mapped_column(
        ForeignKey("assets.id")
    )

    employee_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("departments.id"),
        nullable=True,
    )

    allocated_by_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    allocated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    expected_return_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    returned_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    asset = relationship(
        "Asset",
        back_populates="allocations",
    )

    employee = relationship(
        "User",
        foreign_keys=[employee_id],
    )

    allocated_by = relationship(
        "User",
        foreign_keys=[allocated_by_id],
    )

    department = relationship("Department")