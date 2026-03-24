import { useState, useCallback, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskList from '@/components/tasks/TaskList';
import TaskFiltersBar from '@/components/tasks/TaskFilters';
import TaskForm from '@/components/tasks/TaskForm';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { useDebounce } from '@/hooks/useDebounce';
import type { TaskFilters, Task, CreateTaskInput, TaskStatus } from '@/types';

const STATUS_BUTTONS: Array<{ value: TaskStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'Todo', label: 'To-Do' },
  { value: 'In Progress', label: 'In-Progress' },
  { value: 'Done', label: 'Completed' },
];

export default function DashboardPage() {
  useEffect(() => { document.title = 'Dashboard — TaskFlow'; }, []);

  const [filters, setFilters] = useState<TaskFilters>({
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 9,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search, 300);
  const queryFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch || undefined }),
    [filters, debouncedSearch],
  );

  const { data, isLoading, isFetching } = useTasks(queryFilters);
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const hasFilters = !!(filters.status || filters.priority || filters.search);

  // Keyboard shortcut: Ctrl/Cmd + K to create new task
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setEditingTask(null);
        setFormOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback((id: string) => {
    setDeletingId(id);
  }, []);

  const handleFormSubmit = (input: CreateTaskInput) => {
    if (editingTask) {
      updateTask(
        { id: editingTask._id, data: input },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditingTask(null);
          },
        },
      );
    } else {
      createTask(input, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    deleteTask(deletingId, { onSettled: () => setDeletingId(null) });
  };

  const handleStatusFilterChange = useCallback((status: TaskStatus | 'all') => {
    setFilters((current) => ({
      ...current,
      page: 1,
      status: status === 'all' ? undefined : status,
    }));
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-start xl:gap-3">
        {/* Title row — always visible */}
        <div className="min-h-[40px] xl:min-h-[56px]">
          <h2 className="text-xl font-semibold">My Tasks</h2>
          {data ? (
            <p className="text-sm text-muted-foreground">
              {data.pagination.total} task{data.pagination.total !== 1 ? 's' : ''} total
            </p>
          ) : (
            <p className="text-sm text-transparent select-none">0 tasks total</p>
          )}
        </div>

        {/* Small + Medium: single scrollable row with status buttons + new-task button */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:hidden">
          {STATUS_BUTTONS.map(({ value, label }) => {
            const isActive = (filters.status ?? 'all') === value;
            return (
              <Button
                key={value}
                type="button"
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className="h-8 shrink-0 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm"
                onClick={() => handleStatusFilterChange(value)}
              >
                {label}
              </Button>
            );
          })}

          {/* Medium: full label; Small: icon only */}
          <Button
            size="sm"
            className="h-8 shrink-0 px-2 sm:h-9 sm:px-3"
            onClick={() => { setEditingTask(null); setFormOpen(true); }}
            title="Ctrl+K"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-1.5 sm:text-sm">New task</span>
          </Button>
        </div>

        {/* Large (xl+): status buttons in center column — unchanged */}
        <div className="hidden xl:flex xl:items-center xl:justify-center xl:gap-2 xl:pt-0.5">
          {STATUS_BUTTONS.map(({ value, label }) => {
            const isActive = (filters.status ?? 'all') === value;
            return (
              <Button
                key={value}
                type="button"
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className="min-w-[110px]"
                onClick={() => handleStatusFilterChange(value)}
              >
                {label}
              </Button>
            );
          })}
        </div>

        {/* Large (xl+): New task on the right — unchanged */}
        <Button
          className="hidden xl:inline-flex xl:justify-self-end"
          size="sm"
          onClick={() => { setEditingTask(null); setFormOpen(true); }}
          title="Ctrl+K"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          New task
        </Button>
      </div>

      {/* Filters */}
      <TaskFiltersBar filters={filters} onChange={setFilters} />

      {/* No loading indicator when updating tasks */}

      {/* Task grid */}
      <TaskList
        tasks={data?.data ?? []}
        isLoading={isLoading}
        hasFilters={hasFilters}
        onEdit={handleEdit}
        onDeleteConfirm={handleDeleteConfirm}
      />

      {/* Pagination */}
      {data?.pagination && (
        <Pagination
          meta={data.pagination}
          onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
        />
      )}

      {/* Create/Edit dialog */}
      <TaskForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Delete task?"
        description="This will permanently remove the task. This action cannot be undone."
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
