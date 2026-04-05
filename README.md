# Finance Data Processing and Access Control Backend

> A production-structured backend system for a finance dashboard supporting role-based access control, financial record management, and summary-level analytics.
> Built as part of the **Zorvyn FinTech Backend Developer Intern** assessment.

---

##  Overview

This project is a RESTful backend API that powers a **multi-role finance dashboard**. It enables different types of users — Admins, Analysts, and Viewers — to interact with financial data based on their assigned permissions.

The system is designed with a focus on:
- **Clean architecture** — module-based folder structure with clear separation of concerns
- **Security** — JWT authentication with role-based access control enforced at middleware level
- **Reliability** — global error handling, input validation, and soft delete support
- **Analytics** — MongoDB aggregation pipelines for real-time dashboard summaries

---

##  Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Node.js | Server-side JavaScript |
| Framework | Express.js | HTTP routing and middleware |
| Database | MongoDB Atlas | Cloud document database |
| ODM | Mongoose | Schema modeling and DB interaction |
| Authentication | JSON Web Tokens (JWT) | Stateless auth |
| Validation | Joi | Request body validation |
| Password Hashing | bcryptjs | Secure password storage |
| Environment | dotenv | Environment variable management |

---

##  Project Structure

```
finance-backend/
│
├── src/
│    ├── modules/
│    │    ├── auth/
│    │    │     ├── auth.controller.js
│    │    │     ├── auth.service.js
│    │    │     ├── auth.routes.js
│    │    │     └── auth.validator.js
│    │    ├── user/
│    │    │     ├── user.controller.js
│    │    │     ├── user.service.js
│    │    │     ├── user.routes.js
│    │    │     └── user.validator.js
│    │    ├── record/
│    │    │     ├── record.controller.js
│    │    │     ├── record.service.js
│    │    │     ├── record.routes.js
│    │    │     └── record.validator.js
│    │    └── dashboard/
│    │          ├── dashboard.controller.js
│    │          ├── dashboard.service.js
│    │          └── dashboard.routes.js
│    ├── models/
│    │    ├── User.js
│    │    └── FinancialRecord.js
│    ├── middleware/
│    │    ├── auth.middleware.js
│    │    ├── rbac.middleware.js
│    │    └── errorHandler.js
│    ├── config/
│    │    └── db.js
│    └── utils/
│         ├── ApiError.js
│         └── ApiResponse.js
│
├── .env.example
├── .gitignore
├── app.js
├── server.js
└── package.json
```

---

##  Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Nikhilseelam1/FInance-Backend-Project.git
cd FInance-Backend-Project

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env and fill in your actual values

# 4. Start development server
npm run dev

# 5. For production
npm start
```

---

##  Environment Variables

Create a `.env` file in the root directory with the following:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/finance-backend

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```

---

##  Authentication

This system uses **JWT (JSON Web Token)** based stateless authentication.

- On login or registration, a signed JWT token is returned
- All protected routes require this token in the `Authorization` header
- The token is verified in `auth.middleware.js` before any protected route is accessed
- Inactive users are blocked even with a valid token

```
Authorization: Bearer <your_jwt_token>
```

---

##  Roles and Permissions

The system supports three roles with clearly defined access levels:

| Action | Viewer | Analyst | Admin |
|---|---|---|---|
| Register / Login | ✅ | ✅ | ✅ |
| View financial records | ✅ | ✅ | ✅ |
| Create records | ❌ | ❌ | ✅ |
| Update records | ❌ | ❌ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
| Access dashboard analytics | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

##  API Endpoints

###  Auth Routes (Public)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

---

###  User Routes (Admin Only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get single user by ID |
| PATCH | `/api/users/:id/role` | Update user role |
| PATCH | `/api/users/:id/status` | Activate or deactivate user |
| DELETE | `/api/users/:id` | Permanently delete user |

---

###  Financial Record Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/records` | Admin | Create a new record |
| GET | `/api/records` | All roles | Get all records with filters |
| GET | `/api/records/:id` | All roles | Get single record |
| PATCH | `/api/records/:id` | Admin | Update a record |
| DELETE | `/api/records/:id` | Admin | Soft delete a record |

