'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n/language-context';

export function SpendChart({ data }: { data: any[] }) {
  const { t } = useLanguage();

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">{t('dashboard.monthlySpend')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis dataKey="month" stroke="#a0a0a0" />
            <YAxis stroke="#a0a0a0" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#141414',
                border: '1px solid #2a2a3e',
                borderRadius: '8px',
                color: '#f5f5f5',
              }}
            />
            <Bar
              dataKey="spend"
              fill="#6d5cff"
              radius={[8, 8, 0, 0]}
              name={t('dashboard.monthlySpend')}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
