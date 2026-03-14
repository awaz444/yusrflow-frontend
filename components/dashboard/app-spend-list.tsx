'use client';

import { useLanguage } from '@/lib/i18n/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

export function AppSpendList({ apps }: { apps: any[] }) {
  const { t } = useLanguage();
  
  const appsWithSpend = apps
    .filter(app => app.monthlySpend > 0)
    .sort((a, b) => b.monthlySpend - a.monthlySpend);

  if (appsWithSpend.length === 0) return null;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-accent" />
          {t('dashboard.overview.saasApplications')} - {t('dashboard.stats.monthlySpend')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appsWithSpend.map((app) => (
            <div key={app.id} className="flex items-center justify-between group">
              <div className="flex flex-col">
                <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                  {app.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {app.category}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-foreground">
                  {app.monthlySpend?.toLocaleString()} {app.currency || 'SAR'}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase">
                  {app.billingCycle || 'Monthly'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
