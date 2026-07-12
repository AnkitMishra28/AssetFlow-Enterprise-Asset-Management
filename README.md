# AssetFlow – Enterprise Asset & Resource Management System

AssetFlow is a modern Enterprise Asset & Resource Management System that enables organizations to efficiently manage the complete lifecycle of physical assets and shared resources through a centralized ERP platform.

Designed with scalability, security, and operational efficiency in mind, AssetFlow replaces fragmented spreadsheets, paper registers, and manual approval processes with structured digital workflows. The platform is industry-agnostic and can be deployed across enterprises, educational institutions, hospitals, manufacturing facilities, government organizations, and startups to manage IT assets, office equipment, vehicles, furniture, laboratories, meeting rooms, and other shared organizational resources.

Rather than focusing on procurement or accounting, AssetFlow specializes in asset lifecycle management, allocation, maintenance, auditing, and resource scheduling while ensuring complete accountability through role-based access control and activity tracking.

---

# Problem Statement

Many organizations continue to rely on spreadsheets, paper logs, or disconnected software for asset management. These approaches create several operational challenges:

* Assets become misplaced or untraceable.
* Double allocation causes scheduling conflicts.
* Maintenance requests are delayed due to informal communication.
* Audit processes become time-consuming and error-prone.
* Asset ownership and responsibility remain unclear.
* Managers lack real-time visibility into organizational resources.
* Historical asset records are fragmented or unavailable.

AssetFlow addresses these challenges by providing a centralized ERP platform that standardizes asset operations, automates workflows, and maintains a complete audit trail throughout an asset's lifecycle.

---

# Key Features

* Complete asset lifecycle management
* Organization-wide asset visibility
* Shared resource booking with conflict prevention
* Structured maintenance workflows
* Department-based asset allocation
* Automated audit cycles
* Role-based access control (RBAC)
* Real-time dashboards and analytics
* Immutable activity logs
* Responsive modern web interface

---

# Core Modules

## 1. Organization Setup

This module establishes the organizational structure used throughout the system.

### Department Management

* Create, edit, and archive departments
* Configure parent-child department hierarchy
* Assign Department Heads
* View department-wise asset ownership

### Asset Categories

Define standardized asset classifications such as:

* Electronics
* Furniture
* Vehicles
* Laboratory Equipment
* Office Equipment
* Infrastructure

Each category can contain configurable metadata fields for storing category-specific information.

### Employee Directory

Maintain a centralized employee database that serves as the foundation for authentication and role assignment.

Administrators can promote employees into organizational roles such as:

* Asset Manager
* Department Head

---

## 2. Asset Registration & Directory

A centralized repository containing every organizational asset.

### Registration

Each asset stores comprehensive information including:

* Auto-generated Asset ID
* Asset Tag
* Serial Number
* Category
* Manufacturer
* Model
* Purchase Details
* Current Location
* Department
* Assigned Employee
* Warranty Information
* Current Condition
* Supporting Documents

### Asset Lifecycle

Every asset progresses through a controlled lifecycle:

* Available
* Reserved
* Allocated
* Under Maintenance
* Lost
* Retired
* Disposed

State transitions are validated by the system to prevent inconsistent data.

### Asset History

Every asset maintains a permanent history including:

* Allocation records
* Transfer history
* Maintenance history
* Audit history
* Condition changes
* Activity logs

---

## 3. Asset Allocation & Transfer

Manages asset ownership while preventing conflicts.

### Allocation

Asset Managers can assign assets to:

* Individual employees
* Departments

Each allocation records:

* Allocation date
* Expected return date
* Current custodian
* Allocation notes

### Conflict Prevention

An asset cannot be allocated to multiple users simultaneously.

If an asset is already allocated, the system automatically redirects users to the Transfer Request workflow instead of allowing manual overrides.

### Transfer Workflow

Transfers follow an approval-based workflow involving:

* Request creation
* Department approval
* Asset Manager approval
* Ownership transfer
* Activity logging

### Asset Return

Returned assets undergo inspection before becoming available again.

The return process captures:

* Return condition
* Damage notes
* Missing accessories
* Return timestamp

Assets automatically transition back to the **Available** state after successful check-in.

Overdue returns trigger automated notifications.

---

## 4. Resource Booking

Supports reservation of shared organizational resources.

Examples include:

* Meeting rooms
* Company vehicles
* Conference halls
* Training laboratories
* Shared equipment

### Calendar-Based Booking

Users can:

* View resource availability
* Reserve time slots
* Modify bookings
* Cancel reservations