**Supported Query Parameters for GET `/api/records`:**

| Parameter | Type | Description |
|---|---|---|
| `type` | String | Filter by `income` or `expense` |
| `category` | String | Filter by category (case insensitive) |
| `startDate` | Date | Filter records from this date |
| `endDate` | Date | Filter records up to this date |
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Records per page (default: 10) |

---

###  Dashboard Routes (Analyst and Admin Only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/summary` | Total income, expenses, net balance |
| GET | `/api/dashboard/category-wise` | Totals grouped by category and type |
| GET | `/api/dashboard/trends` | Monthly income and expense trends |
| GET | `/api/dashboard/recent` | Most recent 10 transactions |

---

##  Request & Response Examples

### Register User

```json
POST /api/auth/register
{
  "name": "Nikhil Admin",
  "email": "nikhil@gmail.com",
  "password": "123456",
  "role": "admin"
}
```

```json
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "69ce55868353aa4a29c45775",
      "name": "Nikhil Admin",
      "email": "nikhil@gmail.com",
      "role": "admin",
      "status": "active"
    }
  },
  "success": true
}
```

---

### Create Financial Record

```json
POST /api/records
Authorization: Bearer <admin_token>

{
  "amount": 50000,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-01",
  "notes": "Monthly salary credit"
}
```

```json
{
  "statusCode": 201,
  "message": "Record created successfully",
  "data": {
    "_id": "69ce5c488353aa4a29c45779",
    "amount": 50000,
    "type": "income",
    "category": "Salary",
    "date": "2026-04-01T00:00:00.000Z",
    "notes": "Monthly salary credit",
    "isDeleted": false,
    "createdBy": "69ce55868353aa4a29c45775",
    "createdAt": "2026-04-02T12:08:40.119Z"
  },
  "success": true
}
```

---

### Dashboard Summary

```json
GET /api/dashboard/summary
Authorization: Bearer <analyst_or_admin_token>
```

```json
{
  "statusCode": 200,
  "message": "Summary fetched successfully",
  "data": {
    "income": 150000,
    "expenses": 45000,
    "netBalance": 105000
  },
  "success": true
}
```

### RBAC Denied Response

```json
{
  "success": false,
  "message": "Access denied. Required role: admin. Your role: viewer",
  "errors": []
}
```

---

##  Access Control Implementation

RBAC is implemented using a two-layer middleware approach:

**Layer 1 — `auth.middleware.js` (Authentication)**
- Extracts and verifies the JWT token from the `Authorization` header
- Fetches the user from the database and attaches to `req.user`
- Blocks requests from inactive users before they reach any route

**Layer 2 — `rbac.middleware.js` (Authorization)**
- A higher-order function `authorize(...roles)` that accepts allowed roles
- Checks `req.user.role` against the allowed roles for that specific route
- Returns a `403 Forbidden` response with a clear message if access is denied

```javascript
// Clean, reusable usage on any route
router.post("/records", protect, authorize("admin"), createRecord);
router.get("/dashboard/summary", protect, authorize("analyst", "admin"), getSummary);
router.get("/records", protect, authorize("viewer", "analyst", "admin"), getAll);
```

---

##  Data Models

### User Model

| Field | Type | Constraints | Description |
|---|---|---|---|
| name | String | Required, trimmed | Full name |
| email | String | Required, unique, lowercase | User email |
| password | String | Required, min 6 chars, hidden | Bcrypt hashed |
| role | Enum | admin, analyst, viewer | Access level |
| status | Enum | active, inactive | Account status |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

### FinancialRecord Model

| Field | Type | Constraints | Description |
|---|---|---|---|
| amount | Number | Required, min 0 | Transaction amount |
| type | Enum | income, expense | Transaction type |
| category | String | Required, trimmed | Category label |
| date | Date | Required | Transaction date |
| notes | String | Optional, max 200 | Additional notes |
| isDeleted | Boolean | Default false | Soft delete flag |
| createdBy | ObjectId | Ref: User | Who created it |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

