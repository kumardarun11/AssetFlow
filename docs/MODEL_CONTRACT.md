# AssetFlow Shared Model Contract

## Primary Keys
All primary keys use Integer autoincrement.

## Foreign Keys
Use `<entity>_id` naming.

Examples:
department_id
employee_id
asset_id
category_id

## Timestamps
Use:
created_at
updated_at

## Enum Rules
All enums must be imported from:
app.core.enums

Do not create local enums.

## Table Naming
Use plural snake_case.

Examples:
users
departments
assets
asset_allocations
transfer_requests
resource_bookings
maintenance_requests
audit_cycles
audit_items
notifications
activity_logs

## Relationship Rules
Use SQLAlchemy relationship with back_populates.

## Status Rules
Never hardcode status strings.

Correct:
AssetStatus.AVAILABLE

Incorrect:
"available"
"AVAILABLE"