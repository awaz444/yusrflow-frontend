'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n/language-context';
import { BarChart3 } from 'lucide-react';

export function SpendChart({ data }: { data: any[] }) {
  const { t } = useLanguage();

  const hasAnyHistory = data.some((d) => d.hasData && d.spend > 0);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{t('dashboard.monthlySpend')}</CardTitle>
        {!hasAnyHistory && (
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
            Historical data not yet available
          </span>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v === 0 ? '0' : `${v}`)}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--secondary))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
                fontSize: '12px',
              }}
              formatter={(value: any, _name: any, props: any) => {
                if (!props.payload?.hasData) return ['No data', 'Spend'];
                return [`SAR ${value.toLocaleString()}`, t('dashboard.monthlySpend')];
              }}
            />
            <Bar dataKey="spend" radius={[6, 6, 0, 0]} name={t('dashboard.monthlySpend')}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.hasData ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'}
                  opacity={entry.hasData ? 1 : 0.4}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {!hasAnyHistory && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <BarChart3 className="w-3.5 h-3.5 shrink-0" />
            <span>
              Spend history will accumulate as months pass. Only the current month reflects real spend data.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