##  Dashboard Aggregations

All dashboard endpoints use **MongoDB aggregation pipelines** for efficient data processing:

- **Summary** — `$group` by `type` field using `$sum` to compute total income, total expenses, and net balance
- **Category Wise** — `$group` by `category` and `type` with `$sum` and `$count`, sorted by total descending
- **Monthly Trends** — `$group` by `$year` and `$month` operators on the date field, limited to last 12 months
- **Recent Activity** — `find()` with `populate("createdBy")` sorted by `createdAt` descending, limited to 10

> **Note:** The `pre(/^find/)` soft delete hook on the model applies only to Mongoose `find` queries. All aggregation pipelines include an explicit `{ $match: { isDeleted: false } }` stage to ensure consistency.

---

##  Assumptions Made

1. **Role assignment at registration** — Users can self-assign a role during registration for easier testing. In a real production system, only admins would assign roles after account creation.
2. **Soft delete for records only** — Financial records are soft deleted to preserve audit history. Users are hard deleted since permanent removal of user data is the expected behavior.
3. **Single currency** — All amounts are assumed to be in the same currency. No multi-currency or conversion logic is implemented.
4. **No email verification** — Email verification was not implemented as it requires a third-party email service. In production this would be a mandatory step.
5. **Non-negative amounts** — Expenses are stored as positive values with `type: "expense"` rather than as negative numbers for cleaner data and aggregation logic.

---

##  Tradeoffs Considered

| Design Decision | Tradeoff |
|---|---|
| Module-based architecture over flat MVC | More files to manage but each feature is self-contained, scalable, and easy to onboard new developers |
| Soft delete via `pre(/^find/)` Mongoose hook | All find queries automatically exclude deleted records but aggregation pipelines need a manual `$match` stage |
| Joi validators in separate files | Slightly more files but controllers and services remain completely clean with no mixed concerns |
| JWT stateless auth over sessions | No server-side session storage required but tokens cannot be invalidated before expiry without a denylist |
| MongoDB over relational SQL | Flexible document schema and powerful native aggregation pipelines well-suited for analytics but no strict relational integrity |
| Service layer separate from controllers | Controllers stay thin (req/res only) and business logic is fully testable in isolation |

---

##  Design Decisions

These are the key intentional architectural choices made in this project:

- **Module-based folder structure** — Each feature module (auth, user, record, dashboard) owns its own routes, controller, service, and validator. This is inspired by NestJS architecture and scales well as the codebase grows.

- **Thin controllers, fat services** — Controllers only handle HTTP request/response. All business logic, DB calls, and error throwing live in services. This makes logic reusable and independently testable.

- **`ApiError` and `ApiResponse` utility classes** — Every success and error response follows a consistent structure across all endpoints. This makes the API predictable for any frontend or API consumer.

- **Global error handler as single source of truth** — All errors flow through one middleware (`errorHandler.js`) which handles Mongoose errors, JWT errors, custom ApiErrors, and unknown errors uniformly.

- **`authorize(...roles)` as a higher-order function** — Instead of writing role checks inside every controller, RBAC is enforced declaratively at the route level. This makes permissions visible, auditable, and easy to change.

- **Self-action protection in user service** — Admins cannot change their own role, deactivate their own account, or delete themselves. This prevents accidental administrative lockout.

---

##  Future Improvements

- [ ] Email verification on registration
- [ ] Token blacklisting for secure logout
- [ ] Rate limiting to prevent brute force attacks
- [ ] Full text search across records
- [ ] Unit and integration tests
- [ ] Swagger / OpenAPI documentation
- [ ] Multi-currency support with exchange rates
- [ ] Audit logs for all admin actions

---

##  Author

**Nikhil Seelam**
- GitHub: [Nikhilseelam1](https://github.com/Nikhilseelam1)
- Assessment: Zorvyn FinTech — Backend Developer Intern
