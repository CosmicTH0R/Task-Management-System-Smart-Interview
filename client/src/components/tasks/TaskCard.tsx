import { format, isPast } from 'date-fns';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import type { Task, TaskStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<TaskStatus, string> = {
  Todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Done: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

const PRIORITY_COLORS = {
  Low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const STATUSES: TaskStatus[] = ['Todo', 'In Progress', 'Done'];

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  isDeleting?: boolean;
  isUpdatingStatus?: boolean;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isDeleting,
  isUpdatingStatus,
}: TaskCardProps) {
  const isOverdue =
    task.status !== 'Done' && task.dueDate && isPast(new Date(task.dueDate));

  return (
    <Card
      className={cn(
        'flex flex-col transition-all duration-200 hover:shadow-md',
        isDeleting && 'opacity-50 pointer-events-none',
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold leading-tight line-clamp-2">
            {task.title}
          </CardTitle>
          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit(task)}
              aria-label="Edit task"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(task._id)}
              aria-label="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
              STATUS_COLORS[task.status],
            )}
          >
            {task.status}
          </span>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
              PRIORITY_COLORS[task.priority],
            )}
          >
            {task.priority}
          </span>
        </div>

        {/* Due date */}
        {task.dueDate && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs',
              isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground',
            )}
          >
            <Calendar className="h-3 w-3" />
            {isOverdue ? 'Overdue · ' : ''}
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </div>
        )}

        {/* Status changer */}
        <div className="mt-auto pt-1">
          <Select
            defaultValue={task.status}
            onValueChange={(v) => onStatusChange(task._id, v)}
            disabled={isUpdatingStatus}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
