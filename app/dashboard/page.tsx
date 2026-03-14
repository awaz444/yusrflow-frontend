'use client';

import { DashboardHeader } from '@/components/dashboard/header';
import { StatCard } from '@/components/dashboard/stat-card';
import { ComplianceScores } from '@/components/dashboard/compliance-scores';
import { AlertsSection } from '@/components/dashboard/alerts-section';
import { TopAppsSection } from '@/components/dashboard/top-apps';
import { SpendChart } from '@/components/dashboard/spend-chart';
import { AppSpendList } from '@/components/dashboard/app-spend-list';
import {
  BarChart3,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Loader2
} from 'lucide-react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useTenantDashboard } from '@/lib/hooks/use-tenant-dashboard';

import { useLanguage } from '@/lib/i18n/language-context';

import { NavigationMenu } from '@radix-ui/react-navigation-menu';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { StaggerContainer, StaggerItem } from '@/components/ui/fade-in';

export default function Home() {
  const { t } = useLanguage();
  const { data, isLoading: loading } = useTenantDashboard();

  if (loading) {
    return (
      <AuthGuard>
        <PageContainer>
          <LoadingState message="Loading dashboard..." />
        </PageContainer>
      </AuthGuard>
    );
  }

  if (!data) {
    return (
      <AuthGuard>
        <PageContainer>
          <EmptyState
            icon={AlertTriangle}
            title={t('dashboard.overview.failedLoad') || "Dashboard failed to load"}
            description="We couldn't retrieve your dashboard data."
            className="border-destructive/20 bg-destructive/5"
          />
        </PageContainer>
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
      <PageContainer>
        <PageHeader
          title={`${t('dashboard.overview.welcome')} ${dashboard.tenantName}`}
          description={t('dashboard.overview.subtitle')}
        />

        <StaggerContainer>
          {/* Key Metrics */}
          <StaggerItem>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
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
              <StatCard
                title={t('dashboard.stats.monthlySpend')}
                value={`${dashboard.totalSpend?.toLocaleString() || 0}`}
                unit="SAR"
                icon={<CreditCard className="h-5 w-5" />}
                trend={dashboard.spendTrend}
                description={t('dashboard.stats.spendIncrease')}
              />
            </div>
          </StaggerItem>

          {/* Spend Analysis Row */}
          <StaggerItem>
            <div className="grid gap-6 lg:grid-cols-3 mb-6">
              <div className="lg:col-span-2">
                <SpendChart data={dashboard.spendData || []} />
              </div>
              <div className="lg:col-span-1">
                <AppSpendList apps={dashboard.saasApps || []} />
              </div>
            </div>
          </StaggerItem>

          {/* Compliance & Alerts Row */}
          <StaggerItem>
            <div className="grid gap-6 lg:grid-cols-3 mb-6">
              <div className="lg:col-span-1">
                <ComplianceScores scores={complianceScores} />
              </div>
              <div className="lg:col-span-2">
                <AlertsSection alerts={dashboard.alerts || []} />
              </div>
            </div>
          </StaggerItem>

          {/* Deep Insight Tables */}
          <StaggerItem>
            <div className="grid gap-4 sm:grid-cols-1">
              <TopAppsSection apps={dashboard.saasApps || []} />
            </div>
          </StaggerItem>
        </StaggerContainer>
      </PageContainer>
    </AuthGuard>
  );
}
