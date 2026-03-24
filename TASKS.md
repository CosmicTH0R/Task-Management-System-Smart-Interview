# Task Management System — Master Sprint Checklist

> **Goal:** 100% requirement coverage, production-grade quality, portfolio-worthy.
> **Stack:** React + Vite + TypeScript | Node.js + Express + TypeScript | MongoDB + Mongoose

---

## Phase 1: Backend Foundation & Database Architecture
> *Estimated: 15 tasks — Get a secure, optimized Express server running with MongoDB.*

- [x] **1.01** Initialize `server/` — `npm init -y`, install TypeScript, ts-node-dev, configure `tsconfig.json`
- [x] **1.02** Install core deps: `express`, `mongoose`, `cors`, `dotenv`, `cookie-parser`
- [x] **1.03** Install security deps: `helmet`, `express-rate-limit`, `express-mongo-sanitize`, `hpp`
- [x] **1.04** Install auth deps: `bcryptjs`, `jsonwebtoken`, `zod`
- [x] **1.05** Create `src/config/env.ts` — validate all env vars with Zod (`PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `NODE_ENV`, `CLIENT_URL`)
- [x] **1.06** Create `src/config/db.ts` — MongoDB connection with retry logic and graceful error logging
- [x] **1.07** Create `src/app.ts` — Express app with helmet, cors (credentials + origin whitelist), cookie-parser, rate-limiter, hpp, mongo-sanitize, JSON body parser
- [x] **1.08** Create `src/index.ts` — Entry point: connect DB, start server, handle unhandled rejections/uncaught exceptions
- [x] **1.09** Create `src/models/User.ts` — Mongoose schema with name, email (unique, lowercase, trimmed), password (hashed pre-save hook, select: false), timestamps
- [x] **1.10** Create `src/models/Task.ts` — Mongoose schema with user (ObjectId ref), title, description, status enum, priority enum, dueDate, timestamps
- [x] **1.11** Add **compound indexes** on Task: `{ user: 1, status: 1 }`, `{ user: 1, priority: 1 }`, `{ user: 1, dueDate: 1 }`
- [x] **1.12** Add **text index** on Task: `{ title: 'text', description: 'text' }` for full-text search
- [x] **1.13** Create `src/utils/ApiError.ts` — Custom error class with statusCode, message, isOperational flag
- [x] **1.14** Create `src/utils/ApiResponse.ts` — Uniform response wrapper `{ success, data, message, pagination }`
- [x] **1.15** Create `src/utils/asyncHandler.ts` — Wraps async route handlers to catch errors automatically
- [x] **1.16** Create `src/middleware/errorHandler.ts` — Global error middleware: catches ApiError, Mongoose validation/cast/duplicate errors, returns clean JSON
- [x] **1.17** Create `.env.example` with all required env var placeholders

---

## Phase 2: Authentication System
> *6 tasks — JWT auth with httpOnly cookies, signup/login/logout/me.*

- [x] **2.01** Create `src/validators/auth.validator.ts` — Zod schemas for register (name 2-50 chars, email format, password 6+ chars) and login (email, password)
- [x] **2.02** Create `src/middleware/validate.ts` — Generic Zod validation middleware that parses `req.body` and returns 400 with structured errors
- [x] **2.03** Create `src/middleware/auth.ts` — JWT verification middleware: read token from `req.cookies.token`, verify, attach `req.user = { id, email }`, 401 if invalid/missing
- [x] **2.04** Create `src/services/auth.service.ts` — register (check duplicate, hash password, create user, sign JWT), login (find user with +password, compare hash, sign JWT)
- [x] **2.05** Create `src/controllers/auth.controller.ts` — Register, Login (sets httpOnly cookie), Logout (clears cookie), GetMe
- [x] **2.06** Create `src/routes/auth.routes.ts` — Wire POST `/register`, POST `/login`, POST `/logout`, GET `/me`
- [x] **2.07** Create `src/middleware/rateLimiter.ts` — Separate limiters: auth routes (10 req/15min), general API (100 req/15min)

---

## Phase 3: Task CRUD & Advanced Querying
> *8 tasks — Full CRUD with ownership check, filtering, search, sort, pagination.*

- [x] **3.01** Create `src/validators/task.validator.ts` — Zod schemas for create task (title required, status/priority enums, dueDate optional ISO date), update task (all optional), query params (status, priority, search, sortBy, order, page, limit)
- [x] **3.02** Create `src/services/task.service.ts` — createTask, getTaskById (with ownership check), updateTask, deleteTask
- [x] **3.03** Implement `getAllTasks` service — Build dynamic Mongoose filter: `{ user: userId }` + optional status, priority, text search (`$text: { $search }`)
- [x] **3.04** Implement **sorting** in getAllTasks — Support `sortBy` (dueDate, createdAt, priority, title) with `order` (asc/desc), default: createdAt desc
- [x] **3.05** Implement **pagination** in getAllTasks — `page` and `limit` params, use `.skip((page-1)*limit).limit(limit)`, return `{ total, page, pages, limit }` metadata
- [x] **3.06** Create `src/controllers/task.controller.ts` — Create, GetAll, GetById, Update, UpdateStatus (PATCH), Delete
- [x] **3.07** Create `src/routes/task.routes.ts` — Wire all routes, apply auth middleware to all, apply validation middleware per route
- [x] **3.08** Register auth and task routes in `app.ts`, add 404 handler for unknown routes

---

## Phase 4: Analytics Engine
> *3 tasks — MongoDB aggregation pipeline, NOT in-memory counting.*

- [x] **4.01** Create `src/services/analytics.service.ts` — MongoDB aggregation pipeline:
  - `$match` by user ObjectId
  - `$group` to compute: totalTasks, completedTasks (status = 'Done'), pendingTasks (status != 'Done'), and per-status counts
  - `$facet` for priority breakdown (Low/Medium/High counts)
  - Compute completionPercentage server-side
- [x] **4.02** Create `src/controllers/analytics.controller.ts` — GET handler that returns the aggregated analytics
- [x] **4.03** Add `GET /api/analytics` route (protected) in task routes or separate analytics routes file

---

## Phase 5: Backend Testing & Validation
> *4 tasks — Ensure the API is bulletproof before building frontend.*

- [x] **5.01** Install Jest + Supertest + mongodb-memory-server for integration tests
- [x] **5.02** Write auth tests: register (success, duplicate email, missing fields), login (success, wrong password, wrong email), protected route access without token
- [x] **5.03** Write task CRUD tests: create, get all (with filters), get by ID, update, delete, ownership enforcement (can't access another user's tasks)
- [x] **5.04** Write analytics tests: correct counts after creating tasks with various statuses
- [x] **5.05** Manual API testing: create `test-scenarios.http` (VS Code REST Client) or Postman collection for all endpoints

---

## Phase 6: Frontend Foundation
> *8 tasks — React + Vite + Tailwind + Shadcn UI + React Query setup.*

- [x] **6.01** Initialize `client/` with Vite React-TS template: `npm create vite@latest client -- --template react-ts`
- [x] **6.02** Install and configure **Tailwind CSS v3** with `tailwind.config.ts` (custom colors: Slate/Zinc palette for dark mode)
- [x] **6.03** Initialize **Shadcn UI** (`npx shadcn-ui@latest init`), install base components: Button, Input, Card, Dialog, Select, Badge, Dropdown Menu, Skeleton, Separator, Sheet
- [x] **6.04** Install **@tanstack/react-query** and set up `QueryClientProvider` in `main.tsx` with default options (staleTime: 5min, retry: 1)
- [x] **6.05** Install **React Router v6**, set up router with routes: `/login`, `/signup`, `/dashboard`, `*` (404)
- [x] **6.06** Install **Zustand** for client auth state: `useAuthStore` (user object, isAuthenticated, setUser, logout)
- [x] **6.07** Create `src/api/axios.ts` — Axios instance with `baseURL`, `withCredentials: true`, response interceptor for 401 → auto logout + redirect to `/login`
- [x] **6.08** Create `src/api/auth.api.ts` — functions: `registerUser`, `loginUser`, `logoutUser`, `getMe`
- [x] **6.09** Create `src/api/task.api.ts` — functions: `getTasks(params)`, `createTask`, `updateTask`, `deleteTask`, `updateTaskStatus`, `getAnalytics`
- [x] **6.10** Create `src/types/index.ts` — TypeScript interfaces: User, Task, TaskFilters, PaginationMeta, AnalyticsData, ApiResponse<T>

---

## Phase 7: Authentication UI
> *5 tasks — Login/Signup pages with validation and protected routing.*

- [x] **7.01** Create `src/pages/LoginPage.tsx` — Email + password form using Shadcn Input + Button, Zod client-side validation (react-hook-form + @hookform/resolvers), mutation via React Query, redirect to dashboard on success
- [x] **7.02** Create `src/pages/SignupPage.tsx` — Name + email + password + confirm password form, same pattern as login, redirect to login on success
- [x] **7.03** Create `src/components/common/ProtectedRoute.tsx` — Wrapper that checks `useAuthStore.isAuthenticated`, redirects to `/login` if not
- [x] **7.04** Create `src/components/common/GuestRoute.tsx` — Redirects authenticated users to `/dashboard`
- [x] **7.05** Implement **auto-login on refresh**: call `GET /api/auth/me` on app mount, populate auth store if cookie is valid

---

## Phase 8: Dashboard Layout & Navigation
> *5 tasks — Clean responsive layout with sidebar/navbar and dark mode.*

- [x] **8.01** Create `src/components/layout/DashboardLayout.tsx` — Sidebar + main content area layout with responsive behavior (sidebar collapses to hamburger on mobile)
- [x] **8.02** Create `src/components/layout/Sidebar.tsx` — Navigation links (Dashboard, Analytics), user info at bottom, logout button
- [x] **8.03** Create `src/components/layout/Navbar.tsx` — Mobile hamburger menu trigger, page title, theme toggle, user avatar/dropdown
- [x] **8.04** Create `src/components/common/ThemeToggle.tsx` — Dark/light mode toggle using Tailwind `dark:` classes, persist preference in `localStorage`
- [x] **8.05** Configure Tailwind `darkMode: 'class'`, apply dark mode styles globally (background, text, card, border colors)

---

## Phase 9: Task Management UI
> *12 tasks — The core of the app: task list, CRUD forms, filters, pagination.*

- [x] **9.01** Create `src/hooks/useTasks.ts` — React Query hook: `useQuery` for task list with filter/sort/page params, `useMutation` for create/update/delete with cache invalidation
- [x] **9.02** Create `src/pages/DashboardPage.tsx` — Main page composing: TaskFilters, TaskList, Pagination, and a "Create Task" button
- [x] **9.03** Create `src/components/tasks/TaskFilters.tsx` — Row of filter controls: Status dropdown (All/Todo/In Progress/Done), Priority dropdown (All/Low/Medium/High), Search input (debounced 300ms), Sort dropdown (Due Date/Created/Priority)
- [x] **9.04** Create `src/components/tasks/TaskCard.tsx` — Card displaying title, description (truncated), colored status badge, colored priority badge, due date (with "overdue" highlight if past), action buttons (edit, delete, status toggle)
- [x] **9.05** Create `src/components/tasks/TaskList.tsx` — Maps task array to TaskCard grid/list, handles loading (skeleton) and empty states
- [x] **9.06** Create `src/components/tasks/TaskForm.tsx` — Reusable form (create + edit mode) inside a Shadcn Dialog/Sheet: title, description textarea, status select, priority select, due date picker. Zod validation.
- [x] **9.07** Create `src/components/tasks/TaskSkeleton.tsx` — Skeleton loading cards mimicking TaskCard shape (3-6 skeletons)
- [x] **9.08** Create `src/components/tasks/EmptyState.tsx` — Friendly illustration + message for "No tasks yet" and "No results found" scenarios
- [x] **9.09** Create `src/components/common/Pagination.tsx` — Page controls: Previous, page numbers, Next, showing "Page X of Y"
- [x] **9.10** Create `src/components/common/ConfirmDialog.tsx` — Shadcn AlertDialog for delete confirmation
- [x] **9.11** Implement **optimistic updates** for status toggle — Use React Query's `onMutate` to instantly update the cache, `onError` to rollback, `onSettled` to refetch
- [x] **9.12** Implement **optimistic delete** — Same pattern: remove from cache instantly, rollback on error

---

## Phase 10: Analytics Dashboard
> *4 tasks — Stats cards + chart using aggregation API.*

- [x] **10.01** Create `src/hooks/useAnalytics.ts` — React Query hook for `GET /api/analytics` with appropriate staleTime
- [x] **10.02** Create `src/components/analytics/StatsCards.tsx` — Grid of 4 cards: Total Tasks, Completed, Pending, Completion % — with icons and colored accents
- [x] **10.03** Install **Recharts**, create `src/components/analytics/CompletionChart.tsx` — Clean donut/pie chart showing Todo vs In Progress vs Done distribution
- [x] **10.04** Create `src/pages/AnalyticsPage.tsx` OR integrate analytics section at top of DashboardPage — StatsCards row + CompletionChart + optional priority breakdown bar chart

---

## Phase 11: UX Polish & Micro-Interactions
> *8 tasks — The details that make it feel production-ready.*

- [ ] **11.01** Install **sonner** (toast library), configure `<Toaster />` in App.tsx, add toasts for: task created, task updated, task deleted, login success, errors
- [ ] **11.02** Add **loading states** on all buttons during mutations (spinner + disabled)
- [ ] **11.03** Add **form error messages** inline under each field (red text, shake animation)
- [ ] **11.04** Implement **debounced search** — 300ms debounce on the search input before triggering API call
- [ ] **11.05** Add **keyboard shortcuts**: Escape to close dialogs, Enter to submit forms
- [ ] **11.06** Add **responsive design** — Test and fix layout on mobile (375px), tablet (768px), desktop (1280px+)
- [ ] **11.07** Add **smooth transitions** — Tailwind `transition-all duration-200` on cards, hover effects on buttons, fade-in animations on page load
- [ ] **11.08** Add **favicon** and proper `<title>` tags per page using `document.title` or react-helmet-async

---

## Phase 12: Error Handling & Edge Cases
> *5 tasks — Bulletproof the app against every edge case.*

- [ ] **12.01** Handle **token expiry** gracefully — 401 interceptor logs out user, shows toast "Session expired, please login again"
- [ ] **12.02** Handle **network errors** — Show toast "Network error, please check your connection"
- [ ] **12.03** Handle **concurrent modifications** — If a task update fails with 404 (deleted by another tab), refetch and notify
- [ ] **12.04** Add **404 page** — Friendly not-found page with link back to dashboard
- [ ] **12.05** Verify **input sanitization** — Ensure no XSS via task title/description, MongoDB injection prevention is active

---

## Phase 13: Deployment
> *6 tasks — Get it live and accessible.*

- [ ] **13.01** Create `server/.env.example` and `client/.env.example` with all required variables
- [ ] **13.02** Add build scripts: `server/package.json` → `"build": "tsc"`, `"start": "node dist/index.js"`
- [ ] **13.03** Deploy MongoDB to **MongoDB Atlas** — Create free cluster, whitelist IPs, get connection string
- [ ] **13.04** Deploy backend to **Render** — Add environment variables, set build command (`npm install && npm run build`), start command (`npm start`)
- [ ] **13.05** Deploy frontend to **Vercel** — Set `VITE_API_URL` env var to Render backend URL, configure build settings
- [ ] **13.06** Update backend **CORS** to allow the Vercel production URL, test end-to-end on live deployment

---

## Phase 14: Documentation & Submission
> *5 tasks — Package it perfectly for evaluators.*

- [ ] **14.01** Write comprehensive **README.md** with: project overview, screenshots, features list, tech stack, local setup steps, `.env.example` reference, API endpoints table
- [ ] **14.02** Add **Design Decisions** section to README: explain React Query choice, MongoDB indexing strategy, security measures (helmet, httpOnly cookies, rate limiting), aggregation pipeline for analytics
- [ ] **14.03** Take **screenshots** of: Login page, Dashboard (light + dark), Task creation form, Analytics section, Mobile responsive view
- [ ] **14.04** Ensure **GitHub repo is public**, `.gitignore` excludes `node_modules`, `.env`, `dist`
- [ ] **14.05** **Final verification checklist**:
  - [ ] Live link works on desktop
  - [ ] Live link works on mobile
  - [ ] Register → Login → Create Task → Edit → Filter → Search → Sort → Paginate → Analytics → Delete → Logout flow works end-to-end
  - [ ] Dark mode works
  - [ ] No console errors
  - [ ] Fill out Google Form submission

---

## Requirement Coverage Matrix

| # | Requirement | Where Implemented | Phase |
|---|------------|-------------------|-------|
| 1 | User Signup & Login | auth routes + Login/Signup pages | 2, 7 |
| 2 | JWT-based authentication | httpOnly cookie JWT, auth middleware | 2 |
| 3 | Basic validation (email, password) | Zod schemas (server + client) | 2, 7 |
| 4 | Create a task | POST /api/tasks + TaskForm | 3, 9 |
| 5 | View all tasks | GET /api/tasks + TaskList | 3, 9 |
| 6 | Update a task | PUT /api/tasks/:id + TaskForm edit mode | 3, 9 |
| 7 | Delete a task | DELETE /api/tasks/:id + ConfirmDialog | 3, 9 |
| 8 | Mark task as completed | PATCH /api/tasks/:id/status + optimistic toggle | 3, 9 |
| 9 | Task fields: title, description, status, priority, dueDate | Task model + TaskForm | 1, 9 |
| 10 | Filter by status | Query param + TaskFilters dropdown | 3, 9 |
| 11 | Filter by priority | Query param + TaskFilters dropdown | 3, 9 |
| 12 | Search by title | Text index + search input | 3, 9 |
| 13 | Total number of tasks | Analytics aggregation + StatsCards | 4, 10 |
| 14 | Completed tasks count | Analytics aggregation + StatsCards | 4, 10 |
| 15 | Pending tasks count | Analytics aggregation + StatsCards | 4, 10 |
| 16 | Completion percentage | Computed in aggregation + donut chart | 4, 10 |
| 17 | Clean and simple UI | Tailwind + Shadcn UI | 6, 8 |
| 18 | Task list view | TaskList + TaskCard components | 9 |
| 19 | Form to create/update task | TaskForm in Dialog/Sheet | 9 |
| 20 | Analytics section/dashboard | StatsCards + CompletionChart | 10 |
| 21 | Loading & error states | Skeletons, toast notifications, error boundaries | 9, 11 |
| 22 | Pagination | skip/limit backend + Pagination component | 3, 9 |
| 23 | Sorting (due date / priority) | Sort query params + Sort dropdown | 3, 9 |
| 24 | Responsive design | Tailwind responsive classes, mobile-first | 11 |
| 25 | Dark mode | Tailwind dark: classes + ThemeToggle | 8 |
| 26 | Global error handling middleware | errorHandler.ts | 1 |
| 27 | Optimized queries / indexing | Compound + text indexes on Task | 1 |
| 28 | Frontend: React | React 18 + Vite | 6 |
| 29 | Backend: Node.js + Express | Express.js + TypeScript | 1 |
| 30 | Database: MongoDB | Mongoose ODM + MongoDB Atlas | 1 |
| 31 | README with setup, API, design decisions | README.md | 14 |
| 32 | Live deployment link | Render + Vercel | 13 |
| 33 | GitHub repo | Public repo | 14 |

---

**Total Tasks: ~94**
**Phases: 14**
**Every single assignment requirement is mapped to a specific task.**
