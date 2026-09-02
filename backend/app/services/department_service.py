from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.department import Department
from app.models.user import User
from app.schemas.department import DepartmentCreate, DepartmentUpdate


def create_department(
    db: Session,
    data: DepartmentCreate,
) -> Department:

    existing = (
        db.query(Department)
        .filter(Department.name == data.name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Department with this name already exists",
        )

    if data.parent_department_id is not None:
        parent = (
            db.query(Department)
            .filter(Department.id == data.parent_department_id)
            .first()
        )

        if not parent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent department not found",
            )

    if data.department_head_id is not None:
        head = (
            db.query(User)
            .filter(User.id == data.department_head_id)
            .first()
        )

        if not head:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department head not found",
            )

    department = Department(
        name=data.name,
        parent_department_id=data.parent_department_id,
        department_head_id=data.department_head_id,
        status=data.status,
    )

    db.add(department)
    db.commit()
    db.refresh(department)

    return department


def list_departments(db: Session) -> list[Department]:
    return (
        db.query(Department)
        .order_by(Department.name.asc())
        .all()
    )


def get_department(
    db: Session,
    department_id: int,
) -> Department:

    department = (
        db.query(Department)
        .filter(Department.id == department_id)
        .first()
    )

    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found",
        )

    return department


def update_department(
    db: Session,
    department_id: int,
    data: DepartmentUpdate,
) -> Department:

    department = get_department(db, department_id)

    if data.name is not None and data.name != department.name:
        existing = (
            db.query(Department)
            .filter(
                Department.name == data.name,
                Department.id != department_id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Department with this name already exists",
            )

        department.name = data.name

    if data.parent_department_id is not None:

        if data.parent_department_id == department_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A department cannot be its own parent",
            )

        parent = (
            db.query(Department)
            .filter(
                Department.id == data.parent_department_id
            )
            .first()
        )

        if not parent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent department not found",
            )

        department.parent_department_id = data.parent_department_id

    if data.department_head_id is not None:

        head = (
            db.query(User)
            .filter(User.id == data.department_head_id)
            .first()
        )

        if not head:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department head not found",
            )

        department.department_head_id = data.department_head_id

    if data.status is not None:
        if data.status not in ("ACTIVE", "INACTIVE"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status must be ACTIVE or INACTIVE",
            )

        department.status = data.status

    db.commit()
    db.refresh(department)

    return department


def deactivate_department(
    db: Session,
    department_id: int,
) -> Department:

    department = get_department(db, department_id)

    department.status = "INACTIVE"

    db.commit()
    db.refresh(department)

    return department