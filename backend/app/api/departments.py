from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.enums import UserRole
from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.user import User
from app.schemas.department import (
    DepartmentCreate,
    DepartmentResponse,
    DepartmentUpdate,
)
from app.services.department_service import (
    create_department,
    deactivate_department,
    get_department,
    list_departments,
    update_department,
)


router = APIRouter(
    prefix="/api/departments",
    tags=["Departments"],
)


admin_only = require_roles(UserRole.ADMIN)


@router.post(
    "",
    response_model=DepartmentResponse,
)
def create(
    data: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    return create_department(db, data)


@router.get(
    "",
    response_model=list[DepartmentResponse],
)
def list_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    return list_departments(db)


@router.get(
    "/{department_id}",
    response_model=DepartmentResponse,
)
def get_one(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    return get_department(db, department_id)


@router.put(
    "/{department_id}",
    response_model=DepartmentResponse,
)
def update(
    department_id: int,
    data: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    return update_department(
        db,
        department_id,
        data,
    )


@router.put(
    "/{department_id}/deactivate",
    response_model=DepartmentResponse,
)
def deactivate(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only),
):
    return deactivate_department(
        db,
        department_id,
    )