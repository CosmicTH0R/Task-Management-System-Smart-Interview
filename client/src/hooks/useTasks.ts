import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '@/api/task.api';
import type { TaskFilters, CreateTaskInput, UpdateTaskInput, Task } from '@/types';

const TASKS_KEY = 'tasks';

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: [TASKS_KEY, filters],
    queryFn: () => getTasks(filters),
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskInput) => createTask(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) => updateTask(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateTaskStatus(id, status),
    // Optimistic update
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: [TASKS_KEY] });
      const previousData = qc.getQueriesData<{ data: Task[] }>({ queryKey: [TASKS_KEY] });
      qc.setQueriesData<{ data: Task[]; pagination: unknown }>(
        { queryKey: [TASKS_KEY] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((t) => (t._id === id ? { ...t, status } : t)),
          };
        },
      );
      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => qc.setQueryData(key, data));
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    // Optimistic delete
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: [TASKS_KEY] });
      const previousData = qc.getQueriesData<{ data: Task[] }>({ queryKey: [TASKS_KEY] });
      qc.setQueriesData<{ data: Task[]; pagination: unknown }>(
        { queryKey: [TASKS_KEY] },
        (old) => {
          if (!old) return old;
          return { ...old, data: old.data.filter((t) => t._id !== id) };
        },
      );
      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => qc.setQueryData(key, data));
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}
