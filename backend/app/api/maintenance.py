from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.maintenance import (
    MaintenanceCreate,
    MaintenanceApprove,
    MaintenanceReject,
    AssignTechnician,
    MaintenanceStatusUpdate,
    MaintenanceResponse,
    MaintenanceHistory,
)

from app.services.maintenance_service import (
    create_maintenance_request,
    list_maintenance_requests,
    get_maintenance_request,
    approve_maintenance_request,
    reject_maintenance_request,
    assign_technician,
    update_maintenance_status,
)

router = APIRouter()


# Create Maintenance Request
@router.post(
    "/",
    response_model=MaintenanceResponse,
    status_code=201,
)
def create_request(
    maintenance: MaintenanceCreate,
    db: Session = Depends(get_db),
):
    return create_maintenance_request(db, maintenance)


# List Maintenance Requests
@router.get(
    "/",
    response_model=MaintenanceHistory,
)
def list_requests(
    db: Session = Depends(get_db),
):
    return list_maintenance_requests(db)


# Get Maintenance Request By ID
@router.get(
    "/{maintenance_id}",
    response_model=MaintenanceResponse,
)
def get_request(
    maintenance_id: int,
    db: Session = Depends(get_db),
):
    return get_maintenance_request(db, maintenance_id)


# Approve Maintenance
@router.put(
    "/{maintenance_id}/approve",
    response_model=MaintenanceResponse,
)
def approve_request(
    maintenance_id: int,
    data: MaintenanceApprove,
    db: Session = Depends(get_db),
):
    return approve_maintenance_request(
        db,
        maintenance_id,
        data.approved_by_id,
    )


# Reject Maintenance
@router.put(
    "/{maintenance_id}/reject",
    response_model=MaintenanceResponse,
)
def reject_request(
    maintenance_id: int,
    data: MaintenanceReject,
    db: Session = Depends(get_db),
):
    return reject_maintenance_request(
        db,
        maintenance_id,
        data.approved_by_id,
    )


# Assign Technician
@router.put(
    "/{maintenance_id}/assign",
    response_model=MaintenanceResponse,
)
def assign_technician_api(
    maintenance_id: int,
    data: AssignTechnician,
    db: Session = Depends(get_db),
):
    return assign_technician(
        db,
        maintenance_id,
        data.technician_id,
    )


# Update Maintenance Status
@router.put(
    "/{maintenance_id}/status",
    response_model=MaintenanceResponse,
)
def update_status(
    maintenance_id: int,
    data: MaintenanceStatusUpdate,
    db: Session = Depends(get_db),
):
    return update_maintenance_status(
        db,
        maintenance_id,
        data,
    )