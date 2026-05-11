<div align="center">

<h1>🏦 Finance Backend System</h1>

<p><em>A production-grade financial management backend built on a layered architecture — featuring JWT authentication, role-based access control, analytics aggregation, and secure API workflows.</em></p>

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Helmet](https://img.shields.io/badge/Security-Helmet.js-blue?style=flat-square)](https://helmetjs.github.io/)
[![Render](https://img.shields.io/badge/Deployed-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)

<br/>

[**GitHub Repository**](https://github.com/Nikhilseelam1/FInance-Backend-Project) · [**API Docs**](#-api-endpoints) · [**Setup Guide**](#-local-development-setup)

</div>

---

## 📌 Overview

This is a **production-style financial management backend** designed to securely handle transactions, enforce role-based authorization, and deliver analytics aggregations across user-scoped financial data.

The system is built around three core engineering pillars:

1. **Secure authentication** — JWT access/refresh token architecture with stateless session handling
2. **Fine-grained authorization** — Role-Based Access Control (RBAC) with Admin, Analyst, and Viewer permission tiers
3. **Analytics-ready data layer** — MongoDB aggregation pipelines for financial summaries, transaction reporting, and dashboard feeds

This is not a simple CRUD service. Every layer — from repository to controller — is deliberately separated to enable independent testability, future microservice extraction, and team-scale maintainability.

> **Engineering Focus:** Layered architecture · JWT auth + refresh rotation · RBAC middleware · MongoDB aggregation · Secure API design

---

## 🏛️ Architecture Overview

```
                     ┌────────────────────────────────────────┐
                     │          Client / API Consumer          │
                     └──────────────────┬─────────────────────┘
                                        │ HTTPS
                     ┌──────────────────▼─────────────────────┐
                     │            Express.js API Server         │
                     │                                          │
                     │  ┌──────────┐   ┌─────────────────────┐ │
                     │  │  Router  │   │     Middlewares      │ │
                     │  │ (Routes) │   │  Auth · RBAC · Val  │ │
                     │  └────┬─────┘   └─────────────────────┘ │
                     └───────┼────────────────────────────────┘
                             │
             ┌───────────────┼──────────────────┐
             │               │                  │
   ┌──────────▼──────┐  ┌────▼──────┐  ┌────────▼──────────┐
   │   Controllers   │  │  Services │  │    Repositories    │
   │  (HTTP Adapter) │  │ (Biz Logic│  │  (DB Access Layer) │
   └─────────────────┘  └────┬──────┘  └────────┬──────────┘
                             │                  │
                     ┌───────▼──────────────────▼──────┐
                     │           MongoDB                 │
                     │   Users · Transactions · Roles   │
                     └──────────────────────────────────┘
```

### Layered Architecture Explained

```
src/
├── config/            → Environment bootstrap, DB connection, constants
├── models/            → Mongoose schemas (User, Transaction, Role)
├── repositories/      → DB query abstraction; business logic never touches Mongoose directly
├── services/          → Pure business logic; orchestrates repositories
├── controllers/       → HTTP adapter; maps request → service → response
├── routes/            → Express routers; wires controllers to URL paths + middleware
├── middlewares/       → Auth guard, RBAC enforcement, error handler, request logger
├── validators/        → Joi/Zod schemas; validate all incoming request bodies
├── utils/             → Response wrappers, date helpers, token utilities
└── logging/           → Structured logging (Winston)
```

| Layer | Engineering Rationale |
|---|---|
| **Config** | Centralizes all environment-dependent initialization. Zero config leakage into business logic. |
| **Model** | Schema definitions with MongoDB indexes on `userId`, `type`, `createdAt` for efficient aggregation. |
| **Repository** | Isolates all Mongoose calls. Enables DB migration or mocking in tests without touching services. |
| **Service** | Stateless business logic. All financial rules, validation orchestration, and analytics live here. |
| **Controller** | Thin HTTP shim. Deserializes request body, delegates to service, serializes response. No logic. |
| **Middleware** | Enforces cross-cutting concerns (auth, RBAC, validation) before route handlers execute. |
| **Validator** | Schema-first input validation. Malformed data never reaches the service layer. |

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js 22.x | Non-blocking I/O, event-driven architecture |
| **Framework** | Express.js 5.x | Routing, middleware pipeline |
| **Database** | MongoDB 7.x | Document storage + aggregation pipelines |
| **Auth** | JWT (Access + Refresh) | Stateless authentication, token rotation |
| **Authorization** | Custom RBAC Middleware | Role-based permission enforcement |
| **Validation** | Joi / Zod | Schema-based request body validation |
| **Security** | Helmet.js | HTTP security headers |
| **CORS** | cors package | Origin whitelisting |
| **Password Hashing** | bcrypt | Salted password storage |
| **Logging** | Winston | Structured JSON logging |
| **Deployment** | Render | Cloud PaaS, zero-downtime deploys |

---

## ✨ Features

- 🔐 **JWT Authentication** — Access + refresh token flow with stateless session handling
- 🔄 **Refresh Token Rotation** — Secure token renewal without re-login
- 🛡️ **Role-Based Access Control** — Admin, Analyst, Viewer permission tiers at middleware level
- 💰 **Financial Transaction Management** — Create, read, filter, and categorize transactions
- 📊 **Analytics Aggregation** — MongoDB pipelines for income/expense summaries and trend reporting
- ✅ **Schema Validation** — All inputs validated via Joi/Zod before reaching business logic
- 🔒 **Security Headers** — Helmet.js for XSS, clickjacking, and MIME-sniffing protection
- 🏗️ **Layered Architecture** — Repository → Service → Controller separation
- 📁 **Modular Codebase** — Feature-scoped modules, independently testable and extensible
- 🚀 **Render Deployment** — Production-ready cloud deployment with environment isolation

---

## 🔐 Authentication & Authorization

### JWT Token Architecture

```
POST /api/auth/login
        │
        ▼
  Validate credentials (bcrypt compare)
        │
        ▼
  Issue Access Token  (15min expiry)   → returned in response body
  Issue Refresh Token (7d expiry)      → stored in HTTP-only cookie
        │
On protected route:
        │
        ▼
┌───────────────────────────┐
│   Auth Middleware          │
│   Extract Bearer token     │
│   Verify JWT signature     │
│   Attach req.user payload  │
└────────────┬──────────────┘
             │
             ▼
        Route Handler

On Access Token Expiry:
        │
        ▼
  POST /api/auth/refresh
  → Reads refresh token from HTTP-only cookie
  → Validates + rotates: old token invalidated, new pair issued
```

**Security properties:**
- Short-lived access tokens limit exposure window
- Refresh token rotation invalidates previous tokens on each cycle
- HTTP-only cookie transport makes refresh tokens inaccessible to JavaScript
- `bcrypt` with salt rounds prevents rainbow table attacks on stored passwords

---

## 🛡️ Role-Based Access Control

### Role Hierarchy

| Role | Permissions |
|---|---|
| **Admin** | Full access — manage users, view all transactions, access analytics, modify records |
| **Analyst** | Read financial records, access analytics and aggregation reports |
| **Viewer** | Read-only access to their own transactions; no analytics or admin routes |

### RBAC Middleware Flow

```
Incoming Request
      │
      ▼
[1] Auth Middleware → verify JWT → attach req.user (id, role)
      │
      ▼
[2] RBAC Middleware → check req.user.role against allowed roles[]
      │
      ├── Role ALLOWED → pass to route handler
      │
      └── Role DENIED  → 403 Forbidden
```

**Implementation pattern:**

```javascript
// Composable RBAC middleware factory
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Access denied." });
  }
  next();
};

// Usage on route level
router.get(
  "/api/analytics/summary",
  authenticate,
  authorize("admin", "analyst"),
  analyticsController.getSummary
);
```

This pattern keeps authorization logic **declarative at the route layer** — no permission checks inside service or controller code.

---

## 💰 Financial Data Processing

### Transaction Model Design

```javascript
// Core transaction schema
{
  userId:      ObjectId,     // owner reference
  type:        "income" | "expense",
  category:    String,       // e.g., "salary", "rent", "food"
  amount:      Number,       // stored in base currency units
  description: String,
  date:        Date,
  createdAt:   Date
}

// Indexes for aggregation performance
{ userId: 1, date: -1 }     // user timeline queries
{ userId: 1, type: 1 }      // income/expense split
{ userId: 1, category: 1 }  // category breakdown
```

### Analytics Aggregation Pipeline

Financial summary reports are powered by MongoDB aggregation pipelines, avoiding expensive in-memory computation at the application layer:

```javascript
// Monthly income vs expense summary
db.transactions.aggregate([
  { $match: { userId: ObjectId(userId), date: { $gte: startDate, $lte: endDate } } },
  {
    $group: {
      _id: { month: { $month: "$date" }, type: "$type" },
      total: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  },
  { $sort: { "_id.month": 1 } }
]);
```

This pushes aggregation computation to MongoDB's native engine — significantly more efficient than fetching all records and reducing at the Node.js layer.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | — | Register new user |
| `POST` | `/api/auth/login` | ❌ | — | Login, receive JWT tokens |
| `POST` | `/api/auth/refresh` | 🍪 Cookie | — | Rotate refresh token |
| `POST` | `/api/auth/logout` | ✅ JWT | Any | Invalidate session |

### Transactions

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/transactions` | ✅ | Any | Create a new transaction |
| `GET` | `/api/transactions` | ✅ | Any | List own transactions (paginated, filterable) |
| `GET` | `/api/transactions/:id` | ✅ | Any | Get a single transaction |
| `PUT` | `/api/transactions/:id` | ✅ | Any | Update a transaction |
| `DELETE` | `/api/transactions/:id` | ✅ | Admin | Delete a transaction |

### Analytics

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/analytics/summary` | ✅ | Admin, Analyst | Income vs expense summary |
| `GET` | `/api/analytics/monthly` | ✅ | Admin, Analyst | Monthly trend report |
| `GET` | `/api/analytics/categories` | ✅ | Admin, Analyst | Spending by category |

### User Management (Admin Only)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/users` | ✅ | Admin | List all users |
| `GET` | `/api/users/:id` | ✅ | Admin | Get user details |
| `PATCH` | `/api/users/:id/role` | ✅ | Admin | Update user role |
| `DELETE` | `/api/users/:id` | ✅ | Admin | Delete user account |

---

### Sample Request / Response

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Nikhil Seelam",
  "email": "nikhil@example.com",
  "password": "SecurePass@123"
}
```
```json
HTTP/1.1 201 Created
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "id": "664f2a...",
    "name": "Nikhil Seelam",
    "email": "nikhil@example.com",
    "role": "viewer"
  }
}
```

**Create Transaction**
```http
POST /api/transactions
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "type": "expense",
  "category": "food",
  "amount": 850,
  "description": "Team lunch",
  "date": "2025-04-06"
}
```
```json
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "id": "abc123...",
    "type": "expense",
    "category": "food",
    "amount": 850,
    "description": "Team lunch",
    "date": "2025-04-06T00:00:00.000Z",
    "userId": "664f2a..."
  }
}
```

**Analytics Summary**
```json
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "period": "2025-04",
    "totalIncome": 85000,
    "totalExpense": 32400,
    "netBalance": 52600,
    "topCategories": [
      { "category": "salary", "total": 80000 },
      { "category": "rent",   "total": 15000 },
      { "category": "food",   "total": 8500  }
    ]
  }
}
```

---

## 📁 Folder Structure

```
finance-backend/
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB connection + Mongoose setup
│   ├── models/
│   │   ├── User.model.js            # User schema (name, email, passwordHash, role)
│   │   └── Transaction.model.js     # Transaction schema with compound indexes
│   ├── repositories/
│   │   ├── user.repository.js       # All User DB operations
│   │   └── transaction.repository.js
│   ├── services/
│   │   ├── auth.service.js          # Login, register, token issuance, refresh
│   │   ├── transaction.service.js   # Financial CRUD + validation logic
│   │   └── analytics.service.js    # Aggregation pipeline orchestration
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── transaction.controller.js
│   │   └── analytics.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── transaction.routes.js
│   │   ├── analytics.routes.js
│   │   └── user.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT verification → req.user
│   │   ├── rbac.middleware.js       # Role enforcement middleware factory
│   │   ├── error.middleware.js      # Centralized error handler
│   │   └── logger.middleware.js     # Request/response logging
│   ├── validators/
│   │   ├── auth.validator.js        # Register/login schema
│   │   └── transaction.validator.js # Transaction body schema
│   ├── utils/
│   │   ├── apiResponse.js           # Standardized success/error wrappers
│   │   ├── tokenUtils.js            # JWT sign/verify helpers
│   │   └── dateUtils.js
│   ├── logging/
│   │   └── logger.js               # Winston structured logger
│   └── app.js                      # Express app bootstrap + middleware stack
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Local Development Setup

