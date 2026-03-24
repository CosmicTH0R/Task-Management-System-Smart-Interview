// ─── API Response Wrapper ─────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// ─── Task ─────────────────────────────────────────────────────────────────────
export type TaskStatus = 'Todo' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  _id: string;
  user: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface StatusBreakdown {
  status: TaskStatus;
  count: number;
}

export interface PriorityBreakdown {
  priority: TaskPriority;
  count: number;
}

export interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionPercentage: number;
  statusBreakdown: StatusBreakdown[];
  priorityBreakdown: PriorityBreakdown[];
}
