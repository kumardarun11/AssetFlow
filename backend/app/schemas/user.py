from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.core.enums import UserRole, UserStatus


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    department_id: int | None
    role: UserRole
    status: UserStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserRoleUpdate(BaseModel):
    role: UserRole


class UserDepartmentUpdate(BaseModel):
    department_id: int | None


class UserStatusUpdate(BaseModel):
    status: UserStatus