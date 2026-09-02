from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.enums import (
    AssetStatus,
    AuditItemStatus,
    AuditStatus,
)
from app.models.asset import Asset
from app.models.audit import (
    AuditAuditor,
    AuditCycle,
    AuditItem,
)
from app.models.department import Department
from app.models.user import User
from app.schemas.audit import (
    AuditAuditorCreate,
    AuditCycleCreate,
    AuditItemCreate,
    AuditItemVerify,
)


def get_audit_cycle(
    db: Session,
    audit_cycle_id: int,
) -> AuditCycle:

    audit = (
        db.query(AuditCycle)
        .filter(AuditCycle.id == audit_cycle_id)
        .first()
    )

    if not audit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit cycle not found",
        )

    return audit


def create_audit_cycle(
    db: Session,
    data: AuditCycleCreate,
) -> AuditCycle:

    if data.end_date < data.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date cannot be before start date",
        )

    creator = (
        db.query(User)
        .filter(User.id == data.created_by_id)
        .first()
    )

    if not creator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Creator user not found",
        )

    if data.department_id is not None:

        department = (
            db.query(Department)
            .filter(
                Department.id == data.department_id
            )
            .first()
        )

        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found",
            )

    audit = AuditCycle(
        name=data.name,
        department_id=data.department_id,
        location=data.location,
        start_date=data.start_date,
        end_date=data.end_date,
        status=AuditStatus.PLANNED,
        created_by_id=data.created_by_id,
    )

    db.add(audit)
    db.commit()
    db.refresh(audit)

    return audit


def list_audit_cycles(
    db: Session,
) -> list[AuditCycle]:

    return (
        db.query(AuditCycle)
        .order_by(AuditCycle.id.desc())
        .all()
    )


def assign_auditor(
    db: Session,
    audit_cycle_id: int,
    data: AuditAuditorCreate,
) -> AuditAuditor:

    audit = get_audit_cycle(
        db,
        audit_cycle_id,
    )

    if audit.status in (
        AuditStatus.COMPLETED,
        AuditStatus.CLOSED,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot assign auditor to a closed audit",
        )

    user = (
        db.query(User)
        .filter(User.id == data.auditor_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Auditor user not found",
        )

    existing = (
        db.query(AuditAuditor)
        .filter(
            AuditAuditor.audit_cycle_id == audit_cycle_id,
            AuditAuditor.auditor_id == data.auditor_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is already assigned as an auditor",
        )

    auditor = AuditAuditor(
        audit_cycle_id=audit_cycle_id,
        auditor_id=data.auditor_id,
    )

    db.add(auditor)

    if audit.status == AuditStatus.PLANNED:
        audit.status = AuditStatus.IN_PROGRESS

    db.commit()
    db.refresh(auditor)

    return auditor


def add_audit_item(
    db: Session,
    audit_cycle_id: int,
    data: AuditItemCreate,
) -> AuditItem:

    audit = get_audit_cycle(
        db,
        audit_cycle_id,
    )

    if audit.status in (
        AuditStatus.COMPLETED,
        AuditStatus.CLOSED,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot add items to a closed audit",
        )

    asset = (
        db.query(Asset)
        .filter(Asset.id == data.asset_id)
        .first()
    )

    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found",
        )

    existing = (
        db.query(AuditItem)
        .filter(
            AuditItem.audit_cycle_id == audit_cycle_id,
            AuditItem.asset_id == data.asset_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Asset is already part of this audit",
        )

    item = AuditItem(
        audit_cycle_id=audit_cycle_id,
        asset_id=data.asset_id,
        status=AuditItemStatus.PENDING,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


def verify_audit_item(
    db: Session,
    audit_item_id: int,
    data: AuditItemVerify,
) -> AuditItem:

    item = (
        db.query(AuditItem)
        .filter(AuditItem.id == audit_item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit item not found",
        )

    audit = get_audit_cycle(
        db,
        item.audit_cycle_id,
    )

    if audit.status in (
        AuditStatus.COMPLETED,
        AuditStatus.CLOSED,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Audit is already closed",
        )

    user = (
        db.query(User)
        .filter(User.id == data.verified_by_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verifier user not found",
        )

    item.status = data.status
    item.discrepancy_notes = data.discrepancy_notes
    item.verified_by_id = data.verified_by_id
    item.verified_at = datetime.utcnow()

    db.commit()
    db.refresh(item)

    return item


def list_audit_items(
    db: Session,
    audit_cycle_id: int,
) -> list[AuditItem]:

    get_audit_cycle(
        db,
        audit_cycle_id,
    )

    return (
        db.query(AuditItem)
        .filter(
            AuditItem.audit_cycle_id == audit_cycle_id
        )
        .order_by(AuditItem.id.asc())
        .all()
    )


def get_discrepancies(
    db: Session,
    audit_cycle_id: int,
) -> list[AuditItem]:

    get_audit_cycle(
        db,
        audit_cycle_id,
    )

    return (
        db.query(AuditItem)
        .filter(
            AuditItem.audit_cycle_id == audit_cycle_id,
            AuditItem.status.in_(
                [
                    AuditItemStatus.MISSING,
                    AuditItemStatus.DAMAGED,
                ]
            ),
        )
        .order_by(AuditItem.id.asc())
        .all()
    )


def close_audit_cycle(
    db: Session,
    audit_cycle_id: int,
) -> AuditCycle:

    audit = get_audit_cycle(
        db,
        audit_cycle_id,
    )

    if audit.status == AuditStatus.CLOSED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Audit cycle is already closed",
        )

    items = (
        db.query(AuditItem)
        .filter(
            AuditItem.audit_cycle_id == audit_cycle_id
        )
        .all()
    )

    pending_items = [
        item
        for item in items
        if item.status == AuditItemStatus.PENDING
    ]

    if pending_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All audit items must be verified before closing",
        )

    for item in items:

        asset = (
            db.query(Asset)
            .filter(Asset.id == item.asset_id)
            .first()
        )

        if not asset:
            continue

        if item.status == AuditItemStatus.MISSING:
            asset.status = AssetStatus.LOST

        elif item.status == AuditItemStatus.DAMAGED:
            asset.status = AssetStatus.UNDER_MAINTENANCE

    audit.status = AuditStatus.COMPLETED

    db.commit()
    db.refresh(audit)

    return audit