### Booking Validation

The system automatically prevents:

* Overlapping reservations
* Double booking
* Invalid booking durations

### Booking Lifecycle

Each reservation progresses through:

* Upcoming
* Ongoing
* Completed
* Cancelled

Automated reminders are sent before scheduled bookings.

---

## 5. Maintenance Management

Provides a structured maintenance workflow for asset repairs.

### Request Creation

Employees can report issues by specifying:

* Asset
* Problem description
* Priority
* Attachments

### Approval Workflow

Maintenance follows a structured approval chain:

Pending

↓

Approved / Rejected

↓

Technician Assignment

↓

In Progress

↓

Resolved

↓

Closed

### Automatic Asset Status Updates

Once approved:

* Asset status changes to **Under Maintenance**

After resolution:

* Asset status returns to **Available**

Every maintenance request becomes part of the asset's permanent service history.

---

## 6. Asset Audit Management

Enables systematic physical verification of organizational assets.

### Audit Cycle Creation

Administrators can define audits by:

* Department
* Location
* Asset Category
* Date Range

### Physical Verification

Auditors verify each asset and assign one of the following statuses:

* Verified
* Missing
* Damaged

### Discrepancy Reports

Upon completion, AssetFlow automatically generates reports identifying:

* Missing assets
* Damaged assets
* Verification exceptions

Closing an audit permanently locks the records and updates asset statuses where necessary.

Example:

Missing → Lost

---

## 7. Dashboards, Reports & Analytics

Provides real-time operational insights.

### Dashboard Metrics

Monitor:

* Total Assets
* Available Assets
* Allocated Assets
* Assets Under Maintenance
* Active Bookings
* Overdue Returns
* Pending Maintenance Requests
* Active Audit Cycles

### Reports

Generate exportable reports including:

* Asset utilization
* Department-wise inventory
* Allocation history
* Maintenance frequency
* Resource booking analytics
* Audit discrepancy reports

### Activity Log

Every critical action performed in the system is recorded, including:

* Asset creation
* Allocation
* Transfers
* Maintenance approvals
* Booking updates
* Audit actions
* Administrative changes

This ensures complete traceability and accountability.

---

# Role-Based Access Control (RBAC)

AssetFlow implements strict role separation to ensure secure operations.

## Administrator

Responsible for organization-wide configuration.

Permissions include:

* Manage departments
* Manage asset categories
* Manage employees
* Assign organizational roles
* Configure system settings
* View organization-wide reports

---

## Asset Manager

Responsible for operational asset management.

Permissions include:

* Register assets
* Allocate assets
* Approve transfers
* Approve maintenance requests
* Manage asset lifecycle
* Resolve audit discrepancies
* Generate reports

---

## Department Head

Responsible for departmental resources.

Permissions include:

* View departmental assets
* Approve internal transfers
* Monitor department inventory
* Book shared resources
* Review department reports

---

## Employee

Responsible for personal asset interactions.

Permissions include:

* View assigned assets
* Request asset transfers
* Return assets
* Book shared resources
* Submit maintenance requests
* Track request status

---

# System Workflow

```
Organization Setup
        │
        ▼
Asset Registration
        │
        ▼
Asset Allocation
        │
        ▼
Resource Booking
        │
        ▼
Maintenance Management
        │
        ▼
Audit Cycle
        │
        ▼
Reports & Analytics
```

---

# Technology Stack

## Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* Framer Motion

## Backend

* Next.js API Routes
* Server Actions
* Node.js
* JWT Authentication

## Database

* MongoDB
* Mongoose ODM

## Authentication & Security

* JWT Authentication
* Role-Based Access Control (RBAC)
* Protected Routes
* Secure API Authorization
* Activity Logging

---

# Local Development

## Clone Repository

```bash
git clone https://github.com/yourusername/AssetFlow.git
```

## Navigate to Project

```bash
cd AssetFlow
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

Create a `.env.local` file and add the required environment variables:

```env
MONGODB_URI=
JWT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

## Start Development Server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# Future Enhancements

Potential extensions for future versions include:

* QR Code and Barcode asset tracking
* RFID integration
* Mobile application
* Multi-organization support
* Predictive maintenance using analytics
* Email and SMS notifications
* Advanced approval workflows
* Asset depreciation tracking
* REST API integrations
* Business Intelligence dashboards

---

# License

This project was developed as a demonstration of an enterprise-grade Asset & Resource Management System, showcasing scalable ERP architecture, secure role-based workflows, and modern full-stack web development practices. It is intended for educational, research, and demonstration purposes.
