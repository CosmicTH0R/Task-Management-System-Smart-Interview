import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AnalyticsData } from '@/types';

interface StatsCardsProps {
  data?: AnalyticsData;
  isLoading: boolean;
}

const stats = [
  {
    key: 'totalTasks' as const,
    label: 'Total Tasks',
    icon: ListTodo,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    key: 'completedTasks' as const,
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    key: 'pendingTasks' as const,
    label: 'Pending',
    icon: Clock,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  {
    key: 'completionPercentage' as const,
    label: 'Completion Rate',
    icon: TrendingUp,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    format: (v: number) => `${Math.round(v)}%`,
  },
];

export default function StatsCards({ data, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ key, label, icon: Icon, color, bg, format }) => {
        const value = data?.[key] ?? 0;
        return (
          <Card key={key} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <div className={`rounded-full p-2 ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {format ? format(value) : value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
