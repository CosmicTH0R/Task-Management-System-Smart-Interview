import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TASKS_KEY] });
      toast.success('Task created');
    },
    onError: () => toast.error('Failed to create task'),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) => updateTask(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TASKS_KEY] });
      toast.success('Task updated');
    },
    onError: (error) => {
      if ((error as { response?: { status?: number } })?.response?.status === 404) {
        qc.invalidateQueries({ queryKey: [TASKS_KEY] });
        toast.error('Task no longer exists. The list was refreshed.');
        return;
      }

      toast.error('Failed to update task');
    },
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
    onError: (error, _vars, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => qc.setQueryData(key, data));
      }

      if ((error as { response?: { status?: number } })?.response?.status === 404) {
        qc.invalidateQueries({ queryKey: [TASKS_KEY] });
        toast.error('Task no longer exists. The list was refreshed.');
        return;
      }

      toast.error('Failed to update status');
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
    onError: (error, _vars, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => qc.setQueryData(key, data));
      }

      if ((error as { response?: { status?: number } })?.response?.status === 404) {
        qc.invalidateQueries({ queryKey: [TASKS_KEY] });
        toast.error('Task was already removed. The list was refreshed.');
        return;
      }

      toast.error('Failed to delete task');
    },
    onSuccess: () => toast.success('Task deleted'),
    onSettled: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}
