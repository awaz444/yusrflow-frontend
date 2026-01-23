'use client';

import { DashboardHeader } from '@/components/dashboard/header';
import { StatCard } from '@/components/dashboard/stat-card';
import { ComplianceScores } from '@/components/dashboard/compliance-scores';
import { AlertsSection } from '@/components/dashboard/alerts-section';
import { TopAppsSection } from '@/components/dashboard/top-apps';
import { SpendChart } from '@/components/dashboard/spend-chart';
import { mockSaasApps, mockTenant } from '@/lib/mockData';
import {
  BarChart3,
  AlertTriangle,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

export default function Home() {
  const totalMonthlySpend = mockSaasApps.reduce(
    (sum, app) => sum + app.monthlySpend,
    0
  );
  const averageComplianceScore =
    Math.round(
      mockSaasApps.reduce((sum, app) => sum + app.complianceScore, 0) /
        mockSaasApps.length
    ) || 0;
  const highRiskApps = mockSaasApps.filter(
    (app) => app.riskLevel === 'high' || app.riskLevel === 'critical'
  ).length;
  const totalUsers = mockSaasApps.reduce((sum, app) => sum + app.users, 0);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="px-6 py-8">
        {/* Tenant Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Welcome to {mockTenant.name}
          </h2>
          <p className="text-muted-foreground mt-1">
            Real-time compliance monitoring and SaaS management dashboard
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard
            title="Total SaaS Apps"
            value={mockSaasApps.length}
            icon={<BarChart3 className="h-5 w-5" />}
            description="Applications in use"
          />
          <StatCard
            title="Monthly Spend"
            value={`${(totalMonthlySpend / 1000).toFixed(0)}k`}
            unit="SAR"
            icon={<DollarSign className="h-5 w-5" />}
            trend={8}
          />
          <StatCard
            title="Avg Compliance"
            value={`${averageComplianceScore}%`}
            icon={<TrendingUp className="h-5 w-5" />}
            trend={5}
          />
          <StatCard
            title="High Risk Apps"
            value={highRiskApps}
            icon={<AlertTriangle className="h-5 w-5" />}
            trend={-2}
            description="Immediate attention"
          />
        </div>

        {/* Compliance & Alerts Row */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          <ComplianceScores />
          <AlertsSection />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <SpendChart />
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Users</span>
                <span className="font-bold text-foreground">{totalUsers}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Compliant Apps
                </span>
                <span className="font-bold text-green-400">
                  {mockSaasApps.filter((a) => a.status === 'compliant').length}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Partial Compliance
                </span>
                <span className="font-bold text-yellow-400">
                  {mockSaasApps.filter((a) => a.status === 'partial').length}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Non-Compliant
                </span>
                <span className="font-bold text-red-400">
                  {mockSaasApps.filter((a) => a.status === 'non_compliant').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Applications Table */}
        <TopAppsSection />
      </main>
    </div>
  );
}
