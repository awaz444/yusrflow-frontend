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

  // ── Single source of truth: use the overall score computed by the backend
  // (same value shown on the Compliance page and in all PDF reports).
  const overallComplianceScore = (dashboard as any).overallComplianceScore ?? 0;

  // Real per-regulation scores from the compliance engine — no client-side offsets
  const regulationScoresRaw: { regulation: string; score: number; trend?: number }[] =
    (dashboard as any).regulationScores || [];

  const getRegScore = (reg: string) =>
    regulationScoresRaw.find(r => r.regulation === reg)?.score ?? overallComplianceScore;

  const complianceScores = {
    overall: overallComplianceScore,
    trend: regulationScoresRaw.find(r => r.regulation === 'PDPL')?.trend ?? 0,
    pdpl:  getRegScore('PDPL'),
    sdaia: getRegScore('SDAIA'),
    nca:   getRegScore('NCA'),
    ndmo:  getRegScore('NDMO'),
  };

  const highRiskApps = dashboard.saasApps.filter(
    (app: any) => app.riskLevel === 'high' || app.riskLevel === 'critical'
  ).length;

  const totalUsers = dashboard.totalUsers || 0;

  // Derive correct labels for conditional stat cards
  const highRiskDescription = highRiskApps > 0
    ? t('dashboard.stats.immediateAttention')
    : t('dashboard.stats.noRiskApps');

  const spendDescription = dashboard.spendTrend > 0
    ? t('dashboard.stats.spendIncrease')
    : dashboard.spendTrend < 0
      ? t('dashboard.stats.spendDecrease')
      : t('dashboard.stats.spendNoChange');

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
                value={`${overallComplianceScore}%`}
                icon={<TrendingUp className="h-5 w-5" />}
                trend={complianceScores.trend}
              />
              <StatCard
                title={t('dashboard.stats.highRiskApps')}
                value={highRiskApps}
                icon={<AlertTriangle className="h-5 w-5" />}
                trend={highRiskApps > 0 ? -2 : undefined}
                description={highRiskDescription}
              />
              <StatCard
                title={t('dashboard.stats.monthlySpend')}
                value={`${dashboard.totalSpend?.toLocaleString() || 0}`}
                unit="SAR"
                icon={<CreditCard className="h-5 w-5" />}
                trend={dashboard.spendTrend !== 0 ? dashboard.spendTrend : undefined}
                description={spendDescription}
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
          <StaggerItem className="w-full min-w-0">
            <div className="grid gap-4 grid-cols-1 w-full min-w-0">
              <TopAppsSection apps={dashboard.saasApps || []} />
            </div>
          </StaggerItem>
        </StaggerContainer>
      </PageContainer>
    </AuthGuard>
  );
}
