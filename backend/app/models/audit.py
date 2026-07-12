from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.enums import AuditItemStatus, AuditStatus
from app.db.base import Base


class AuditCycle(Base):
    __tablename__ = "audit_cycles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    name: Mapped[str] = mapped_column(String(150))

    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("departments.id"),
        nullable=True,
    )

    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)

    status: Mapped[AuditStatus] = mapped_column(
        Enum(AuditStatus),
        default=AuditStatus.PLANNED,
    )

    created_by_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
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

    items = relationship(
        "AuditItem",
        back_populates="audit_cycle",
    )


class AuditAuditor(Base):
    __tablename__ = "audit_auditors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    audit_cycle_id: Mapped[int] = mapped_column(
        ForeignKey("audit_cycles.id")
    )

    auditor_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )


class AuditItem(Base):
    __tablename__ = "audit_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    audit_cycle_id: Mapped[int] = mapped_column(
        ForeignKey("audit_cycles.id")
    )

    asset_id: Mapped[int] = mapped_column(
        ForeignKey("assets.id")
    )

    verified_by_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    status: Mapped[AuditItemStatus] = mapped_column(
        Enum(AuditItemStatus),
        default=AuditItemStatus.PENDING,
    )

    discrepancy_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    verified_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    audit_cycle = relationship(
        "AuditCycle",
        back_populates="items",
    )