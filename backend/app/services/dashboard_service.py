from sqlalchemy.orm import Session

from app.core.enums import (
    AssetStatus,
    MaintenanceStatus,
    ReturnStatus,
    TransferStatus,
)
from app.models.activity_log import ActivityLog
from app.models.allocation import AssetAllocation
from app.models.asset import Asset
from app.models.asset_return import AssetReturn
from app.models.maintenance import MaintenanceRequest
from app.models.notification import Notification
from app.models.transfer import TransferRequest


def get_dashboard_summary(
    db: Session,
    user_id: int,
):
    total_assets = db.query(Asset).count()

    available_assets = (
        db.query(Asset)
        .filter(Asset.status == AssetStatus.AVAILABLE)
        .count()
    )

    active_allocations = (
        db.query(AssetAllocation)
        .filter(AssetAllocation.is_active.is_(True))
        .count()
    )

    pending_transfers = (
        db.query(TransferRequest)
        .filter(
            TransferRequest.status
            == TransferStatus.REQUESTED
        )
        .count()
    )

    pending_returns = (
        db.query(AssetReturn)
        .filter(
            AssetReturn.status
            == ReturnStatus.REQUESTED
        )
        .count()
    )

    open_maintenance = (
        db.query(MaintenanceRequest)
        .filter(
            MaintenanceRequest.status.notin_(
                [
                    MaintenanceStatus.RESOLVED,
                    MaintenanceStatus.REJECTED,
                ]
            )
        )
        .count()
    )

    unread_notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read.is_(False),
        )
        .count()
    )

    recent_activity = (
        db.query(ActivityLog)
        .order_by(ActivityLog.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "total_assets": total_assets,
        "available_assets": available_assets,
        "active_allocations": active_allocations,
        "pending_transfers": pending_transfers,
        "pending_returns": pending_returns,
        "open_maintenance": open_maintenance,
        "unread_notifications": unread_notifications,
        "recent_activity": recent_activity,
    }