### Prerequisites

- Node.js ≥ 18.x
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/Nikhilseelam1/FInance-Backend-Project.git
cd FInance-Backend-Project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
# Fill in your MongoDB URI and JWT secrets
```

### 4. Start the Server

```bash
npm run dev      # Development (nodemon)
npm start        # Production
```

Server starts at `http://localhost:3000`

---

## 🔧 Environment Variables

```env
# .env.example

# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/finance-db

# JWT
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_SALT_ROUNDS=12
COOKIE_SECRET=your_cookie_signing_secret

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://yourfrontend.com
```

---

## 🔒 Security Features

| Feature | Implementation | Threat Mitigated |
|---|---|---|
| **Password Hashing** | bcrypt (12 salt rounds) | Credential theft via DB dump |
| **JWT Short Expiry** | 15min access tokens | Token replay after leak |
| **Refresh Rotation** | Old token invalidated on rotation | Refresh token reuse |
| **HTTP-only Cookies** | Refresh token in cookie only | XSS-based token theft |
| **Security Headers** | Helmet.js | XSS, clickjacking, MIME sniffing |
| **CORS Whitelisting** | Allowed origin list | Cross-origin request forgery |
| **Input Validation** | Joi/Zod on all endpoints | Injection, malformed data |
| **RBAC Enforcement** | Middleware-level role checks | Privilege escalation |
| **Centralized Errors** | Global error handler | Stack trace leakage to clients |

