<div align="center">

# 📋 Task Management System

A **production-grade, full-stack Task Tracker** with JWT authentication, real-time analytics, advanced filtering, and a polished dark/light mode UI.  
Built with **React · TypeScript · Node.js · Express · MongoDB**.

<!-- Replace with actual screenshots after deployment -->
<!-- ![Dashboard Preview](docs/screenshots/dashboard.png) -->

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Design Decisions](#-design-decisions)
- [Security](#-security)
- [Testing](#-testing)
- [Project Structure](#-project-structure)

---

## ✨ Features

### Core
- **User Authentication** — Register, login, logout with JWT in httpOnly cookies
- **Task CRUD** — Create, read, update, and delete tasks with rich metadata
- **Status Management** — Quick-toggle between `Todo`, `In Progress`, and `Done`
- **Priority Levels** — Categorize tasks as `Low`, `Medium`, or `High`
- **Due Dates** — Set deadlines with overdue highlighting

### Advanced
- **Full-Text Search** — MongoDB text-indexed search across titles & descriptions
- **Multi-Filter** — Simultaneous filtering by status, priority, and search query
- **Sorting** — Sort by due date, creation date, priority, or title (asc/desc)
- **Pagination** — Server-side pagination with page metadata
- **Analytics Dashboard** — Aggregation-pipeline-powered stats: totals, completion %, status & priority breakdowns with Recharts visualizations

### UX
- **🌙 Dark / ☀️ Light Mode** — System-aware with manual toggle, persisted in localStorage
- **Optimistic Updates** — Instant UI feedback on status toggles and deletes (rollback on error)
- **Toast Notifications** — Contextual success/error toasts via Sonner
- **Responsive Design** — Mobile-first layout with collapsible sidebar
- **Skeleton Loading** — Shimmer placeholders while data loads
- **Debounced Search** — 300ms debounce to minimize API calls
- **Keyboard Shortcuts** — Escape to close dialogs, Enter to submit forms

---

## 🛠 Tech Stack

| Layer            | Technology                                                  |
| ---------------- | ----------------------------------------------------------- |
| **Frontend**     | React 19, Vite 8, TypeScript 5.9                            |
| **Styling**      | Tailwind CSS 3, Shadcn UI (Radix primitives)                |
| **State**        | TanStack React Query 5 (server), Zustand 5 (client)        |
| **Routing**      | React Router 7                                              |
| **Charts**       | Recharts 3                                                  |
| **Forms**        | React Hook Form 7 + Zod 4                                   |
| **Backend**      | Node.js, Express 5, TypeScript 6                            |
| **Database**     | MongoDB (Mongoose 9 ODM)                                    |
| **Auth**         | JWT (httpOnly cookies) + bcryptjs                           |
| **Validation**   | Zod (shared schemas across full stack)                      |
| **Security**     | Helmet, express-rate-limit, CORS, HPP, mongo-sanitize       |
| **Testing**      | Jest 30 + Supertest 7 + mongodb-memory-server               |
| **Deployment**   | Backend → Render, Frontend → Vercel                         |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (React 19)                 │
│  ┌───────────┐  ┌───────────┐  ┌─────────────────┐  │
│  │ Auth Pages │  │ Dashboard │  │   Analytics     │  │
│  │Login/Signup│  │ Task CRUD │  │ Charts + Stats  │  │
│  └───────────┘  └───────────┘  └─────────────────┘  │
│       Axios Instance (withCredentials, interceptors) │
└────────────────────┬────────────────────────────────┘
                     │  REST API (JSON)
┌────────────────────▼────────────────────────────────┐
│                Backend (Express 5)                    │
│  ┌─────────┐ ┌───────────┐ ┌──────────┐ ┌────────┐  │
│  │ Auth MW │ │Task Routes│ │Analytics │ │Error MW│  │
│  │ (JWT)   │ │CRUD+Query │ │Aggregation│ │(Global)│  │
│  └─────────┘ └───────────┘ └──────────┘ └────────┘  │
│    Controller → Service → Model (Layered Arch)       │
│          Mongoose ODM (Indexed Queries)               │
└────────────────────┬────────────────────────────────┘
                     │
          ┌──────────▼────────────┐
          │     MongoDB Atlas     │
          │   Users + Tasks       │
          │   Compound Indexes    │
          │   Text Search Index   │
          └───────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

| Tool       | Version |
| ---------- | ------- |
| **Node.js** | ≥ 18   |
| **npm**     | ≥ 9    |
| **MongoDB** | Atlas (free tier) or local |

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/Task-Management-System.git
cd Task-Management-System
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values (see [Environment Variables](#-environment-variables)).

Start the dev server:

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

### 4. Open in Browser

Navigate to **http://localhost:5173** — register a new account and start managing tasks!

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable       | Description                                   | Example                                                                        |
| -------------- | --------------------------------------------- | ------------------------------------------------------------------------------ |
| `NODE_ENV`     | Environment mode                              | `development`                                                                  |
| `PORT`         | Server port                                   | `5000`                                                                         |
| `MONGO_URI`    | MongoDB connection string                     | `mongodb+srv://user:pass@cluster.mongodb.net/taskdb?retryWrites=true&w=majority` |
| `JWT_SECRET`   | JWT signing key (min 32 chars)                | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRE`   | Token expiry                                  | `7d`                                                                           |
| `CLIENT_URL`   | Frontend URL (for CORS)                       | `http://localhost:5173`                                                        |

> [!TIP]
> See `server/.env.example` for a ready-to-copy template with all variables.

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint              | Description                | Auth Required |
| ------ | --------------------- | -------------------------- | :-----------: |
| `POST` | `/api/auth/register`  | Register a new user        |      ❌       |
| `POST` | `/api/auth/login`     | Login (sets httpOnly cookie) |      ❌       |
| `POST` | `/api/auth/logout`    | Logout (clears cookie)     |      ✅       |
| `GET`  | `/api/auth/me`        | Get current user profile   |      ✅       |

### Tasks

| Method   | Endpoint                   | Description                                       | Auth Required |
| -------- | -------------------------- | ------------------------------------------------- | :-----------: |
| `GET`    | `/api/tasks`               | List tasks (filter, search, sort, paginate)        |      ✅       |
| `POST`   | `/api/tasks`               | Create a new task                                  |      ✅       |
| `GET`    | `/api/tasks/:id`           | Get a single task by ID                            |      ✅       |
| `PUT`    | `/api/tasks/:id`           | Update a task                                      |      ✅       |
| `PATCH`  | `/api/tasks/:id/status`    | Quick-toggle task status                           |      ✅       |
| `DELETE` | `/api/tasks/:id`           | Delete a task                                      |      ✅       |

#### Query Parameters for `GET /api/tasks`

```
?status=Done&priority=High&search=meeting&sortBy=dueDate&order=asc&page=1&limit=10
```

| Parameter  | Type     | Options                                              | Default        |
| ---------- | -------- | ---------------------------------------------------- | -------------- |
| `status`   | `string` | `Todo`, `In Progress`, `Done`                        | All            |
| `priority` | `string` | `Low`, `Medium`, `High`                              | All            |
| `search`   | `string` | Full-text search on title & description              | —              |
| `sortBy`   | `string` | `dueDate`, `createdAt`, `priority`, `title`          | `createdAt`    |
| `order`    | `string` | `asc`, `desc`                                        | `desc`         |
| `page`     | `number` | Page number (1-based)                                | `1`            |
| `limit`    | `number` | Items per page                                       | `10`           |

### Analytics

| Method | Endpoint           | Description                          | Auth Required |
| ------ | ------------------ | ------------------------------------ | :-----------: |
| `GET`  | `/api/analytics`   | Aggregated task insights & stats     |      ✅       |

**Response includes:**
- Total / completed / pending task counts
- Completion percentage
- Per-status breakdown (Todo, In Progress, Done)
- Per-priority breakdown (Low, Medium, High)

---

## 🗃 Database Schema

### User

```javascript
{
  name:      { type: String, required: true, trim: true, maxlength: 50 },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6, select: false },
  createdAt: { type: Date, default: Date.now }
}
```

### Task

```javascript
{
  user:        { type: ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500 },
  status:      { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  priority:    { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate:     { type: Date },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now }
}
```

### Indexes

```javascript
// Compound indexes for filtered queries (O(log n) instead of collection scans)
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

// Text index for full-text search
taskSchema.index({ title: 'text', description: 'text' });
```

---

## 💡 Design Decisions

### 1. React Query over `useEffect` for Data Fetching
Using `@tanstack/react-query` instead of manual `useEffect` + `useState` patterns provides automatic caching, background refetching, stale data management, retry logic, and built-in loading/error states. This eliminates an entire category of bugs (race conditions, stale closures) and enables optimistic updates for a snappier UX.

### 2. Shadcn UI + Tailwind CSS
Shadcn provides accessible, unstyled Radix-based primitives that we fully control with Tailwind. Unlike opinionated component libraries (MUI, Ant Design), this avoids the "template" look and gives complete design ownership — the app feels custom-built, not off-the-shelf.

### 3. MongoDB Aggregation Pipeline for Analytics
Analytics are computed server-side using MongoDB's `$match`, `$group`, and `$facet` stages — not by fetching all tasks to the client and counting in JavaScript. This approach scales to thousands of tasks without performance degradation and reduces network payload.

### 4. Compound Indexes on Task Collection
Strategic compound indexes (`user + status`, `user + priority`, `user + dueDate`) ensure filtered queries execute in O(log n) via index scans instead of costly full collection scans. The text index on `title` and `description` powers full-text search without a separate search engine.

### 5. httpOnly Cookies over localStorage for JWT
Storing JWTs in `httpOnly` cookies makes them inaccessible to JavaScript, providing defense-in-depth against XSS attacks. Unlike localStorage-based token storage, a compromised script cannot exfiltrate the token. Combined with `SameSite` and `Secure` flags, this is the industry-standard approach for session management.

### 6. TypeScript End-to-End
Both client and server use TypeScript with strict configurations. Shared Zod schemas enforce validation consistency across the stack — the same schema validates in the browser form, the Axios request, and the Express endpoint, eliminating an entire class of API contract bugs.

### 7. Layered Architecture (Controller → Service → Model)
Separating concerns into distinct layers makes the codebase testable, maintainable, and extensible:
- **Controllers** handle HTTP request/response
- **Services** contain business logic
- **Models** define data structure and database interaction

This allows unit-testing services in isolation and swapping persistence layers without rewriting business logic.

---

## 🔒 Security

| Measure                     | Implementation                                                      |
| --------------------------- | ------------------------------------------------------------------- |
| **Password Hashing**        | bcryptjs with 12 salt rounds                                        |
| **JWT httpOnly Cookies**    | Token inaccessible to JS — prevents XSS token theft                 |
| **Helmet**                  | Secure HTTP response headers (CSP, HSTS, X-Frame-Options, etc.)     |
| **Rate Limiting**           | Auth routes: 10 req/15min · General API: 100 req/15min              |
| **Input Sanitization**      | `express-mongo-sanitize` prevents NoSQL injection (`$gt`, `$ne`)    |
| **CORS**                    | Strict origin whitelist — only the configured frontend URL           |
| **HPP**                     | HTTP Parameter Pollution protection                                  |
| **Zod Validation**          | Strict input validation on every endpoint at the boundary            |

---

## 🧪 Testing

The backend uses **Jest** with **Supertest** and **mongodb-memory-server** for integration testing with an isolated in-memory database.

```bash
cd server
npm test
```

### Test Coverage

| Suite          | Tests                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------ |
| **Auth**       | Register (success, duplicate email, missing fields), Login (success, wrong password/email), Protected route without token |
| **Tasks**      | Create, Get All (with filters), Get by ID, Update, Delete, Ownership enforcement            |
| **Analytics**  | Correct counts after creating tasks with mixed statuses                                     |

---

## 📂 Project Structure

```
Task-Management-System/
├── README.md
├── PROJECT_PLAN.md
├── TASKS.md
│
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── jest.config.js
│   ├── test-scenarios.http          # VS Code REST Client test file
│   ├── src/
│   │   ├── index.ts                 # Entry point
│   │   ├── app.ts                   # Express app setup
│   │   ├── config/
│   │   │   ├── db.ts                # MongoDB connection
│   │   │   └── env.ts               # Env validation (Zod)
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Task.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT verification
│   │   │   ├── errorHandler.ts      # Global error handler
│   │   │   ├── validate.ts          # Zod validation
│   │   │   └── rateLimiter.ts       # Rate limiting
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── task.routes.ts
│   │   │   └── analytics.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   └── analytics.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── task.service.ts
│   │   │   └── analytics.service.ts
│   │   ├── utils/
│   │   │   ├── ApiError.ts          # Custom error class
│   │   │   ├── ApiResponse.ts       # Uniform response wrapper
│   │   │   └── asyncHandler.ts      # Async route wrapper
│   │   └── validators/
│   │       ├── auth.validator.ts
│   │       └── task.validator.ts
│   └── tests/
│       ├── auth.test.ts
│       ├── tasks.test.ts
│       └── analytics.test.ts
│
├── client/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── api/
│       │   ├── axios.ts             # Axios instance + interceptors
│       │   ├── auth.api.ts
│       │   └── task.api.ts
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useTasks.ts
│       │   └── useAnalytics.ts
│       ├── store/
│       │   └── authStore.ts         # Zustand auth state
│       ├── components/
│       │   ├── ui/                  # Shadcn UI primitives
│       │   ├── layout/              # Sidebar, Navbar, DashboardLayout
│       │   ├── tasks/               # TaskCard, TaskList, TaskForm, Filters
│       │   ├── analytics/           # StatsCards, CompletionChart
│       │   └── common/              # ThemeToggle, Pagination, ConfirmDialog
│       ├── pages/
│       │   ├── LoginPage.tsx
│       │   ├── SignupPage.tsx
│       │   ├── DashboardPage.tsx
│       │   └── AnalyticsPage.tsx
│       ├── lib/
│       │   └── utils.ts             # Tailwind cn() helper
│       └── types/
│           └── index.ts
```

---

<div align="center">

**Built with ❤️ using React, Node.js, and MongoDB**

</div>
