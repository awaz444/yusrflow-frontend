'use client';

import { DashboardHeader } from '@/components/dashboard/header';
import { StatCard } from '@/components/dashboard/stat-card';
import { ComplianceScores } from '@/components/dashboard/compliance-scores';
import { AlertsSection } from '@/components/dashboard/alerts-section';
import { TopAppsSection } from '@/components/dashboard/top-apps';
import {
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useTenantDashboard } from '@/lib/hooks/use-tenant-dashboard';

import { useLanguage } from '@/lib/i18n/language-context';

export default function Home() {
  const { t } = useLanguage();
  const { data, isLoading: loading } = useTenantDashboard();

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground font-bold" />
        </div>
      </AuthGuard>
    );
  }

  if (!data) {
    return (
      <AuthGuard>
        <div className="text-center text-red-500 mt-10">{t('dashboard.overview.failedLoad')}</div>
      </AuthGuard>
    );
  }

  const dashboard = data;

  const averageComplianceScore =
    Math.round(
      dashboard.saasApps.reduce((sum: number, app: any) => sum + app.complianceScore, 0) /
      (dashboard.saasApps.length || 1)
    ) || 0;

  const complianceScores = {
    overall: averageComplianceScore,
    trend: 5,
    pdpl: Math.min(100, Math.round(averageComplianceScore * 1.05)),
    sdaia: Math.min(100, Math.round(averageComplianceScore * 0.95)),
    nca: Math.min(100, Math.round(averageComplianceScore * 0.90)),
    citc: Math.min(100, Math.round(averageComplianceScore * 1.02)),
  };

  const highRiskApps = dashboard.saasApps.filter(
    (app: any) => app.riskLevel === 'high' || app.riskLevel === 'critical'
  ).length;

  const totalUsers = dashboard.totalUsers || 0;

  return (
    <AuthGuard>
      {/* Tenant Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">
          {t('dashboard.overview.welcome')} {dashboard.tenantName}
        </h2>
        <p className="text-muted-foreground mt-1">
          {t('dashboard.overview.subtitle')}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatCard
          title={t('dashboard.stats.totalApps')}
          value={dashboard.saasApps.length}
          icon={<BarChart3 className="h-5 w-5" />}
          description={t('dashboard.stats.appsInUse')}
        />
        <StatCard
          title={t('dashboard.stats.avgCompliance')}
          value={`${averageComplianceScore}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={5}
        />
        <StatCard
          title={t('dashboard.stats.highRiskApps')}
          value={highRiskApps}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={-2}
          description={t('dashboard.stats.immediateAttention')}
        />
      </div>

      {/* Compliance & Alerts Row */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <ComplianceScores scores={complianceScores} />
        <AlertsSection alerts={dashboard.alerts || []} />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-1 mb-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {t('dashboard.overview.quickStats')}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('dashboard.overview.totalUsers')}</span>
              <span className="font-bold text-foreground">{totalUsers}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t('dashboard.overview.compliantApps')}
              </span>
              <span className="font-bold text-green-400">
                {dashboard.saasApps.filter((a: any) => a.status === 'compliant').length}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t('dashboard.overview.partialCompliance')}
              </span>
              <span className="font-bold text-yellow-400">
                {dashboard.saasApps.filter((a: any) => a.status === 'partial').length}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t('dashboard.overview.nonCompliantApps')}
              </span>
              <span className="font-bold text-red-400">
                {dashboard.saasApps.filter((a: any) => a.status === 'non_compliant').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Applications Table */}
      <TopAppsSection apps={dashboard.saasApps} />
    </AuthGuard>
  );
}