---

## 🚀 Deployment

Deployed on **Render** as a Web Service:

| Concern | Solution |
|---|---|
| **Zero-downtime** | Render rolling restart on deploy |
| **Secrets** | Environment variables via Render dashboard (never in code) |
| **Database** | MongoDB Atlas (external managed cluster) |
| **Process management** | Render handles process supervision and restarts |

**Deploy steps:**
1. Push to `main` branch
2. Render auto-deploys via GitHub integration
3. Health check endpoint confirms server is live

---

## 📈 Scalability & Architecture Decisions

| Decision | Rationale |
|---|---|
| **Stateless JWT auth** | API servers carry no session state — horizontally scalable without sticky sessions |
| **Repository pattern** | DB layer is swappable (SQL, Redis, etc.) without touching business logic |
| **Service layer isolation** | Business rules in one place; testable without HTTP or DB |
| **MongoDB aggregation** | Native DB-side computation avoids N+1 fetches for analytics |
| **Schema validation at entry** | Malformed data caught before it reaches the service layer |
| **Compound indexes** | `{ userId, date }` and `{ userId, type }` indexes ensure O(log n) aggregation scans |
| **Modular routing** | Feature-scoped routers allow independent team ownership of each domain |

---

## 🔭 Future Improvements

- [ ] **Multi-currency support** — Store currency code + FX conversion rates per transaction
- [ ] **Budget alerts** — Threshold-based notifications when spending exceeds category limits
- [ ] **Audit logging** — Immutable append-only log of all admin actions
- [ ] **CSV/PDF export** — Generate downloadable financial reports per date range
- [ ] **Redis caching** — Cache frequently read analytics summaries with TTL invalidation
- [ ] **Pagination cursors** — Replace offset-based pagination with cursor-based for large datasets
- [ ] **OpenAPI spec** — Auto-generated Swagger docs from route definitions
- [ ] **Integration tests** — Supertest-based API test suite with in-memory MongoDB
- [ ] **Rate limiting** — Per-IP Redis sliding window on auth and write endpoints
- [ ] **Two-Factor Authentication** — TOTP-based 2FA for sensitive admin operations

---

## 📸 Screenshots

> _Coming soon — Postman collection, API response samples, and architecture diagrams._

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

## 👤 Author

**Nikhil Seelam**
B.Tech Computer Science & Engineering · RGUKT Ongole

[![GitHub](https://img.shields.io/badge/GitHub-Nikhilseelam1-181717?style=flat-square&logo=github)](https://github.com/Nikhilseelam1)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/nikhilseelam)

---

<div align="center">

*Engineered for correctness. Designed for scale. Built to last.*

</div>
