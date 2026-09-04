<div align="center">

# 🏢 AssetFlow

### Enterprise Asset & Resource Management System

**React • TypeScript • FastAPI • MySQL • TiDB Cloud • Vercel • Render**

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-TiDB%20Cloud-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render&logoColor=black)
![REST API](https://img.shields.io/badge/REST-API-009688?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

</div>

---

# 📌 Overview

**AssetFlow** is a modern full-stack enterprise **Asset & Resource Management System** designed to digitize and streamline the complete lifecycle of organizational assets and resources.

The platform provides centralized management for assets, employees, departments, categories, allocations, transfers, returns, bookings, maintenance, notifications, activity logs, and audit operations through a secure role-based architecture.

AssetFlow follows an **API-first client-server architecture**, where a React and TypeScript frontend communicates with a production-deployed FastAPI REST backend over HTTPS. The backend connects to a cloud-hosted TiDB MySQL-compatible database for persistent data management.

The system is designed around real-world organizational workflows, allowing administrators and asset managers to control the complete lifecycle of an organizational asset — from registration and allocation to transfer, maintenance, return, auditing, retirement, and disposal.

The project demonstrates practical implementation of modern software engineering concepts including:

- RESTful API development
- Role-based access control
- JWT-based authentication
- SQLAlchemy ORM
- MySQL-compatible cloud database integration
- React + TypeScript frontend architecture
- Cloud deployment
- API-driven frontend integration
- Asset lifecycle management
- Audit and discrepancy tracking
- Modular backend services

---

# 🔗 Project Resources

| Resource | Status |
|----------|--------|
| 🌐 Frontend | Production Live |
| 🔌 REST API | Production Live |
| 📚 API Documentation | Available through FastAPI Swagger |
| 🗄️ Database | TiDB Cloud |
| ☁️ Frontend Hosting | Vercel |
| 🚀 Backend Hosting | Render |
| 📱 Responsive Web Application | ✅ Available |

### 🌐 Live Application

**Frontend:**  
https://assetflow-ashen.vercel.app/

**Backend API:**  
https://assetflow-backend-hruj.onrender.com/

**API Documentation:**  
https://assetflow-backend-hruj.onrender.com/docs

---

# 🏗️ System Architecture

```text
                              AssetFlow

                       React + TypeScript
                              │
                              │
                       Axios REST Client
                              │
                              │ HTTPS + JSON
                              ▼
              ┌─────────────────────────────────┐
              │       FastAPI REST Backend      │
              │                                 │
              │  • JWT Authentication           │
              │  • Role-Based Authorization     │
              │  • Business Logic               │
              │  • Asset Management             │
              │  • Allocation & Transfer        │
              │  • Booking & Maintenance        │
              │  • Audit Management             │
              │  • Notifications & Activity Logs│
              └────────────────┬────────────────┘
                               │
                               │ SQLAlchemy ORM
                               ▼
              ┌─────────────────────────────────┐
              │        TiDB Cloud Database      │
              │      MySQL Compatible SQL       │
              │                                 │
              │ Users                           │
              │ Assets                          │
              │ Categories                      │
              │ Departments                     │
              │ Allocations                     │
              │ Transfers                       │
              │ Returns                         │
              │ Bookings                        │
              │ Maintenance                     │
              │ Audits                          │
              │ Notifications                   │
              │ Activity Logs                   │
              └─────────────────────────────────┘

                  ▲                         ▲
                  │                         │
               Vercel                    Render
             Frontend                   Backend
```

## ✨ Architectural Highlights

- RESTful API-first architecture
- React 19 + TypeScript frontend
- FastAPI backend
- JWT bearer-token authentication
- Role-based access control
- SQLAlchemy ORM
- MySQL-compatible TiDB Cloud database
- Axios-based API integration
- Environment-based configuration
- Production frontend deployment on Vercel
- Production backend deployment on Render
- Automatic database table creation
- Modular backend service architecture
- Responsive web interface
- Centralized asset lifecycle management
- Audit and discrepancy tracking
- Cloud-ready architecture

# 📈 Project Metrics

| Metric | Value |
|---------|------:|
| 👥 User Roles | 4 |
| 📦 Core Modules | 12+ |
| 🔌 REST API Modules | 10+ |
| 🗄️ Database Tables | 14 |
| 🌐 Frontend Routes | 14+ |
| ☁️ Deployment Platforms | 2 |
| 🔐 Authentication | JWT |
| 🧩 Frontend Framework | React 19 |
| ⚡ Backend Framework | FastAPI |
| 🗄️ Database Engine | TiDB Cloud |
| 🌐 Frontend Status | Production Live |
| 🚀 Backend Status | Production Live |

---

# 🚀 Project Status

| Component | Status |
|------------|--------|
| React Frontend | ✅ Production Ready |
| TypeScript Integration | ✅ Completed |
| FastAPI Backend | ✅ Production Ready |
| REST API | ✅ Live |
| JWT Authentication | ✅ Completed |
| Role-Based Authorization | ✅ Completed |
| User Management | ✅ Completed |
| Department Management | ✅ Completed |
| Asset Category Management | ✅ Completed |
| Asset Management | ✅ Completed |
| Asset Allocation | ✅ Completed |
| Asset Transfers | ✅ Completed |
| Asset Returns | ✅ Completed |
| Resource Bookings | ✅ Completed |
| Maintenance Management | ✅ Completed |
| Notifications | ✅ Completed |
| Activity Logs | ✅ Completed |
| Audit Management | ✅ Completed |
| TiDB Cloud Database | ✅ Live |
| Vercel Frontend | ✅ Live |
| Render Backend | ✅ Live |
| API Integration | ✅ Completed |
| Production Testing | ✅ Completed |

---

# ☁️ Live Deployment

AssetFlow is deployed using a separated frontend-backend cloud architecture.

The React frontend is hosted on **Vercel**, while the FastAPI backend runs on **Render** and communicates with a cloud-hosted **TiDB MySQL-compatible database**.

All frontend-backend communication takes place through HTTPS REST APIs.

| Component | Details |
|-----------|---------|
| 🌐 Frontend Hosting | Vercel |
| 🚀 Backend Hosting | Render |
| 🗄️ Database | TiDB Cloud |
| 🐍 Backend Runtime | Python 3.11 |
| ⚡ Backend Framework | FastAPI |
| ⚛️ Frontend Framework | React 19 |
| 📝 Frontend Language | TypeScript |
| 🗃️ ORM | SQLAlchemy |
| 🔐 Authentication | JWT Bearer Tokens |
| 🌐 Communication | HTTPS |
| 🔄 Data Format | JSON |
| 📡 API Architecture | REST |
| 🟢 Deployment Status | Production Live |

> The production architecture separates frontend presentation, backend business logic, and database persistence, making AssetFlow easier to maintain and scale.

---

# 🏗️ Deployment Architecture

```text
                         👨‍💻 Developer
                              │
                              ▼
                       GitHub Repository
                              │
                       Push / Commit
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
             Vercel                      Render
          React Frontend              FastAPI Backend
                │                           │
                │ HTTPS + JSON              │
                └─────────────┬─────────────┘
                              │
                              ▼
                     TiDB Cloud Database
                              │
                              ▼
                     Persistent Asset Data
```

## 🔄 Request Flow

```text
React Frontend
      │
      │ Axios Request
      ▼
Vercel
      │
      │ HTTPS
      ▼
FastAPI Backend
      │
      │ JWT Authentication
      │
      ▼
Role-Based Authorization
      │
      ▼
Business Logic / Services
      │
      ▼
SQLAlchemy ORM
      │
      ▼
TiDB Cloud
      │
      ▼
Database Response
      │
      ▼
FastAPI JSON Response
      │
      ▼
React Frontend
```

## ✨ Deployment Highlights

* Cloud-hosted React frontend
* Production FastAPI backend
* TiDB Cloud MySQL-compatible database
* HTTPS communication
* RESTful JSON APIs
* JWT-based authentication
* Environment-based configuration
* SQLAlchemy database integration
* Automatic database table creation
* GitHub-based deployment workflow
* Separated frontend and backend deployment
* Production-ready API architecture

```


## 9. Core Features

```markdown
# ✨ Core Features

AssetFlow provides complete organizational asset and resource lifecycle management through a centralized web platform.

## 📦 Functional Modules

| Module | Description |
|---------|-------------|
| 🔐 Authentication | Secure registration, login, JWT token authentication, logout, and protected routes. |
| 👥 Employee Management | Manage organizational users, roles, and account status. |
| 🏢 Department Management | Create, update, activate, deactivate, and organize departments. |
| 🗂️ Category Management | Manage asset categories and configurable category metadata. |
| 💻 Asset Management | Register, update, search, filter, and manage organizational assets. |
| 📋 Allocation Management | Assign assets to employees and track active allocations. |
| 🔄 Transfer Management | Manage asset transfer requests and approval workflows. |
| ↩️ Return Management | Handle asset return requests and return status workflows. |
| 📅 Booking Management | Manage bookable organizational resources and reservations. |
| 🛠️ Maintenance Management | Track maintenance requests, priorities, technicians, and resolution status. |
| 🔔 Notifications | Provide system notifications for important asset events and workflows. |
| 🧾 Activity Logs | Maintain records of important system activities. |
| 🔍 Audit Management | Perform asset audits, verify assets, and track discrepancies. |
| 📊 Dashboard | Centralized overview of asset and organizational operations. |

---

# 🔐 Authentication & Authorization

AssetFlow uses **JWT-based bearer token authentication** for secure API access.

Authentication is handled through the FastAPI backend, while the React frontend securely stores the access token and automatically attaches it to authenticated API requests.

## Features

- User Registration
- Secure Login
- JWT Access Tokens
- Bearer Token Authentication
- Protected API Routes
- Role-Based Authorization
- Session Persistence
- Automatic Unauthorized Session Handling
- Logout
- Token-Based API Access

## 🔑 User Roles

| Role | Description |
|------|-------------|
| 👑 ADMIN | Full administrative control over the system. |
| 📦 ASSET_MANAGER | Manages assets, allocations, transfers, returns, and audits. |
| 🏢 DEPARTMENT_HEAD | Handles department-level organizational workflows. |
| 👤 EMPLOYEE | Accesses employee-level asset and resource functionality. |

## 🔄 Authentication Flow

```text
User
 │
 ▼
Login Page
 │
 ▼
POST /api/auth/login
 │
 ▼
FastAPI Authentication
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT Token
 │
 ▼
React Stores Access Token
 │
 ▼
Axios Automatically Adds
Authorization: Bearer <token>
 │
 ▼
Protected API
 │
 ▼
Role Validation
 │
 ▼
Authorized Response
```

# 👥 Employee Management

The employee management module provides centralized control over organizational users.

### Capabilities

- Create users
- View users
- View individual user information
- Update user information
- Manage user roles
- Manage user status
- Activate users
- Deactivate users
- Department association
- Role-based access control

---

# 🏢 Department Management

The department module manages the organizational structure of the enterprise.

### Capabilities

- Create departments
- View departments
- View individual departments
- Update departments
- Deactivate departments
- Assign department heads
- Parent department relationships
- Department status management

---

# 🗂️ Asset Category Management

Asset categories allow organizations to organize different types of assets.

### Capabilities

- Create categories
- View categories
- View individual categories
- Update categories
- Deactivate categories
- Custom category fields
- Category-based asset organization

---

# 💻 Asset Management

The asset management module is the central component of AssetFlow.

Each asset receives a unique automatically generated **asset tag** and can be tracked throughout its complete lifecycle.

### Asset Information

- Asset ID
- Asset Tag
- Asset Name
- Category
- Department
- Serial Number
- Acquisition Date
- Acquisition Cost
- Condition
- Status
- Location
- Bookable Status
- Photo URL
- Custom Data
- Creation Timestamp
- Update Timestamp

### Asset Capabilities

- Register assets
- View assets
- Search assets
- Filter assets
- Update assets
- Track asset condition
- Track asset location
- Track asset status
- Mark assets as bookable
- Maintain custom asset metadata

---

# 📊 Asset Lifecycle

```text
                         ┌─────────────┐
                         │   AVAILABLE │
                         └──────┬──────┘
                                │
                         Allocation
                                │
                                ▼
                         ┌─────────────┐
                         │  ALLOCATED  │
                         └──────┬──────┘
                                │
                   ┌────────────┼────────────┐
                   │            │            │
                   ▼            ▼            ▼
               Transfer      Return      Maintenance
                   │            │            │
                   ▼            ▼            ▼
               Transfer      AVAILABLE   UNDER
               Workflow                   MAINTENANCE
                                              │
                                              ▼
                                           RESOLVED
                                              │
                                              ▼
                                           AVAILABLE

                 Other Lifecycle States
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
        LOST          RETIRED        DISPOSED
```

### Asset Statuses

* AVAILABLE
* ALLOCATED
* RESERVED
* UNDER_MAINTENANCE
* LOST
* RETIRED
* DISPOSED

### Asset Conditions

* EXCELLENT
* GOOD
* FAIR
* POOR
* DAMAGED
---

# 📋 Asset Allocation

The allocation module manages assignment of organizational assets to employees.

### Capabilities

- Asset assignment
- Allocation tracking
- Employee association
- Allocation history
- Active allocation management
- Asset availability validation

```text
Available Asset
      │
      ▼
Allocation Request
      │
      ▼
Validation
      │
      ▼
Asset Assigned
      │
      ▼
Employee
      │
      ▼
Active Allocation
```

---

# 🔄 Asset Transfer

AssetFlow provides an asset transfer workflow for moving assets between employees or organizational contexts.

### Transfer Workflow

```text
Current Allocation
        │
        ▼
Transfer Request
        │
        ▼
REQUESTED
        │
   ┌────┴────┐
   ▼         ▼
APPROVED   REJECTED
   │
   ▼
Asset Transfer
   │
   ▼
New Allocation
```

### Transfer Statuses

* REQUESTED
* APPROVED
* REJECTED

---

# ↩️ Asset Returns

The return module manages the process of returning allocated assets.

### Capabilities

* Submit return requests
* Track return status
* Approve returns
* Reject returns
* Maintain return workflow
* Update asset lifecycle state

### Return Statuses

* REQUESTED
* APPROVED
* REJECTED

---

# 📅 Resource Booking

AssetFlow supports booking of assets that are configured as bookable resources.

### Capabilities

- Book bookable assets
- Track reservations
- Monitor booking status
- Manage upcoming bookings
- Track ongoing bookings
- Complete bookings
- Cancel bookings

### Booking Statuses

- UPCOMING
- ONGOING
- COMPLETED
- CANCELLED

---

# 🛠️ Maintenance Management

The maintenance module manages asset maintenance requests throughout their complete workflow.

### Capabilities

- Create maintenance requests
- Set maintenance priority
- Approve maintenance
- Reject maintenance
- Assign technicians
- Track maintenance progress
- Resolve maintenance requests
- Maintain maintenance history

### Maintenance Statuses

- PENDING
- APPROVED
- REJECTED
- TECHNICIAN_ASSIGNED
- IN_PROGRESS
- RESOLVED

### Maintenance Priorities

- LOW
- MEDIUM
- HIGH
- CRITICAL

---

# 🔔 Notifications

The notification system provides event-based notifications for important organizational workflows.

### Notification Types

- Asset Assigned
- Maintenance Approved
- Maintenance Rejected
- Booking Confirmed
- Booking Cancelled
- Booking Reminder
- Transfer Approved
- Overdue Return
- Audit Discrepancy

Notifications allow users to remain informed about important changes without manually checking every module.

---

# 🧾 Activity Logs

AssetFlow maintains activity records for important system operations.

Activity logging provides traceability across organizational asset workflows and helps administrators understand changes occurring throughout the platform.

### Use Cases

- Track system activities
- Monitor asset operations
- Support auditing
- Improve accountability
- Maintain operational history

---

# 🔍 Audit Management

The audit module provides structured asset verification and discrepancy tracking.

Organizations can create audit cycles, assign auditors, add assets to audits, verify assets, and identify discrepancies.

### Audit Capabilities

- Create audit cycles
- View audit cycles
- Assign auditors
- View assigned auditors
- Add assets to audit cycles
- View audit items
- Verify audit items
- Record discrepancy notes
- View discrepancies
- Close audit cycles

### Audit Statuses

- PLANNED
- IN_PROGRESS
- COMPLETED
- CLOSED

### Audit Item Statuses

- PENDING
- VERIFIED
- MISSING
- DAMAGED

---

## 🔍 Audit Workflow

```text
Create Audit Cycle
        │
        ▼
Assign Auditors
        │
        ▼
Add Assets
        │
        ▼
Asset Verification
        │
        ▼
┌───────────────┬───────────────┬───────────────┐
│               │               │               │
▼               ▼               ▼               ▼
VERIFIED       MISSING        DAMAGED        PENDING
│               │               │
└───────────────┴───────────────┘
                │
                ▼
       Record Discrepancies
                │
                ▼
          Close Audit
```
---

# 📊 Dashboard

The AssetFlow dashboard provides a centralized operational overview.

The dashboard is designed to help administrators and authorized users quickly understand the current state of organizational resources.

### Dashboard Areas

- Asset Overview
- Asset Status
- Allocation Information
- Department Information
- Maintenance Information
- Booking Information
- Notifications
- Activity Information
- Audit Information

---

# 🛡️ Security

Security is implemented across the application stack through authentication, authorization, protected routes, validation, and environment-based configuration.

### Security Features

- JWT Authentication
- Bearer Token Authorization
- Role-Based Access Control
- Protected REST APIs
- Protected Frontend Routes
- Request Validation
- Password Hashing
- Environment-Based Secrets
- CORS Configuration
- Automatic Unauthorized Session Handling
- Database Connection Security
- HTTPS Production Communication

---

# 🧪 Testing

AssetFlow has been tested across the frontend, backend, API layer, authentication layer, database integration, and production deployment.

Testing focused on validating complete request flows from the frontend through the backend and into the cloud database.

---

## ✅ Backend API Testing

The FastAPI backend was validated using API requests and the built-in Swagger/OpenAPI documentation.

### Tested Areas

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Role-Based Authorization
- Department APIs
- Category APIs
- Asset APIs
- Allocation APIs
- Transfer APIs
- Return APIs
- Booking APIs
- Maintenance APIs
- Notification APIs
- Activity Log APIs
- Audit APIs
- Audit Auditor Listing
- Audit Item Verification
- Audit Discrepancy Tracking
- Database Integration
- Error Handling
- HTTP Status Validation

---

# 🔐 Authentication Testing

The complete authentication chain was validated:

```text
Frontend
   │
   ▼
Login Request
   │
   ▼
FastAPI
   │
   ▼
Credential Validation
   │
   ▼
JWT Generation
   │
   ▼
Frontend Token Storage
   │
   ▼
Axios Authorization Header
   │
   ▼
Protected Endpoint
   │
   ▼
JWT Validation
   │
   ▼
Role Permission Check
   │
   ▼
Database Operation
   │
   ▼
API Response
```
---

# 🗄️ Database Testing

AssetFlow uses **TiDB Cloud**, which provides MySQL-compatible database functionality.

The application automatically creates its database tables through SQLAlchemy metadata during backend startup.

### Database Tables

```text
users
departments
asset_categories
assets
asset_allocations
asset_returns
transfer_requests
resource_bookings
maintenance_requests
notifications
activity_logs
audit_cycles
audit_auditors
audit_items
```

### Database Validation

* Database connectivity tested
* SQLAlchemy connection validated
* Tables created successfully
* CRUD operations validated
* Foreign key relationships validated
* Cloud database connectivity tested
* Production backend database connection tested

---

# 🧪 Production Testing

| Component                   | Status      |
| --------------------------- | ----------- |
| React Frontend Build        | ✅ Completed |
| TypeScript Compilation      | ✅ Completed |
| FastAPI Backend             | ✅ Completed |
| REST API Testing            | ✅ Completed |
| JWT Authentication          | ✅ Completed |
| Role Authorization          | ✅ Completed |
| Database Connectivity       | ✅ Completed |
| TiDB Cloud Integration      | ✅ Completed |
| Frontend API Integration    | ✅ Completed |
| Vercel Deployment           | ✅ Completed |
| Render Deployment           | ✅ Completed |
| Production API Validation   | ✅ Completed |
| End-to-End Workflow Testing | ✅ Completed |

---

# 🛠️ Technology Stack

| Layer | Technology |
|--------|------------|
| **Frontend Framework** | React 19 |
| **Frontend Language** | TypeScript |
| **Build Tool** | Vite |
| **Styling** | CSS / Tailwind CSS |
| **UI Icons** | Lucide React |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Routing** | React Router |
| **Backend Framework** | FastAPI |
| **Programming Language** | Python 3.11 |
| **ORM** | SQLAlchemy |
| **Database** | TiDB Cloud |
| **Database Compatibility** | MySQL |
| **Authentication** | JWT |
| **Validation** | Pydantic |
| **API Documentation** | Swagger / OpenAPI |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |
| **Version Control** | Git / GitHub |
| **Development Environment** | VS Code |
| **Database Development** | TiDB Cloud |

---

# 📦 Backend Dependencies

The backend uses pinned production dependencies to maintain consistent environments.

```text
fastapi==0.115.11
uvicorn==0.34.0
sqlalchemy==2.0.39
alembic==1.15.1
pymysql==1.1.1
pydantic-settings==2.12.0
python-jose[cryptography]==3.5.0
passlib[bcrypt]==1.7.4
bcrypt==4.3.0
python-multipart==0.0.20
email-validator==2.3.0
```
> Pinning dependencies helps prevent unexpected version incompatibilities between local development and production deployment.
---

# 🚀 Production Features

| Feature | Status |
|----------|--------|
| ⚡ FastAPI REST Backend | ✅ |
| ⚛️ React TypeScript Frontend | ✅ |
| ☁️ Vercel Frontend Deployment | ✅ |
| 🚀 Render Backend Deployment | ✅ |
| 🗄️ TiDB Cloud Database | ✅ |
| 🌐 HTTPS API Communication | ✅ |
| 🔐 JWT Authentication | ✅ |
| 👥 Role-Based Access Control | ✅ |
| 🔑 Bearer Token Authentication | ✅ |
| 📡 JSON REST Communication | ✅ |
| 🛡️ Protected API Routes | ✅ |
| 🧾 Activity Logging | ✅ |
| 🔍 Asset Auditing | ✅ |
| 🔔 Notifications | ✅ |
| 🛠️ Maintenance Workflow | ✅ |
| 📅 Resource Booking | ✅ |
| 🔄 Asset Transfer Workflow | ✅ |
| ↩️ Asset Return Workflow | ✅ |
| 📊 Operational Dashboard | ✅ |
| 📈 Modular Architecture | ✅ |

---

# 🔌 REST API Overview

| Module | Status |
|--------|--------|
| Authentication | ✅ |
| Users / Employees | ✅ |
| Departments | ✅ |
| Categories | ✅ |
| Assets | ✅ |
| Allocations | ✅ |
| Transfers | ✅ |
| Returns | ✅ |
| Bookings | ✅ |
| Maintenance | ✅ |
| Notifications | ✅ |
| Activity Logs | ✅ |
| Audits | ✅ |

---

# 📂 Project Structure

```text
AssetFlow/
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   └── ...
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── ...
│   │   │
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   │
│   │   ├── models/
│   │   │
│   │   ├── schemas/
│   │   │
│   │   ├── services/
│   │   │
│   │   └── main.py
│   │
│   ├── alembic/
│   │   └── versions/
│   │
│   ├── certs/
│   │   └── isrgrootx1.pem
│   │
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts
│   │   │
│   │   ├── components/
│   │   │
│   │   ├── layouts/
│   │   │
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Signup/
│   │   │   ├── Dashboard/
│   │   │   ├── Employees/
│   │   │   ├── Departments/
│   │   │   ├── Categories/
│   │   │   ├── Assets/
│   │   │   ├── Allocations/
│   │   │   ├── Transfers/
│   │   │   ├── Returns/
│   │   │   ├── Bookings/
│   │   │   ├── Maintenance/
│   │   │   ├── Notifications/
│   │   │   ├── ActivityLogs/
│   │   │   └── Audits/
│   │   │
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── docs/
│
├── .env.example
├── .gitignore
└── README.md
```
---

# 🌐 Frontend Routes

AssetFlow provides dedicated interfaces for the major system workflows.

```text
/
├── /login
├── /signup
│
├── /dashboard
├── /users
├── /departments
├── /categories
├── /assets
├── /audits
├── /allocations
├── /transfers
├── /returns
├── /bookings
├── /maintenance
├── /notifications
└── /activity-logs
```

---

# 👨‍💼 Administrative Workflow

```text
Login
  │
  ▼
Dashboard
  │
  ├── Employees
  │
  ├── Departments
  │
  ├── Categories
  │
  ├── Assets
  │
  ├── Allocations
  │
  ├── Transfers
  │
  ├── Returns
  │
  ├── Bookings
  │
  ├── Maintenance
  │
  ├── Notifications
  │
  ├── Activity Logs
  │
  └── Audits
```

---

# 📦 Asset Manager Workflow

```text
Login
  │
  ▼
Dashboard
  │
  ▼
Asset Management
  │
  ├── Create Asset
  ├── View Assets
  ├── Search / Filter
  ├── Update Asset
  ├── Manage Status
  │
  ▼
Allocation
  │
  ├── Assign Asset
  ├── Track Allocation
  │
  ▼
Transfer / Return
  │
  ├── Transfer Requests
  └── Return Requests
  │
  ▼
Maintenance
  │
  ▼
Audit
```

---

# 👤 Employee Workflow

```text
Login
  │
  ▼
Dashboard
  │
  ├── Assigned Assets
  ├── Resource Bookings
  ├── Notifications
  └── Personal Account
```
---

# 🔄 Complete Asset Lifecycle

```text id="0ot2kl"
                    Asset Registration
                           │
                           ▼
                       AVAILABLE
                           │
                           ▼
                       ALLOCATION
                           │
                           ▼
                       ALLOCATED
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          RETURN        TRANSFER      MAINTENANCE
             │             │             │
             ▼             ▼             ▼
         AVAILABLE      NEW USER     IN PROGRESS
                                         │
                                         ▼
                                      RESOLVED
                                         │
                                         ▼
                                      AVAILABLE
                                         │
                                         ▼
                                  ┌─────────────┐
                                  │ LOST        │
                                  │ RETIRED     │
                                  │ DISPOSED    │
                                  └─────────────┘
```

---

# 🧠 Business Workflow Architecture

```text id="2c7u3x"
                    ┌──────────────┐
                    │   Employee   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Asset     │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
     Allocation        Booking          Transfer
          │                │                │
          ▼                ▼                ▼
       Employee         Resource          New User
          │
          ▼
       Return
          │
          ▼
      Maintenance
          │
          ▼
        Audit
          │
          ▼
     Discrepancy
          │
          ▼
      Resolution
```
---

# 🧪 API Architecture

The backend follows a layered architecture separating API routes, schemas, services, models, and database access.

```text
HTTP Request
     │
     ▼
API Router
     │
     ▼
Authentication / Authorization
     │
     ▼
Pydantic Schema Validation
     │
     ▼
Service Layer
     │
     ▼
SQLAlchemy ORM
     │
     ▼
TiDB Cloud
     │
     ▼
SQLAlchemy Model
     │
     ▼
Service Response
     │
     ▼
Pydantic Response Schema
     │
     ▼
JSON API Response
```
---

# 🚀 Local Development

## 1. Clone Repository

```bash
git clone https://github.com/kumardarun11/AssetFlow.git
cd AssetFlow
```

---

## 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Configure the backend environment variables and database connection.

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

Backend will be available at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

Frontend will normally be available at:

```text
http://localhost:5173
```
---

# 🔄 Development Workflow

```text
Developer
   │
   ▼
Create Feature
   │
   ▼
Implement Frontend / Backend
   │
   ▼
Local Testing
   │
   ▼
API Validation
   │
   ▼
Production Build
   │
   ▼
Git Commit
   │
   ▼
Git Push
   │
   ├───────────────┐
   ▼               ▼
 Vercel           Render
Frontend          Backend
   │               │
   └───────┬───────┘
           ▼
      Production
```
---

# 🛣️ Roadmap

| Version | Planned Feature | Status |
|----------|-----------------|--------|
| v1.0 | React + TypeScript Frontend | ✅ Completed |
| v1.0 | FastAPI REST Backend | ✅ Completed |
| v1.0 | JWT Authentication | ✅ Completed |
| v1.0 | User Management | ✅ Completed |
| v1.0 | Department Management | ✅ Completed |
| v1.0 | Asset Categories | ✅ Completed |
| v1.0 | Asset Management | ✅ Completed |
| v1.0 | Asset Allocation | ✅ Completed |
| v1.0 | Asset Transfers | ✅ Completed |
| v1.0 | Asset Returns | ✅ Completed |
| v1.0 | Resource Booking | ✅ Completed |
| v1.0 | Maintenance Management | ✅ Completed |
| v1.0 | Notifications | ✅ Completed |
| v1.0 | Activity Logs | ✅ Completed |
| v1.0 | Audit Management | ✅ Completed |
| v1.0 | TiDB Cloud Integration | ✅ Completed |
| v1.0 | Vercel Deployment | ✅ Completed |
| v1.0 | Render Deployment | ✅ Completed |
| v1.1 | Advanced Dashboard Analytics | 📅 Planned |
| v1.1 | Advanced Reporting | 📅 Planned |
| v1.1 | Exportable Asset Reports | 📅 Planned |
| v1.2 | Email Notifications | 📅 Planned |
| v1.2 | QR-Based Asset Identification | 📅 Planned |
| v1.2 | QR-Based Asset Auditing | 📅 Planned |
| v2.0 | Predictive Maintenance | 📅 Planned |
| v2.0 | AI-Based Asset Recommendations | 📅 Planned |
| v2.0 | Advanced Asset Analytics | 📅 Planned |

---

# 🤝 Contributing

Contributions are welcome.

If you would like to improve AssetFlow:

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test the changes locally.
5. Verify API integration.
6. Commit your changes.
7. Push the branch.
8. Submit a Pull Request.

Please ensure contributions follow the existing project architecture and coding standards.

---

# 📄 License

This project is licensed under the **MIT License**.

See the **LICENSE** file for complete license details.

---

# 👨‍💻 Project Purpose

AssetFlow was developed to demonstrate modern full-stack software engineering through the implementation of a scalable enterprise asset and resource management platform.

The project focuses on solving a practical organizational problem: **managing physical and digital resources throughout their complete lifecycle while maintaining accountability, traceability, and operational visibility.**

The system demonstrates:

- Full-Stack Web Development
- React Application Development
- TypeScript Development
- FastAPI Backend Engineering
- RESTful API Development
- JWT Authentication
- Role-Based Access Control
- SQLAlchemy ORM
- MySQL-Compatible Database Integration
- Cloud Database Deployment
- Cloud Application Deployment
- Asset Lifecycle Management
- Resource Booking
- Maintenance Workflows
- Transfer and Return Workflows
- Audit Management
- Discrepancy Tracking
- Notification Systems
- Activity Logging
- Modular Application Architecture
- Production Frontend Deployment
- Production Backend Deployment

AssetFlow provides a foundation for organizations to move away from fragmented spreadsheets and manual asset tracking toward a centralized, secure, and scalable asset management platform.

---

# ⭐ Project Highlights

```text
                    ASSETFLOW
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
       Assets       Employees      Resources
          │             │             │
          └─────────────┼─────────────┘
                        │
                        ▼
                 Centralized System
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
      Allocation     Maintenance     Booking
          │             │             │
          └─────────────┼─────────────┘
                        │
                        ▼
                  Audit & Tracking
                        │
                        ▼
                Complete Lifecycle
```
---

# 🔌 REST API Endpoint Reference

AssetFlow follows a RESTful API architecture where the frontend communicates with the FastAPI backend through structured HTTP endpoints.

The backend API is organized by functional modules such as authentication, employees, departments, categories, assets, allocations, transfers, returns, bookings, maintenance, notifications, activity logs, and audits.

---

## 🔐 Authentication

| Method | Endpoint           | Description                                     |
| ------ | ------------------ | ----------------------------------------------- |
| `POST` | `/api/auth/signup` | Register a new user                             |
| `POST` | `/api/auth/login`  | Authenticate user and generate JWT access token |

---

## 👥 Employee Management

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| `GET`  | `/api/users`           | Retrieve users/employees |
| `GET`  | `/api/users/{user_id}` | Retrieve a specific user |
| `PUT`  | `/api/users/{user_id}` | Update user information  |

---

## 🏢 Department Management

| Method | Endpoint                                      | Description             |
| ------ | --------------------------------------------- | ----------------------- |
| `POST` | `/api/departments`                            | Create a department     |
| `GET`  | `/api/departments`                            | List all departments    |
| `GET`  | `/api/departments/{department_id}`            | Retrieve a department   |
| `PUT`  | `/api/departments/{department_id}`            | Update a department     |
| `PUT`  | `/api/departments/{department_id}/deactivate` | Deactivate a department |

---

## 🗂️ Asset Category Management

| Method | Endpoint                                   | Description              |
| ------ | ------------------------------------------ | ------------------------ |
| `POST` | `/api/categories`                          | Create an asset category |
| `GET`  | `/api/categories`                          | List all categories      |
| `GET`  | `/api/categories/{category_id}`            | Retrieve a category      |
| `PUT`  | `/api/categories/{category_id}`            | Update a category        |
| `PUT`  | `/api/categories/{category_id}/deactivate` | Deactivate a category    |

---

## 💻 Asset Management

| Method  | Endpoint                        | Description            |
| ------- | ------------------------------- | ---------------------- |
| `POST`  | `/api/assets`                   | Create an asset        |
| `GET`   | `/api/assets`                   | List and filter assets |
| `GET`   | `/api/assets/{asset_id}`        | Retrieve an asset      |
| `PUT`   | `/api/assets/{asset_id}`        | Update an asset        |
| `PATCH` | `/api/assets/{asset_id}/status` | Update asset status    |

### Asset Filtering

The asset listing endpoint supports filtering by:

```text
category_id
department_id
status
location
search
```

Example:

```text
GET /api/assets?status=AVAILABLE
```

---

## 📦 Asset Allocation

Asset allocation APIs manage the assignment of organizational assets to employees.

```text
/api/allocations
```

The allocation module handles asset assignment and allocation-related operations.

---

## 🔄 Asset Transfer

Asset transfer APIs manage the movement of allocated assets between users or organizational units.

```text
/api/transfers
```

Transfer requests support the defined transfer workflow and statuses.

---

## ↩️ Asset Returns

Asset return APIs manage the process of returning allocated assets.

```text
/api/returns
```

Return operations follow the configured return workflow and approval statuses.

---

## 📅 Resource Booking

Resource booking APIs manage bookable organizational assets and resources.

```text
/api/bookings
```

Booking operations support the lifecycle of resource reservations.

---

## 🛠️ Maintenance Management

Maintenance APIs manage asset maintenance requests and their associated workflows.

```text
/api/maintenance
```

Maintenance requests support statuses ranging from pending and approval through technician assignment, in-progress work, and resolution.

---

## 🔔 Notifications

Notification APIs provide users with system-generated notifications related to important asset operations.

```text
/api/notifications
```

Supported notification events include:

* Asset assignment
* Maintenance approval
* Maintenance rejection
* Booking confirmation
* Booking cancellation
* Booking reminders
* Transfer approval
* Overdue returns
* Audit discrepancies

---

## 📋 Activity Logs

Activity log APIs provide an operational history of important system actions.

```text
/api/activity-logs
```

These records support operational traceability and accountability across the AssetFlow platform.

---

## 🔍 Audit Management

Audit APIs provide asset verification and discrepancy tracking.

| Method | Endpoint                                     | Description                  |
| ------ | -------------------------------------------- | ---------------------------- |
| `POST` | `/api/audits`                                | Create an audit cycle        |
| `GET`  | `/api/audits`                                | List audit cycles            |
| `GET`  | `/api/audits/{audit_cycle_id}`               | Retrieve an audit cycle      |
| `POST` | `/api/audits/{audit_cycle_id}/auditors`      | Assign an auditor            |
| `GET`  | `/api/audits/{audit_cycle_id}/auditors`      | List assigned auditors       |
| `POST` | `/api/audits/{audit_cycle_id}/items`         | Add an asset to an audit     |
| `GET`  | `/api/audits/{audit_cycle_id}/items`         | List audit items             |
| `GET`  | `/api/audits/{audit_cycle_id}/discrepancies` | Retrieve audit discrepancies |
| `PUT`  | `/api/audits/items/{audit_item_id}/verify`   | Verify an audit item         |
| `PUT`  | `/api/audits/{audit_cycle_id}/close`         | Close an audit cycle         |

---

## 🔑 API Authentication

Protected endpoints use JWT bearer-token authentication.

The frontend automatically attaches the access token to API requests:

```text
Authorization: Bearer <access_token>
```

Requests are validated by the FastAPI authentication and authorization layer before reaching the corresponding service.

---

## 📚 API Documentation

FastAPI automatically provides interactive API documentation during local development:

```text
http://127.0.0.1:8000/docs
```

The OpenAPI specification provides endpoint definitions, request schemas, response models, authentication requirements, and interactive API testing.

---

## 🧩 API Architecture

```text
React Frontend
      │
      │ Axios / HTTP
      ▼
FastAPI REST API
      │
      ├── Authentication
      ├── Users
      ├── Departments
      ├── Categories
      ├── Assets
      ├── Allocations
      ├── Transfers
      ├── Returns
      ├── Bookings
      ├── Maintenance
      ├── Notifications
      ├── Activity Logs
      └── Audits
      │
      ▼
SQLAlchemy ORM
      │
      ▼
TiDB Cloud Database
```

### API Design Principles

* RESTful resource-oriented endpoints
* JSON-based request and response communication
* JWT bearer-token authentication
* Role-based authorization
* Pydantic request and response validation
* SQLAlchemy-based database interaction
* Centralized API client integration in the frontend
* Consistent HTTP status handling
* Modular backend route and service architecture
---

# 🗄️ Database Schema & Relationships

AssetFlow uses a **MySQL-compatible TiDB Cloud database** with SQLAlchemy ORM for database interaction.

The database is automatically initialized by the FastAPI application using SQLAlchemy metadata.

---

## 📊 Database Tables

AssetFlow currently contains the following core tables:

```text
users
departments
asset_categories
assets
asset_allocations
asset_returns
transfer_requests
resource_bookings
maintenance_requests
notifications
activity_logs
audit_cycles
audit_auditors
audit_items
```

---

## 👤 Users

The `users` table stores employee and system-user information.

```text
users
├── id
├── name
├── email
├── password_hash
├── role
├── status
├── department_id
└── timestamps
```

Users are associated with departments and participate in asset allocation, transfers, returns, bookings, maintenance, audits, and other operational workflows.

---

## 🏢 Departments

The `departments` table represents the organizational structure.

```text
departments
├── id
├── name
├── parent_department_id
├── department_head_id
├── status
└── timestamps
```

Departments can support hierarchical organizational structures through `parent_department_id`.

---

## 🗂️ Asset Categories

The `asset_categories` table stores reusable categories for organizational assets.

```text
asset_categories
├── id
├── name
├── custom_fields
├── status
└── timestamps
```

Examples include laptops, monitors, mobile devices, vehicles, and other organizational resources.

---

## 💻 Assets

The `assets` table contains the central inventory records managed by AssetFlow.

```text
assets
├── id
├── asset_tag
├── name
├── category_id
├── department_id
├── serial_number
├── acquisition_date
├── acquisition_cost
├── condition
├── status
├── location
├── is_bookable
├── photo_url
├── custom_data
└── timestamps
```

Each asset belongs to an asset category and may be associated with a department.

---

## 📦 Asset Allocations

The `asset_allocations` table tracks assets assigned to users.

```text
asset_allocations
├── id
├── asset_id
├── user_id
├── allocated_by
├── allocation_date
├── expected_return_date
├── status
└── timestamps
```

This table provides the relationship between organizational assets and employees.

---

## ↩️ Asset Returns

The `asset_returns` table records asset return operations.

```text
asset_returns
├── id
├── allocation_id
├── returned_by
├── approved_by
├── return_date
├── condition
├── status
└── timestamps
```

Returns are associated with the corresponding asset allocation.

---

## 🔄 Transfer Requests

The `transfer_requests` table stores requests to transfer assets.

```text
transfer_requests
├── id
├── asset_id
├── from_user_id
├── to_user_id
├── requested_by
├── approved_by
├── status
└── timestamps
```

This enables AssetFlow to maintain traceability when an asset changes ownership or assignment.

---

## 📅 Resource Bookings

The `resource_bookings` table manages reservations for bookable assets.

```text
resource_bookings
├── id
├── asset_id
├── user_id
├── start_time
├── end_time
├── status
└── timestamps
```

Only assets configured as bookable can participate in the resource-booking workflow.

---

## 🛠️ Maintenance Requests

The `maintenance_requests` table tracks maintenance operations associated with assets.

```text
maintenance_requests
├── id
├── asset_id
├── requested_by
├── assigned_technician
├── priority
├── status
├── issue_description
└── timestamps
```

Maintenance records allow the system to track an asset from issue reporting through resolution.

---

## 🔔 Notifications

The `notifications` table stores system-generated notifications.

```text
notifications
├── id
├── user_id
├── type
├── title
├── message
├── is_read
└── timestamps
```

Notifications can be generated for important operational events such as assignments, bookings, maintenance updates, transfers, overdue returns, and audit discrepancies.

---

## 📋 Activity Logs

The `activity_logs` table maintains a history of important system actions.

```text
activity_logs
├── id
├── user_id
├── action
├── entity_type
├── entity_id
├── description
└── timestamp
```

This provides an additional layer of operational traceability across the platform.

---

## 🔍 Audit Tables

AssetFlow uses three tables for audit management.

### Audit Cycles

```text
audit_cycles
├── id
├── name
├── department_id
├── location
├── start_date
├── end_date
├── status
├── created_by_id
└── timestamps
```

### Audit Auditors

```text
audit_auditors
├── id
├── audit_cycle_id
└── auditor_id
```

### Audit Items

```text
audit_items
├── id
├── audit_cycle_id
├── asset_id
├── verified_by_id
├── status
├── discrepancy_notes
├── verified_at
└── timestamps
```

Together, these tables allow AssetFlow to create audit cycles, assign auditors, verify assets, and track discrepancies.

---

## 🔗 Entity Relationship Overview

```text
                         ┌──────────────┐
                         │    USERS     │
                         └──────┬───────┘
                                │
                ┌───────────────┼────────────────┐
                │               │                │
                ▼               ▼                ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │ DEPARTMENTS  │ │ ALLOCATIONS  │ │  BOOKINGS    │
        └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
               │                │                │
               │                ▼                │
               │         ┌──────────────┐        │
               │         │    RETURNS   │        │
               │         └──────────────┘        │
               │                                 │
               ▼                                 ▼
        ┌──────────────┐                  ┌──────────────┐
        │    ASSETS    │◄─────────────────│              │
        └──────┬───────┘                  └──────────────┘
               │
       ┌───────┼────────┬──────────────┐
       │       │        │              │
       ▼       ▼        ▼              ▼
   CATEGORY  TRANSFER  MAINTENANCE   AUDIT ITEMS
       │
       ▼
 ASSET CATEGORIES
```

---

## 🧩 Database Architecture

```text
React Frontend
       │
       ▼
FastAPI REST API
       │
       ▼
Service Layer
       │
       ▼
SQLAlchemy ORM
       │
       ▼
TiDB Cloud
       │
       ├── Users
       ├── Departments
       ├── Assets
       ├── Allocations
       ├── Transfers
       ├── Returns
       ├── Bookings
       ├── Maintenance
       ├── Notifications
       ├── Activity Logs
       └── Audits
```

## ✨ Database Highlights

* MySQL-compatible relational database architecture
* TiDB Cloud production database
* SQLAlchemy ORM
* Relational entity associations
* Centralized asset records
* Complete asset lifecycle tracking
* Audit and discrepancy persistence
* User and department relationships
* Operational activity logging
* Automatic table creation through SQLAlchemy metadata
* Cloud-ready database architecture
---

# 🔐 Role & Permission Matrix

AssetFlow implements **role-based access control (RBAC)** to ensure that users can access only the operations permitted by their assigned role.

The system currently defines four primary roles:

* `ADMIN`
* `ASSET_MANAGER`
* `DEPARTMENT_HEAD`
* `EMPLOYEE`

---

## 👑 ADMIN

The Administrator has the highest level of system access and is responsible for managing the overall AssetFlow platform.

### Permissions

* Manage users
* Manage departments
* Manage asset categories
* Manage assets
* Manage asset lifecycle operations
* Manage allocations
* Manage transfers
* Manage returns
* Manage bookings
* Manage maintenance workflows
* Access notifications
* Access activity logs
* Manage audit cycles
* Assign auditors
* Verify audit items
* Close audit cycles

---

## 📦 ASSET_MANAGER

The Asset Manager is primarily responsible for organizational asset administration and lifecycle operations.

### Permissions

* View assets
* Create assets
* Update assets
* Update asset status
* Manage asset allocations
* Manage asset transfers
* Manage asset returns
* Manage maintenance operations
* Access audit management
* Create audit cycles
* Assign auditors
* Add audit items
* Verify audit items
* View discrepancies

---

## 🏢 DEPARTMENT_HEAD

The Department Head manages resources and operations associated with their organizational department.

### Permissions

* View relevant organizational information
* View assets
* Participate in allocation workflows
* Participate in transfer workflows
* Participate in return workflows
* Use resource booking functionality
* Access relevant notifications
* Participate in department-level operational workflows

---

## 👤 EMPLOYEE

Employees are standard system users who interact with assets and resources assigned or available to them.

### Permissions

* View available assets/resources
* View assigned assets
* Request or participate in applicable allocation workflows
* Request transfers where permitted
* Request asset returns
* Book available bookable resources
* Submit maintenance-related requests where permitted
* View personal notifications
* View relevant activity information

---

## 📊 Role Comparison Matrix

| Capability            | ADMIN | ASSET_MANAGER | DEPARTMENT_HEAD | EMPLOYEE |
| --------------------- | :---: | :-----------: | :-------------: | :------: |
| User Management       |   ✅   |       ❌       |        ❌        |     ❌    |
| Department Management |   ✅   |       ❌       |        ❌        |     ❌    |
| Category Management   |   ✅   |       ❌       |        ❌        |     ❌    |
| Asset Management      |   ✅   |       ✅       |     Limited     |  Limited |
| Asset Allocation      |   ✅   |       ✅       |        ✅        |     ✅    |
| Asset Transfer        |   ✅   |       ✅       |        ✅        |  Limited |
| Asset Returns         |   ✅   |       ✅       |        ✅        |     ✅    |
| Resource Booking      |   ✅   |       ✅       |        ✅        |     ✅    |
| Maintenance           |   ✅   |       ✅       |        ✅        |  Limited |
| Notifications         |   ✅   |       ✅       |        ✅        |     ✅    |
| Activity Logs         |   ✅   |       ✅       |     Limited     |  Limited |
| Audit Management      |   ✅   |       ✅       |     Limited     |     ❌    |
| Auditor Assignment    |   ✅   |       ✅       |        ❌        |     ❌    |
| Audit Verification    |   ✅   |       ✅       |        ❌        |     ❌    |
| System Administration |   ✅   |    Limited    |        ❌        |     ❌    |

---

## 🛡️ Authorization Architecture

Authorization is enforced at the backend API layer rather than relying only on frontend visibility.

```text
User Login
    │
    ▼
JWT Access Token
    │
    ▼
FastAPI Authentication
    │
    ▼
Current User
    │
    ▼
Role Verification
    │
    ├── ADMIN
    ├── ASSET_MANAGER
    ├── DEPARTMENT_HEAD
    └── EMPLOYEE
    │
    ▼
Permission Check
    │
    ▼
Protected API Endpoint
    │
    ▼
Service Layer
    │
    ▼
Database
```

This ensures that restricted operations cannot be accessed simply by bypassing the frontend interface.

---

## 🔑 Defined User Roles

```text
ADMIN
   │
   ├── System Administration
   ├── User Management
   ├── Asset Management
   ├── Audit Management
   └── Full Operational Access

ASSET_MANAGER
   │
   ├── Asset Management
   ├── Allocation
   ├── Transfer
   ├── Returns
   ├── Maintenance
   └── Auditing

DEPARTMENT_HEAD
   │
   ├── Department Operations
   ├── Asset Usage
   ├── Resource Booking
   └── Operational Requests

EMPLOYEE
   │
   ├── Assigned Assets
   ├── Resource Booking
   ├── Returns
   ├── Requests
   └── Notifications
```

## ✨ RBAC Highlights

* Centralized role definitions
* JWT-based authenticated sessions
* Backend-enforced authorization
* Role-specific API access
* Separation of administrative and operational responsibilities
* Reduced unauthorized access risk
* Scalable permission architecture for future roles and permissions
---

# ⚠️ Known Limitations

Although AssetFlow provides a complete asset and resource management workflow, the current version has several areas that can be improved in future iterations.

### Current Limitations

* Advanced analytics and predictive reporting are not currently implemented.
* Real-time notifications are limited to the application's notification workflow.
* Automated email and SMS notification services are not currently integrated.
* Fine-grained permission management beyond the defined user roles is not yet implemented.
* Asset barcode or QR-code scanning is not currently integrated.
* Mobile applications are not currently available.
* Advanced document and invoice management is outside the current scope.
* Automated scheduled maintenance reminders are not fully implemented.
* Advanced audit automation and physical asset scanning are not currently supported.
* Offline operation is not supported.
* The current dashboard focuses primarily on operational asset information rather than advanced business intelligence.

---

# 🚀 Future Enhancements

AssetFlow is designed to be extensible, allowing additional capabilities to be introduced as the platform evolves.

### 📱 Mobile Application

Develop dedicated Android and iOS applications for employees, asset managers, and administrators.

### 📷 QR & Barcode Integration

Introduce QR-code and barcode-based asset identification for faster:

* Asset lookup
* Allocation
* Returns
* Audits
* Inventory verification

### 🤖 AI-Powered Asset Intelligence

Introduce machine learning capabilities for:

* Asset demand forecasting
* Maintenance prediction
* Asset utilization analysis
* Replacement recommendations
* Anomaly detection
* Intelligent reporting

### 📊 Advanced Analytics

Expand the dashboard with:

* Asset utilization trends
* Department-wise asset distribution
* Maintenance cost analysis
* Asset depreciation insights
* Allocation trends
* Operational KPIs

### 🔔 Automated Notifications

Integrate external notification services for:

* Email notifications
* SMS alerts
* Automated return reminders
* Maintenance reminders
* Booking reminders
* Audit alerts

### 🔐 Advanced Access Control

Introduce more granular permission management with customizable permissions and policy-based access control.

### ☁️ Scalable Cloud Architecture

Further enhance the deployment architecture with:

* Containerized production deployment
* Automated CI/CD pipelines
* Horizontal scaling
* Advanced monitoring
* Centralized logging
* Cloud-native infrastructure

### 📦 Inventory Scanning

Enable physical inventory verification using mobile cameras, QR codes, and barcode scanners.

### 🔄 Workflow Automation

Automate repetitive organizational workflows such as:

* Allocation approvals
* Transfer approvals
* Return processing
* Maintenance escalation
* Audit scheduling
* Overdue asset handling

### 🌐 Enterprise Expansion

Extend AssetFlow to support larger organizations with multiple branches, locations, departments, and centralized asset governance.

---

# 🎯 Conclusion

AssetFlow provides a centralized platform for managing organizational assets and resources throughout their complete lifecycle.

The system combines **asset management, allocation, transfers, returns, bookings, maintenance, notifications, activity tracking, and auditing** within a unified web application.

Its modular architecture, RESTful APIs, role-based authorization, SQLAlchemy ORM, and cloud-hosted database provide a foundation that can be extended as organizational requirements grow.

```text
                    AssetFlow
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   Asset Control   Resource Usage   Governance
        │               │               │
        ▼               ▼               ▼
   Allocation       Booking         Auditing
   Transfer         Maintenance     Activity Logs
   Returns          Notifications   Discrepancies
        │               │               │
        └───────────────┼───────────────┘
                        ▼
              Centralized Management
                        │
                        ▼
              Better Asset Visibility
                        │
                        ▼
             Efficient Operations
```

## ✨ Final Project Highlights

* Centralized organizational asset management
* Complete asset lifecycle tracking
* Role-based access control
* RESTful FastAPI backend
* React 19 + TypeScript frontend
* SQLAlchemy ORM
* TiDB Cloud database
* Asset allocation and transfer workflows
* Asset return management
* Resource booking
* Maintenance management
* Notification system
* Activity logging
* Audit and discrepancy tracking
* Responsive web interface
* Production deployment on Vercel and Render
* Cloud-ready and extensible architecture

**AssetFlow transforms traditional asset tracking into a centralized, structured, and scalable digital management system.**
---