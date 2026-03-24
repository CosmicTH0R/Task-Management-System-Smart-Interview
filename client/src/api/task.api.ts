import api from './axios';
import type {
  ApiResponse,
  PaginatedResponse,
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  AnalyticsData,
} from '@/types';

export async function getTasks(params?: TaskFilters): Promise<PaginatedResponse<Task>> {
  const res = await api.get<PaginatedResponse<Task>>('/tasks', { params });
  return res.data;
}

export async function getTaskById(id: string): Promise<Task> {
  const res = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
  return res.data.data!;
}

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const res = await api.post<ApiResponse<Task>>('/tasks', data);
  return res.data.data!;
}

export async function updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
  const res = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
  return res.data.data!;
}

export async function updateTaskStatus(id: string, status: string): Promise<Task> {
  const res = await api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, { status });
  return res.data.data!;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const res = await api.get<ApiResponse<AnalyticsData>>('/analytics');
  const analytics = res.data.data! as AnalyticsData & {
    statusBreakdown?: unknown;
    priorityBreakdown?: unknown;
  };

  const legacyStatusBreakdown =
    analytics.statusBreakdown && !Array.isArray(analytics.statusBreakdown)
      ? (analytics.statusBreakdown as { todo?: number; inProgress?: number; done?: number })
      : undefined;

  const legacyPriorityBreakdown =
    analytics.priorityBreakdown && !Array.isArray(analytics.priorityBreakdown)
      ? (analytics.priorityBreakdown as { low?: number; medium?: number; high?: number })
      : undefined;

  const normalizedStatusBreakdown = Array.isArray(analytics.statusBreakdown)
    ? analytics.statusBreakdown
    : [
        { status: 'Todo' as const, count: legacyStatusBreakdown?.todo ?? 0 },
        { status: 'In Progress' as const, count: legacyStatusBreakdown?.inProgress ?? 0 },
        { status: 'Done' as const, count: legacyStatusBreakdown?.done ?? 0 },
      ];

  const normalizedPriorityBreakdown = Array.isArray(analytics.priorityBreakdown)
    ? analytics.priorityBreakdown
    : [
        { priority: 'Low' as const, count: legacyPriorityBreakdown?.low ?? 0 },
        { priority: 'Medium' as const, count: legacyPriorityBreakdown?.medium ?? 0 },
        { priority: 'High' as const, count: legacyPriorityBreakdown?.high ?? 0 },
      ];

  return {
    ...analytics,
    statusBreakdown: normalizedStatusBreakdown,
    priorityBreakdown: normalizedPriorityBreakdown,
  };
}
