import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label: string;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

export function SummaryCard({
  title,
  value,
  subtext,
  icon,
  trend,
  color = 'blue',
}: SummaryCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-lg', colorClasses[color])}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend.direction === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
              {trend.direction === 'up' ? '+' : '-'}
              {trend.value}
            </span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
      {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
    </Card>
  );
}
