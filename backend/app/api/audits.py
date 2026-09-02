from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.enums import UserRole
from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.user import User
from app.schemas.audit import (
    AuditAuditorCreate,
    AuditAuditorResponse,
    AuditCycleCreate,
    AuditCycleResponse,
    AuditDiscrepancyResponse,
    AuditItemCreate,
    AuditItemResponse,
    AuditItemVerify,
)
from app.services.audit_service import (
    add_audit_item,
    assign_auditor,
    close_audit_cycle,
    create_audit_cycle,
    get_discrepancies,
    get_audit_cycle,
    list_audit_cycles,
    list_audit_items,
    verify_audit_item,
)


router = APIRouter(
    prefix="/api/audits",
    tags=["Audits"],
)


audit_roles = require_roles(
    UserRole.ADMIN,
    UserRole.ASSET_MANAGER,
)


@router.post(
    "",
    response_model=AuditCycleResponse,
)
def create(
    data: AuditCycleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(audit_roles),
):
    return create_audit_cycle(
        db,
        data,
    )


@router.get(
    "",
    response_model=list[AuditCycleResponse],
)
def list_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(audit_roles),
):
    return list_audit_cycles(db)


@router.get(
    "/{audit_cycle_id}",
    response_model=AuditCycleResponse,
)
def get_one(
    audit_cycle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(audit_roles),
):
    return get_audit_cycle(
        db,
        audit_cycle_id,
    )


@router.post(
    "/{audit_cycle_id}/auditors",
    response_model=AuditAuditorResponse,
)
def add_auditor(
    audit_cycle_id: int,
    data: AuditAuditorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(audit_roles),
):
    return assign_auditor(
        db,
        audit_cycle_id,
        data,
    )


@router.post(
    "/{audit_cycle_id}/items",
    response_model=AuditItemResponse,
)
def add_item(
    audit_cycle_id: int,
    data: AuditItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(audit_roles),
):
    return add_audit_item(
        db,
        audit_cycle_id,
        data,
    )


@router.get(
    "/{audit_cycle_id}/items",
    response_model=list[AuditItemResponse],
)
def get_items(
    audit_cycle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(audit_roles),
):
    return list_audit_items(
        db,
        audit_cycle_id,
    )


@router.get(
    "/{audit_cycle_id}/discrepancies",
    response_model=AuditDiscrepancyResponse,
)
def discrepancies(
    audit_cycle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(audit_roles),
):

    items = get_discrepancies(
        db,
        audit_cycle_id,
    )

    return {
        "total": len(items),
        "items": items,
    }


@router.put(
    "/items/{audit_item_id}/verify",
    response_model=AuditItemResponse,
)
def verify_item(
    audit_item_id: int,
    data: AuditItemVerify,
    db: Session = Depends(get_db),
    current_user: User = Depends(audit_roles),
):
    return verify_audit_item(
        db,
        audit_item_id,
        data,
    )


@router.put(
    "/{audit_cycle_id}/close",
    response_model=AuditCycleResponse,
)
def close(
    audit_cycle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(audit_roles),
):
    return close_audit_cycle(
        db,
        audit_cycle_id,
    )