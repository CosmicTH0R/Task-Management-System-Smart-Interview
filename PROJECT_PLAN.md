# Task Management System — Production-Grade Project Plan

## Objective
Build a **Task Tracker Web App** (Mini Project) with authentication, task CRUD, filtering/search, analytics dashboard, and collaboration-ready architecture. The goal is 100% requirement coverage with production-level code quality.

---

## Tech Stack

| Layer        | Technology                                      |
|-------------|------------------------------------------------|
| Frontend    | React 18+ (Vite), TypeScript, Tailwind CSS, Shadcn UI |
| State Mgmt  | @tanstack/react-query (server state), Zustand (client state) |
| Routing     | React Router v6                                 |
| Charts      | Recharts                                        |
| Backend     | Node.js, Express.js, TypeScript                 |
| Database    | MongoDB with Mongoose ODM                       |
| Auth        | JWT (httpOnly cookies) + bcryptjs               |
| Validation  | Zod (shared schemas), express-validator          |
| Security    | helmet, express-rate-limit, cors, hpp, mongo-sanitize |
| Testing     | Vitest (frontend), Jest + Supertest (backend)   |
| Deployment  | Backend → Render, Frontend → Vercel             |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Auth Pages│  │Dashboard │  │ Analytics Section │  │
│  │Login/Sign│  │Task CRUD │  │ Charts + Cards    │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
│            Axios Instance (JWT auto-attach)          │
└────────────────────┬────────────────────────────────┘
                     │ REST API (JSON)
┌────────────────────▼────────────────────────────────┐
│                  Backend (Express)                    │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │Auth MW  │ │Task Routes│ │Analytics │ │Error MW │ │
│  │(JWT)    │ │CRUD+Query │ │Aggregation│ │(Global) │ │
│  └─────────┘ └──────────┘ └──────────┘ └─────────┘ │
│          Mongoose ODM (Indexed Queries)              │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────▼───────────┐
         │    MongoDB Atlas      │
         │  Users + Tasks        │
         │  Compound Indexes     │
         │  Text Search Index    │
         └───────────────────────┘
```

---

## API Endpoints Design

### Authentication
| Method | Endpoint             | Description          | Auth |
|--------|---------------------|----------------------|------|
| POST   | /api/auth/register  | Create new user       | No   |
| POST   | /api/auth/login     | Login, receive JWT    | No   |
| POST   | /api/auth/logout    | Clear auth cookie     | Yes  |
| GET    | /api/auth/me        | Get current user info | Yes  |

### Tasks
| Method | Endpoint          | Description                        | Auth |
|--------|------------------|------------------------------------|------|
| GET    | /api/tasks       | List tasks (filter, search, sort, paginate) | Yes |
| POST   | /api/tasks       | Create a new task                  | Yes  |
| GET    | /api/tasks/:id   | Get single task                    | Yes  |
| PUT    | /api/tasks/:id   | Update a task                      | Yes  |
| PATCH  | /api/tasks/:id/status | Mark task status (quick toggle) | Yes  |
| DELETE | /api/tasks/:id   | Delete a task                      | Yes  |

### Analytics
| Method | Endpoint          | Description                        | Auth |
|--------|------------------|------------------------------------|------|
| GET    | /api/analytics   | Aggregated task insights           | Yes  |

### Query Parameters for GET /api/tasks
```
?status=Done&priority=High&search=meeting&sortBy=dueDate&order=asc&page=1&limit=10
```

---

## Database Schema Design

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
// Compound index for filtered queries
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
// Text index for search
taskSchema.index({ title: 'text', description: 'text' });
```

---

## Folder Structure

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
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── app.ts                # Express app setup
│   │   ├── config/
│   │   │   ├── db.ts             # MongoDB connection
│   │   │   └── env.ts            # Environment validation
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Task.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT verification
│   │   │   ├── errorHandler.ts   # Global error handler
│   │   │   ├── validate.ts       # Request validation
│   │   │   └── rateLimiter.ts    # Rate limiting
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── task.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   └── analytics.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── task.service.ts
│   │   │   └── analytics.service.ts
│   │   ├── utils/
│   │   │   ├── ApiError.ts       # Custom error class
│   │   │   ├── ApiResponse.ts    # Uniform response wrapper
│   │   │   └── asyncHandler.ts   # Async route wrapper
│   │   └── validators/
│   │       ├── auth.validator.ts
│   │       └── task.validator.ts
│   └── tests/
│       ├── auth.test.ts
│       ├── task.test.ts
│       └── analytics.test.ts
│
├── client/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api/
│   │   │   ├── axios.ts          # Axios instance + interceptors
│   │   │   ├── auth.api.ts
│   │   │   └── task.api.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useTasks.ts
│   │   │   └── useAnalytics.ts
│   │   ├── store/
│   │   │   └── authStore.ts      # Zustand for auth state
│   │   ├── components/
│   │   │   ├── ui/               # Shadcn UI components
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── DashboardLayout.tsx
│   │   │   ├── tasks/
│   │   │   │   ├── TaskCard.tsx
│   │   │   │   ├── TaskList.tsx
│   │   │   │   ├── TaskForm.tsx
│   │   │   │   ├── TaskFilters.tsx
│   │   │   │   ├── TaskSkeleton.tsx
│   │   │   │   └── EmptyState.tsx
│   │   │   ├── analytics/
│   │   │   │   ├── StatsCards.tsx
│   │   │   │   └── CompletionChart.tsx
│   │   │   └── common/
│   │   │       ├── ThemeToggle.tsx
│   │   │       ├── Pagination.tsx
│   │   │       └── ConfirmDialog.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── lib/
│   │   │   └── utils.ts          # Tailwind cn() helper
│   │   └── types/
│   │       └── index.ts
│   └── components.json           # Shadcn config
```

---

## Security Measures
1. **Password Hashing** — bcryptjs with salt rounds = 12
2. **JWT in httpOnly Cookies** — prevents XSS token theft
3. **Helmet** — secure HTTP headers
4. **Rate Limiting** — 100 req/15min general, 10 req/15min for auth
5. **Input Sanitization** — express-mongo-sanitize to prevent NoSQL injection
6. **CORS** — whitelist only the frontend origin
7. **HPP** — HTTP parameter pollution protection
8. **Validation** — Zod schemas on all inputs at the boundary

---

## Design Decisions (for README)
1. **React Query over useEffect** — automatic caching, background refetching, optimistic updates, retry logic
2. **Shadcn UI + Tailwind** — accessible headless components with full style control (avoids "template" look)
3. **MongoDB Aggregation Pipeline** for analytics — server-side computation, not client-side loop counting
4. **Compound Indexes** — O(log n) filtered queries instead of collection scans
5. **httpOnly Cookies** — defense-in-depth against XSS compared to localStorage JWT
6. **TypeScript end-to-end** — type safety across the full stack
7. **Layered architecture** (Controller → Service → Model) — separation of concerns, testability
