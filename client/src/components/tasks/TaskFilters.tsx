import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { TaskFilters, TaskStatus, TaskPriority } from '@/types';

interface TaskFiltersBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

const STATUS_BUTTONS: Array<{ value: TaskStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'Todo', label: 'To-Do' },
  { value: 'In Progress', label: 'In-Progress' },
  { value: 'Done', label: 'Completed' },
];

const PRIORITY_OPTIONS: Array<{ value: TaskPriority | 'all'; label: string }> = [
  { value: 'all', label: 'All priorities' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Created date' },
  { value: 'dueDate', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

export default function TaskFiltersBar({ filters, onChange }: TaskFiltersBarProps) {
  const set = useCallback(
    (patch: Partial<TaskFilters>) => onChange({ ...filters, page: 1, ...patch }),
    [filters, onChange],
  );

  const hasActiveFilters = !!(filters.status || filters.priority || filters.search);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {STATUS_BUTTONS.map(({ value, label }) => {
          const isActive = (filters.status ?? 'all') === value;

          return (
            <Button
              key={value}
              type="button"
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              className="min-w-[110px]"
              onClick={() => set({ status: value === 'all' ? undefined : value })}
            >
              {label}
            </Button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <div className="relative min-w-[180px] flex-1">
          <Input
            placeholder="Search tasks…"
            value={filters.search ?? ''}
            onChange={(e) => set({ search: e.target.value || undefined })}
            className="h-9 pr-8 text-sm"
          />
          {filters.search && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => set({ search: undefined })}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.priority ?? 'all'}
            onValueChange={(v) => set({ priority: v === 'all' ? undefined : (v as TaskPriority) })}
          >
            <SelectTrigger className="h-9 w-[140px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value} className="text-sm">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy ?? 'createdAt'}
            onValueChange={(v) => set({ sortBy: v as TaskFilters['sortBy'] })}
          >
            <SelectTrigger className="h-9 w-[130px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value} className="text-sm">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs"
            onClick={() => set({ order: filters.order === 'asc' ? 'desc' : 'asc' })}
          >
            {filters.order === 'asc' ? '↑ Asc' : '↓ Desc'}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 text-xs text-muted-foreground"
              onClick={() => onChange({ sortBy: filters.sortBy, order: filters.order, page: 1 })}
            >
              <X className="mr-1 h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
