from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.enums import UserRole
from app.core.permissions import require_roles
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import (
    UserDepartmentUpdate,
    UserResponse,
    UserRoleUpdate,
    UserStatusUpdate,
)
from app.services.user_service import (
    get_user_by_id,
    get_users,
    update_user_department,
    update_user_role,
    update_user_status,
)


router = APIRouter(
    prefix="/api/users",
    tags=["Employee Directory"],
)


directory_roles = require_roles(
    UserRole.ADMIN,
    UserRole.ASSET_MANAGER,
    UserRole.DEPARTMENT_HEAD,
)


@router.get(
    "",
    response_model=list[UserResponse],
)
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(directory_roles),
):
    return get_users(db)


@router.get(
    "/{user_id}",
    response_model=UserResponse,
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(directory_roles),
):
    return get_user_by_id(db, user_id)


@router.patch(
    "/{user_id}/role",
    response_model=UserResponse,
)
def change_user_role(
    user_id: int,
    data: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN)
    ),
):
    return update_user_role(
        db,
        user_id,
        data.role,
    )


@router.patch(
    "/{user_id}/department",
    response_model=UserResponse,
)
def change_user_department(
    user_id: int,
    data: UserDepartmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN)
    ),
):
    return update_user_department(
        db,
        user_id,
        data.department_id,
    )


@router.patch(
    "/{user_id}/status",
    response_model=UserResponse,
)
def change_user_status(
    user_id: int,
    data: UserStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN)
    ),
):
    return update_user_status(
        db,
        user_id,
        data.status,
    )