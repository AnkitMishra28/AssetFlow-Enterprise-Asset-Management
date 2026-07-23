<div align="center">

# AssetFlow – Enterprise Asset & Resource Management System

### *A full-stack Enterprise Resource Planning (ERP) platform for real-time asset lifecycle tracking, conflict-free resource scheduling, department allocation workflows, automated audits, and AI-driven predictive insights.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-9.7-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)

---

[Live Demo](#-live-demo) • [Key Features](#-key-features) • [Architecture](#-architecture) • [API Overview](#-api-overview) • [Database Models](#-database-models) • [My Contributions](#-my-contributions) • [Screenshots](#-screenshots)

</div>

<br />

---

## Live Demo

The application can be accessed online or evaluated locally using the pre-seeded public demo credentials below:

🌐 **Repository URL**: [https://github.com/AnkitMishra28/AssetFlow-Enterprise-Asset-Management](https://github.com/AnkitMishra28/AssetFlow-Enterprise-Asset-Management)

### Public Demo Accounts

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Employee** | `demo@asset.com` | `password123` | Asset viewing, booking, transfer requests & personal check-ins |
| **Administrator** | `admin@assetflow.com` | `admin123` | Full system access, organization setup, audit cycles & approvals |

> *Sign in at `/login` to access the main executive dashboard.*

---

## Business Overview

**AssetFlow** is an enterprise-grade ERP system engineered to digitalize and centralize physical asset tracking and shared resource allocation across complex organizations.

### Problem Statement
Organizations traditionally rely on fragmented spreadsheets, paper logs, and informal email requests to manage physical assets. This causes:
- **Ghost & Untraceable Assets**: Lack of custodian assignment leads to lost equipment during multi-department transfers.
- **Scheduling Conflicts**: Shared physical resources (meeting rooms, fleet vehicles, testing gear) experience double-booking collisions.
- **Maintenance Latency**: Delayed repair logging results in unexpected equipment failures and prolonged downtime.
- **Audit Compliance Risk**: Manual physical audits are slow, error-prone, and lack immutable audit trails.

### Enterprise Use Cases
- **Corporate IT Fleets**: Centralized check-out and tracking of laptops, monitors, mobile devices, and server hardware.
- **Higher Education & Research**: Shared scheduling of lab instruments, computing hardware, and multi-department facilities.
- **Healthcare Operations**: Medical device tracking, mandatory maintenance logging, and rapid equipment location routing.
- **Manufacturing & Logistics**: Heavy machinery allocation, repair ticket management, and depot check-in/check-out.

---

## Implemented Features

### Asset Lifecycle & Management
- **Asset Registration**: Captures Asset Tag, Serial Number, Category, Purchase Cost, Acquisition Date, Location, and Condition (`New`, `Good`, `Fair`, `Poor`).
- **State Machine Enforcement**: Validates asset lifecycle state transitions:
  $$\text{Available} \longrightarrow \text{Allocated} \longrightarrow \text{Under Maintenance} \longrightarrow \text{Retired} / \text{Disposed}$$
- **Immutable History**: Append-only event history capturing registration, transfers, status updates, and audit notes.
- **QR Tag Scanner**: Camera-based QR tag reader (`@yudiel/react-qr-scanner`) for instant physical verification.

### Allocations & Department Transfers
- **Custodian Tracking**: Direct asset allocation to individual employees or departments with return deadline alerts.
- **Conflict Prevention Engine**: Prevents double allocation of active assets.
- **Transfer Workflow**: Structured request-to-approval process across department heads and asset managers.

### Resource Booking
- **Calendar Reservations**: Time-slot reservation for shared assets, vehicles, and conference rooms.
- **Overlap Detection**: Automated slot validation preventing overlapping reservations.

### Maintenance Operations
- **Repair Tickets**: Issue logging with priority classification and technician assignment.
- **Status Locking**: Approving a repair automatically locks the asset in `Under Maintenance` mode until resolved.

### Audit & Compliance
- **Scheduled Cycles**: Physical verification grouped by location, department, or category.
- **Discrepancy Metrics**: Auto-calculates `Verified`, `Missing`, and `Damaged` counts and locks completed audit cycles.

### Agentic AI Assistant – "Tara"
- **Tool-Calling Agent**: Powered by OpenRouter (`meta-llama/llama-3.1-8b-instruct`), **Tara** executes database tools (`query_assets`, `predict_maintenance`, `resolve_conflict`) via function calling.
- **Predictive Insights**: Calculates maintenance risk probabilities and estimates potential replacement costs.

---

## Tech Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16 (App Router)** | Server Components, Client Components, and dynamic App Routing |
| **UI Engine** | **React 19** | Modern UI rendering and hook-based reactive state management |
| **Type Safety** | **TypeScript 5** | End-to-end interface contracts across models, APIs, and components |
| **Styling & Design** | **Tailwind CSS 4 + Next-Themes** | Responsive styling engine with glassmorphic dark and light theme tokens |
| **Animations & 3D** | **Framer Motion 12 + Three.js** | Micro-animations and WebGL Starfield backdrop visuals |
| **Backend Runtime** | **Next.js API Routes (Node.js)** | Serverless REST API endpoints (`app/api/*`) |
| **Database & ODM** | **MongoDB Atlas + Mongoose 9** | NoSQL database hosting schema-validated collections |
| **AI Integration** | **OpenRouter API (Llama 3.1 8B)** | Tool-calling LLM agent for natural language database queries |
| **Hardware / QR** | **@yudiel/react-qr-scanner** | Live browser camera integration for physical QR asset tag scanning |

---

## Architecture

### 1. System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Browser & Web Mobile)"]
        UI["React 19 Dashboard & Pages"]
        Theme["Next-Themes & Framer Motion"]
        QRScanner["@yudiel/react-qr-scanner"]
    end

    subgraph Server ["Server Layer (Next.js 16 App Router)"]
        APIRoutes["REST API Routes (/app/api/*)"]
        ChatRoute["Tara AI Route (/app/api/chat)"]
        DBHandler["MongoDB Connection Handler (lib/mongodb.ts)"]
    end

    subgraph BusinessLogic ["Business Logic & Validation Layer"]
        ConflictEngine["Allocation Conflict Engine"]
        LifecycleMachine["Asset State Machine"]
        ReportAggregator["Report & Analytics Aggregator"]
    end

    subgraph Infrastructure ["Database & External Services"]
        MongooseODM["Mongoose 9 Models"]
        MongoDB[("MongoDB Atlas Database")]
        OpenRouter["OpenRouter AI Service (Llama 3.1 8B)"]
    end

    UI -->|HTTP REST Requests| APIRoutes
    QRScanner -->|Scanned Tag Data| UI
    APIRoutes --> DBHandler
    DBHandler --> BusinessLogic
    BusinessLogic --> MongooseODM
    MongooseODM --> MongoDB
    ChatRoute -->|Function Call Execution| BusinessLogic
    ChatRoute <-->|Tool Prompts & Responses| OpenRouter
```

### 2. Business Workflow

```mermaid
flowchart LR
    A["1. Organization Setup<br/>(Depts & Categories)"] --> B["2. Asset Registration<br/>(Generate QR & Tags)"]
    B --> C["3. Allocation / Transfer<br/>(Custodian Assignment)"]
    C --> D["4. Shared Resource Booking<br/>(Conflict-Free Calendar)"]
    D --> E["5. Maintenance Ticket<br/>(Auto Lock Status)"]
    E --> F["6. Audit Verification<br/>(Verified / Missing / Damaged)"]
    F --> G["7. Executive Reports<br/>(Analytics & Tara AI)"]
```

---

## Folder Structure

```
AssetFlow-Odoo-Hackathon/
├── app/                        # Next.js 16 App Router hierarchy
│   ├── api/                    # REST API Endpoints
│   │   ├── allocations/        # Allocation check-out/check-in APIs
│   │   ├── assets/             # Asset CRUD & lifecycle routes
│   │   ├── categories/         # Asset category management APIs
│   │   ├── chat/               # Tara AI Assistant function-calling route
│   │   ├── dashboard/          # Aggregated KPI dashboard metrics
│   │   ├── departments/        # Department CRUD endpoints
│   │   ├── employees/          # Employee directory endpoints
│   │   ├── notifications/      # System notifications API
│   │   ├── reports/            # Report generation & analytics routes
│   │   └── transfers/          # Department transfer request APIs
│   ├── components/             # App-level layout components (TaraChatbot, etc.)
│   ├── dashboard/              # Authenticated Portal Routes
│   │   ├── allocation-transfer/# Asset allocation & transfer management
│   │   ├── assets/             # Asset repository & registration modal
│   │   ├── audit/              # Physical audit cycle execution
│   │   ├── maintenance/        # Repair tickets & technician assignment
│   │   ├── notifications/      # System alert feed
│   │   ├── organization-setup/ # Department, Category & Employee config
│   │   ├── reports/            # Executive reports & AI analysis
│   │   ├── resource-booking/   # Shared resource calendar booking
│   │   ├── scanner/            # Live camera QR tag scanner
│   │   ├── layout.tsx          # Dashboard layout wrapper with sidebar
│   │   └── page.tsx            # Dashboard home overview
│   ├── globals.css             # Tailwind CSS styles & custom glassmorphism
│   ├── layout.tsx              # Root HTML layout wrapper
│   └── page.tsx                # Landing Page with WebGL animation
├── components/                 # Core UI Component Design System
│   ├── ui/                     # Reusable design primitives (button, modal, table, etc.)
│   ├── AppleIntro.tsx          # Animated intro UI component
│   └── StarfieldBackground.tsx # Three.js WebGL canvas background
├── docs/
│   └── screenshots/            # Application interface screenshots
├── lib/                        # Infrastructure & Utility Code
│   ├── models/                 # Unified schema exports
│   ├── types/                  # TypeScript interfaces & enums
│   ├── utils/                  # Utility functions (cn, format, healthScore)
│   ├── api.ts                  # Centralized client-side fetch wrapper
│   └── mongodb.ts              # Global MongoDB connection pool handler
├── models/                     # Mongoose Database Models
│   ├── Allocation.ts           # Asset allocation schema
│   ├── Asset.ts                # Main asset repository schema
│   ├── Category.ts             # Asset classification schema
│   ├── Department.ts           # Organizational department schema
│   ├── Employee.ts             # Employee record schema
│   ├── Notification.ts         # User notification schema
│   ├── TransferRequest.ts      # Asset transfer schema
│   └── User.ts                 # Account credentials schema
├── public/                     # Static media assets & icons
├── scripts/                    # Database seeding and utility scripts
├── .env.example                # Template for environment configuration
├── package.json                # Project dependencies & scripts
└── tsconfig.json               # TypeScript compiler configuration
```

---

## Installation & Setup

### Prerequisites
- **Node.js**: `v18.18.0` or higher (Node `v20.x` recommended)
- **npm**: `v9.x` or higher
- **MongoDB**: Active MongoDB Atlas cluster or local database instance

### 1. Clone the Repository
```bash
git clone https://github.com/AnkitMishra28/AssetFlow-Enterprise-Asset-Management.git
cd AssetFlow-Enterprise-Asset-Management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory using `.env.example`:
```bash
cp .env.example .env
```

Set the required environment keys in `.env`:
```env
# MongoDB Atlas Connection URI
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"
DB_NAME="AssetFlow"

# OpenRouter API Key for Tara AI Assistant
OPENROUTER_API_KEY="sk-or-v1-your-openrouter-api-key-here"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
# Build production assets
npm run build

# Start production server
npm run start
```

---

## Environment Variables

| Variable | Description | Required | Default / Example |
| :--- | :--- | :---: | :--- |
| `MONGODB_URI` | MongoDB connection URI string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/AssetFlow` |
| `DB_NAME` | Database name instance | Yes | `AssetFlow` |
| `OPENROUTER_API_KEY` | Secret API Key for OpenRouter (Tara AI Chatbot) | Optional | `sk-or-v1-xxxxxxxxxxxxxxxxxxxx` |

---

## API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/chat` | Tara AI assistant tool calling & chat completions |
| `GET` | `/api/dashboard` | Aggregated executive KPIs and metrics |
| `GET`, `POST` | `/api/assets` | Asset listing and asset registration |
| `GET`, `PUT`, `DELETE` | `/api/assets/[id]` | Asset detail query, update, and deletion |
| `GET`, `POST` | `/api/allocations` | Active custody check-out and allocation listing |
| `GET`, `PUT` | `/api/allocations/[id]` | Allocation return check-in and status update |
| `GET`, `POST` | `/api/transfers` | Cross-department transfer request creation |
| `GET`, `PUT` | `/api/transfers/[id]` | Transfer request approval or rejection |
| `GET`, `POST` | `/api/departments` | Department listing and creation |
| `GET`, `POST` | `/api/employees` | Centralized employee directory management |
| `GET`, `POST` | `/api/categories` | Asset classification category CRUD |
| `GET`, `POST` | `/api/notifications` | User notification listing and creation |

---

## Database Models

- `Asset`: Stores physical items (`assetTag`, `serialNumber`, `category`, `acquisitionCost`, `condition`, `status`, `location`, `sharedBookable`, `history`).
- `Allocation`: Tracks custodian ownership (`asset`, `employee`, `department`, `allocationDate`, `expectedReturnDate`, `actualReturnDate`, `status`).
- `TransferRequest`: Manages inter-departmental transfers (`asset`, `fromDepartment`, `toDepartment`, `requestedBy`, `approvedByDeptHead`, `approvedByAssetManager`, `status`).
- `Department`: Holds organizational structures (`name`, `code`, `parentDepartment`, `departmentHead`).
- `Employee`: Database of company workforce (`employeeId`, `firstName`, `lastName`, `email`, `department`, `role`, `status`).
- `Category`: Asset classifications (`name`, `code`, `description`).
- `Notification`: User alerts (`recipient`, `title`, `message`, `type`, `isRead`).
- `User`: Authentication credentials (`name`, `email`, `passwordHash`, `role`).

---

## My Contributions

> **Author**: Ankit Mishra ([@AnkitMishra28](https://github.com/AnkitMishra28))  
> **Role**: Senior Full-Stack & Backend Systems Engineer

Based strictly on Git commit logs, my contributions focused on establishing the core backend systems, database schemas, REST APIs, and database-frontend integration:

- **Established Backend Foundation & Database Schemas**: Designed and declared Mongoose schemas for `Asset`, `Allocation`, `TransferRequest`, `Department`, `Employee`, `Category`, `Notification`, and `User`.
- 🔌 **Implemented Core REST APIs**: Developed end-to-end serverless API routes under `app/api/*` for asset allocations, transfer workflows, executive dashboard analytics, and custom report aggregations.
- **Organization Setup Backend & Frontend**: Designed and built the Organization Setup page and REST endpoints for managing departments, employee directories, and asset categories.
- **Frontend API Integration & DB Migration**: Led the integration of client-side dashboard views with MongoDB REST APIs and executed database migration logic.
- **Resolved MongoDB Runtime Issues**: Fixed database connection pooling leaks and runtime API handler exceptions (`lib/mongodb.ts`) for serverless Next.js API stability.
- **Resolved Branding Conflicts**: Harmonized UI branding and fixed dark mode design token conflicts across application layouts.
- **Enhanced Asset & Allocation Workflows**: Optimized asset allocation checks, conflict detection, and transfer status update pipelines.

---

## Screenshots

<div align="center">

### 1. Authentication Screen
![Login Page](docs/screenshots/login.png)
*Secure sign-in interface supporting Employee and Administrator authentication.*

---

### 2. Executive Dashboard
![Executive Dashboard](docs/screenshots/dashboard.png)
*Real-time overview of total assets, active allocations, maintenance queues, and activity logs.*

---

### 3. Asset Management Directory
![Asset Management Directory](docs/screenshots/assets.png)
*Centralized inventory repository with lifecycle status badges and asset creation modal.*

---

### 4. Organization Setup
![Organization Setup](docs/screenshots/organization-setup.png)
*Department hierarchy configuration, employee directory, and category management.*

---

### 5. Allocation & Transfer Workflows
![Allocation and Transfer Workflows](docs/screenshots/allocation-transfer.png)
*Custodian check-out management and multi-department transfer approval tracking.*

---

### 6. Shared Resource Booking
![Shared Resource Booking](docs/screenshots/resource-booking.png)
*Interactive calendar reservation interface with automated conflict prevention.*

---

### 7. Maintenance Operations
![Maintenance Operations](docs/screenshots/maintenance.png)
*Repair ticket logging, priority assignment, and technician management.*

---

### 8. Physical Audit & Compliance
![Physical Audit](docs/screenshots/audit.png)
*Structured physical inventory audits with discrepancy reporting.*

---

### 9. Executive Reports & Analytics
![Executive Reports](docs/screenshots/reports.png)
*Department-wise asset utilization metrics and analytical breakdowns.*

---

### 10. Notification Center
![Notifications Feed](docs/screenshots/notifications.png)
*Real-time alert center for overdue returns, approvals, and system updates.*

---

### 11. Camera QR Scanner
![QR Tag Scanner](docs/screenshots/scanner.png)
*Browser camera integration for scanning asset QR tags during physical audits.*

---

### 12. Tara AI Assistant
![Tara AI Assistant](docs/screenshots/tara-ai.png)
*Autonomous Agentic AI assistant executing tool queries for asset maintenance predictions.*

</div>

---

## 🏆 Odoo Hackathon 2026

AssetFlow was developed collaboratively for **Odoo Hackathon 2026**.

The project demonstrates how modern full-stack technologies (Next.js 16, React 19, TypeScript) combined with NoSQL database architectures (MongoDB Atlas) and Agentic AI tool calling can digitize traditional enterprise resource management operations.

---

## Deployment

AssetFlow is ready for zero-configuration serverless deployment on Vercel:

1. **Push Code**: Push the repository to GitHub.
2. **Connect Vercel**: Import the project into the [Vercel Dashboard](https://vercel.com).
3. **Configure Environment Variables**: Add `MONGODB_URI`, `DB_NAME`, and `OPENROUTER_API_KEY` in Project Settings.
4. **Deploy**: Click Deploy to launch the Next.js App Router application.

---

## Code Quality & Engineering Practices

- **Strict TypeScript Typing**: Interfaces defined for database models, client-server DTOs, and component props.
- **Decoupled System Design**: Clean layer separation between presentation (`app/dashboard`), API handlers (`app/api`), models (`models/`), and utilities (`lib/`).
- **Query Optimization**: Indexed MongoDB query fields (`assetTag`, `serialNumber`, `email`) and lean query projections.
- **Responsive Theme Design System**: Built with Tailwind CSS 4, Framer Motion animations, and dark/light theme switching.

---

## Future Improvements

- **Automated Barcode Printing**: PDF label sheet generator for physical asset tagging.
- **Native Mobile Companion**: React Native app for offline warehouse scanning.
- **Omnichannel Notifications**: Twilio SMS and SendGrid email alerts for overdue returns.
- **Enterprise SSO**: OAuth2, SAML, and fine-grained Role-Based Access Control (RBAC).

---

## License

This project is licensed under the educational / open-source MIT License.

---

## Acknowledgements

- **Odoo Hackathon 2026 Organizers & Mentors**
- **Collaborative Hackathon Team Members**
- **Open-Source Maintainers**: Next.js, React, Tailwind CSS, Framer Motion, Mongoose, and Lucide Icons.

<div align="center">

**[⬆ Back to Top](#-assetflow--enterprise-asset--resource-management-system)**

</div>
