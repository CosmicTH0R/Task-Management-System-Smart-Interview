import type { Task } from '@/types';
import TaskCard from './TaskCard';
import TaskSkeleton from './TaskSkeleton';
import EmptyState from './EmptyState';
import { useUpdateTaskStatus, useDeleteTask } from '@/hooks/useTasks';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  hasFilters: boolean;
  onEdit: (task: Task) => void;
  onDeleteConfirm: (id: string) => void;
}

export default function TaskList({
  tasks,
  isLoading,
  hasFilters,
  onEdit,
  onDeleteConfirm,
}: TaskListProps) {
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateTaskStatus();
  const { mutate: deleteTask, isPending: isDeleting, variables: deletingId } = useDeleteTask();

  if (isLoading) return <TaskSkeleton />;
  if (!tasks.length) return <EmptyState type={hasFilters ? 'noResults' : 'empty'} />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={(id) => onDeleteConfirm(id)}
          onStatusChange={(id, status) => updateStatus({ id, status })}
          isDeleting={isDeleting && deletingId === task._id}
          isUpdatingStatus={isUpdatingStatus}
        />
      ))}
    </div>
  );
}
