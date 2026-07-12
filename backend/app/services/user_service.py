from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.enums import UserRole, UserStatus
from app.models.department import Department
from app.models.user import User


def get_users(db: Session) -> list[User]:
    return db.query(User).order_by(User.id).all()


def get_user_by_id(
    db: Session,
    user_id: int,
) -> User:
    user = db.get(User, user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


def update_user_role(
    db: Session,
    user_id: int,
    role: UserRole,
) -> User:
    user = get_user_by_id(db, user_id)

    user.role = role

    db.commit()
    db.refresh(user)

    return user


def update_user_department(
    db: Session,
    user_id: int,
    department_id: int | None,
) -> User:
    user = get_user_by_id(db, user_id)

    if department_id is not None:
        department = db.get(Department, department_id)

        if department is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found",
            )

    user.department_id = department_id

    db.commit()
    db.refresh(user)

    return user


def update_user_status(
    db: Session,
    user_id: int,
    user_status: UserStatus,
) -> User:
    user = get_user_by_id(db, user_id)

    user.status = user_status

    db.commit()
    db.refresh(user)

    return user