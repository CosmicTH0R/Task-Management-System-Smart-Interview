import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AnalyticsData } from '@/types';

interface CompletionChartProps {
  data?: AnalyticsData;
  isLoading: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  Todo: '#6366f1',
  'In Progress': '#f59e0b',
  Done: '#22c55e',
};

const PRIORITY_COLORS: Record<string, string> = {
  Low: '#94a3b8',
  Medium: '#3b82f6',
  High: '#ef4444',
};

export default function CompletionChart({ data, isLoading }: CompletionChartProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <Skeleton className="h-48 w-48 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statusData = (data?.statusBreakdown ?? []).map((s) => ({
    name: s.status,
    value: s.count,
  }));

  const priorityData = (data?.priorityBreakdown ?? []).map((p) => ({
    name: p.priority,
    value: p.count,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Donut chart — status distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {statusData.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name] ?? '#8884d8'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value ?? 0, name]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend iconType="circle" iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bar chart — priority breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Priority Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {priorityData.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={priorityData}
                margin={{ top: 4, right: 16, left: -16, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  cursor={{ fill: 'hsl(var(--muted))' }}
                />
                <Bar dataKey="value" name="Tasks" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={PRIORITY_COLORS[entry.name] ?? '#8884d8'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
