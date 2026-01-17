# SmartScan+ Admin Portal - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SmartScan+ Admin Portal                   │
│                      Fully Containerized Setup                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                     Docker Compose Network                        │
│                   (smartscan_network - bridge)                    │
│                                                                   │
│  ┌────────────────────────┐          ┌────────────────────────┐ │
│  │  Next.js Application   │          │  PostgreSQL Database   │ │
│  │  (Container)           │          │  (Container)           │ │
│  │                        │          │                        │ │
│  │  PORT: 3000            │─────────→│  PORT: 5432            │ │
│  │  ├─ /auth/login        │ Network  │  ├─ admins table       │ │
│  │  ├─ /dashboard         │ (TCP)    │  ├─ sessions table     │ │
│  │  ├─ /api/auth/login    │          │  └─ audit_logs table   │ │
│  │  └─ /api/*             │          │                        │ │
│  │                        │          │  Data Volume:          │ │
│  │  Volume: Hot Reload    │          │  postgres_data         │ │
│  │  (node_modules, .next) │          │  (Persistent)          │ │
│  └────────────────────────┘          └────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
         ↓                                          ↓
    Host Network                               Host Storage
  (localhost:3000)                          (docker volumes)
```

---

## Application Flow Diagram

```
User Browser
    │
    ↓
http://localhost:3000
    │
    ├──→ [Next.js Router]
    │
    ├─ /auth/login
    │   │
    │   ├──→ [Login Page Component]
    │   │   ├─ Form Validation
    │   │   ├─ Password Input
    │   │   └─ Submit Button
    │   │
    │   └──→ POST /api/auth/login
    │       │
    │       ├──→ [Middleware Check]
    │       │   └─ Validate Email & Password
    │       │
    │       ├──→ [Database Query]
    │       │   └─ SELECT * FROM admins
    │       │
    │       └──→ Response: { token, user }
    │           │
    │           ├─ Store in localStorage
    │           └─ Redirect to /dashboard
    │
    ├─ /dashboard
    │   │
    │   ├──→ [Middleware Check]
    │   │   └─ Verify authToken
    │   │
    │   ├──→ [Dashboard Component]
    │   │   ├─ Display User Info
    │   │   ├─ Show Metrics
    │   │   └─ Render Stats
    │   │
    │   └──→ [Logout Handler]
    │       ├─ Clear localStorage
    │       └─ Redirect to /login
    │
    └─ Protected Routes
        └─ [Middleware Protection]
            ├─ Check authToken
            ├─ If valid → Allow access
            └─ If invalid → Redirect to /login
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                      │
│                    (smartscan_db)                           │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐│
│  │ Table: admins (Admin Users)                            ││
│  ├──────────────────────────────────────────────────────┤│
│  │ id (PK)              SERIAL PRIMARY KEY               ││
│  │ email (UNIQUE)       VARCHAR(255)                     ││
│  │ password_hash        VARCHAR(255)                     ││
│  │ full_name            VARCHAR(255)                     ││
│  │ role                 VARCHAR(50) DEFAULT 'admin'      ││
│  │ is_active            BOOLEAN DEFAULT TRUE             ││
│  │ last_login           TIMESTAMP                        ││
│  │ created_at           TIMESTAMP DEFAULT NOW            ││
│  │ updated_at           TIMESTAMP DEFAULT NOW            ││
│  │ ┌─ Index: idx_admins_email                           ││
│  └────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌────────────────────────────────────────────────────────┐│
│  │ Table: sessions (User Sessions)                        ││
│  ├──────────────────────────────────────────────────────┤│
│  │ id (PK)              SERIAL PRIMARY KEY               ││
│  │ admin_id (FK)        INTEGER → admins(id)            ││
│  │ token                VARCHAR(500) UNIQUE              ││
│  │ expires_at           TIMESTAMP                        ││
│  │ created_at           TIMESTAMP DEFAULT NOW            ││
│  │ ┌─ Index: idx_sessions_admin_id                      ││
│  │ ├─ Index: idx_sessions_token                         ││
│  └────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌────────────────────────────────────────────────────────┐│
│  │ Table: audit_logs (Activity Tracking)                 ││
│  ├──────────────────────────────────────────────────────┤│
│  │ id (PK)              SERIAL PRIMARY KEY               ││
│  │ admin_id (FK)        INTEGER → admins(id)            ││
│  │ action               VARCHAR(255)                     ││
│  │ details              TEXT                             ││
│  │ ip_address           VARCHAR(45)                      ││
│  │ created_at           TIMESTAMP DEFAULT NOW            ││
│  │ ┌─ Index: idx_audit_logs_admin_id                    ││
│  │ ├─ Index: idx_audit_logs_created_at                  ││
│  └────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Structure

```
App
├── Layout (app/layout.tsx)
│   ├── Header (Global Navigation)
│   ├── Main Content
│   └── Footer
│
├── Auth Routes
│   └── /auth/login (app/auth/login/page.tsx)
│       ├── LoginForm Component
│       │   ├── Email Input
│       │   ├── Password Input
│       │   ├── Show/Hide Toggle
│       │   ├── Forgot Password Link
│       │   ├── Remember Me Checkbox
│       │   └── Social Login Buttons
│       └── Submit Handler
│           └── POST /api/auth/login
│
├── API Routes
│   └── /api/auth
│       └── /login (app/api/auth/login/route.ts)
│           ├── Validate Input
│           ├── Check Credentials
│           ├── Generate Token
│           └── Return Response
│
├── Protected Routes
│   └── /dashboard (app/dashboard/page.tsx)
│       ├── Header
│       │   ├── App Logo
│       │   ├── Title
│       │   └── User Menu
│       │       ├── User Info
│       │       └── Logout Button
│       └── Main Content
│           ├── Welcome Section
│           └── Stats Cards
│               ├── Total Users
│               ├── Scans Today
│               ├── Accuracy Rate
│               └── Active Sessions
│
├── Middleware (middleware.ts)
│   ├── Route Protection
│   ├── Auth Check
│   ├── Token Validation
│   └── Redirect Logic
│
└── Utilities
    ├── API Client
    ├── Auth Service
    └── Storage Management
```

---

## Docker Build Process

```
Development
    │
    ├─ package.json
    │  └─ npm install
    │      └─ node_modules/
    │
    ├─ Dockerfile (Multi-stage)
    │  │
    │  ├─ STAGE 1: Builder
    │  │  ├─ FROM node:18-alpine
    │  │  ├─ COPY package*.json
    │  │  ├─ RUN npm ci
    │  │  ├─ COPY source code
    │  │  └─ RUN npm run build
    │  │      └─ .next/ (build output)
    │  │
    │  └─ STAGE 2: Production
    │     ├─ FROM node:18-alpine (fresh image)
    │     ├─ COPY --from=builder (smaller image)
    │     │  ├─ node_modules/
    │     │  ├─ .next/
    │     │  └─ package*.json
    │     ├─ EXPOSE 3000
    │     ├─ HEALTHCHECK
    │     └─ CMD npm start
    │
    └─ Docker Image
       └─ smartscan_admin_web:latest
           ├─ ~450MB (optimized)
           └─ Ready for deployment
```

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│            Host Machine (localhost)                       │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Docker Engine                              │ │
│  │                                                    │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │   Container 1: Next.js App                  │ │ │
│  │  │                                             │ │ │
│  │  │   ├─ Node.js Runtime                        │ │ │
│  │  │   ├─ Next.js Framework                      │ │ │
│  │  │   ├─ Application Code                       │ │ │
│  │  │   └─ Port: 3000 (mapped to host)           │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  │           ↓ (TCP Network)                         │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │   Container 2: PostgreSQL Database          │ │ │
│  │  │                                             │ │ │
│  │  │   ├─ PostgreSQL 16                          │ │ │
│  │  │   ├─ Database: smartscan_db                 │ │ │
│  │  │   ├─ Port: 5432 (internal, optional map)   │ │ │
│  │  │   └─ Volume: postgres_data (persistent)    │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  │                                                    │ │
│  │  Network Bridge (smartscan_network)               │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
         ↓ (Host ports)        ↓ (Data volumes)
    localhost:3000         disk storage
    Browser Access         Data Persistence
```

---

## User Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                  Authentication Flow                         │
└──────────────────────────────────────────────────────────────┘

1. USER VISITS LOGIN PAGE
   └─ http://localhost:3000/auth/login
      │
      └─→ [Middleware Check]
          ├─ Is authToken valid?
          ├─ Yes → Redirect to /dashboard
          └─ No → Show login page

2. USER ENTERS CREDENTIALS
   ├─ Email: admin@smartscan.com
   ├─ Password: smartscan123
   └─ Clicks "Sign in"

3. FORM VALIDATION
   ├─ Check email format
   ├─ Check password length
   └─ Both valid? → Continue

4. SUBMIT TO API
   ├─ POST /api/auth/login
   ├─ Body: { email, password }
   └─ Headers: { Content-Type: application/json }

5. SERVER VALIDATION
   ├─ Receive request
   ├─ Validate input
   ├─ Query database:
   │  └─ SELECT * FROM admins WHERE email = ?
   ├─ Check if user exists
   ├─ Compare password (bcrypt in production)
   └─ If valid → Generate token

6. RESPONSE
   ├─ Status: 200 OK
   ├─ Body:
   │  ├─ success: true
   │  ├─ token: "jwt_token_here"
   │  └─ user: { id, email, fullName, role }
   └─ Or error if invalid

7. CLIENT HANDLES RESPONSE
   ├─ Success?
   │  ├─ Store token in localStorage
   │  ├─ Save user info
   │  └─ Redirect to /dashboard
   └─ Error?
      └─ Display error message

8. DASHBOARD ACCESS
   ├─ Middleware checks token
   ├─ Token valid?
   │  ├─ Yes → Load dashboard
   │  └─ No → Redirect to /login
   └─ Display user info & metrics

9. LOGOUT
   ├─ Click logout button
   ├─ Clear localStorage
   ├─ Clear session
   └─ Redirect to /login
```

---

## File Organization

```
admin-web-application/
│
├─ 📋 Configuration
│  ├─ Dockerfile
│  ├─ docker-compose.yml
│  ├─ .dockerignore
│  ├─ .env.local
│  ├─ .env.example
│  ├─ next.config.ts
│  ├─ tsconfig.json
│  ├─ package.json
│  └─ middleware.ts
│
├─ 📚 Documentation
│  ├─ INDEX.md
│  ├─ QUICKSTART.md
│  ├─ DOCKER_SETUP.md
│  ├─ IMPLEMENTATION_SUMMARY.md
│  ├─ SETUP_COMPLETE.md
│  └─ ARCHITECTURE.md (this file)
│
├─ 🗄️ Database
│  └─ init.sql
│
├─ 🛠️ Scripts
│  ├─ start.bat
│  └─ Makefile
│
├─ 🎨 Source Code
│  └─ app/
│     ├─ layout.tsx
│     ├─ page.tsx
│     ├─ globals.css
│     ├─ auth/
│     │  └─ login/
│     │     └─ page.tsx ⭐
│     ├─ api/
│     │  └─ auth/
│     │     └─ login/
│     │        └─ route.ts ⭐
│     └─ dashboard/
│        └─ page.tsx ⭐
│
└─ 📦 Generated
   ├─ node_modules/ (dependencies)
   ├─ .next/ (build output)
   └─ public/ (static files)

⭐ = New files created for this project
```

---

## Request/Response Flow

```
BROWSER REQUEST
    │
    ├─ GET /auth/login
    │  │
    │  └─→ Next.js Server
    │     │
    │     ├─ Check middleware
    │     ├─ Render login page
    │     └─ Return HTML/CSS/JS
    │
    ├─ POST /api/auth/login
    │  │
    │  └─→ Node.js API Route
    │     │
    │     ├─ Parse JSON body
    │     ├─ Validate data
    │     ├─ Query database
    │     │  └─ PostgreSQL
    │     ├─ Generate token
    │     └─ Return JSON response
    │
    └─ GET /dashboard
       │
       └─→ Next.js Server
          │
          ├─ Check middleware
          ├─ Verify auth token
          ├─ Fetch user data
          ├─ Render dashboard
          └─ Return HTML/CSS/JS
```

---

## Technology Stack Layers

```
┌─────────────────────────────────────────────────┐
│           Browser / Client Side                 │
│  (HTML, CSS, JavaScript, React Components)      │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│        Next.js Framework / Middleware            │
│  (Routing, SSR, API Routes, Auth Middleware)    │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          Node.js Runtime / Backend              │
│  (API Handlers, Business Logic, HTTP Server)    │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│      Database Layer / PostgreSQL                │
│  (Tables, Queries, Data Persistence)            │
└─────────────────────────────────────────────────┘
```

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Status**: Complete ✅
