import { useAnalytics } from '@/hooks/useAnalytics';
import StatsCards from '@/components/analytics/StatsCards';
import CompletionChart from '@/components/analytics/CompletionChart';
import { AlertCircle } from 'lucide-react';

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your task performance and progress
        </p>
      </div>

      {isError && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Failed to load analytics.</span>
          <button
            onClick={() => refetch()}
            className="ml-auto underline underline-offset-2 hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      <StatsCards data={data} isLoading={isLoading} />
      <CompletionChart data={data} isLoading={isLoading} />
    </div>
  );
}
