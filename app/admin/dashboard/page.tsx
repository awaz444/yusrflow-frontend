'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Users, AppWindow, CheckCircle2 } from 'lucide-react';
import { useAdminDashboard } from '@/lib/hooks/use-admin-dashboard';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';

export default function AdminDashboardPage() {
  const { data: stats, isLoading: loading, isError, error } = useAdminDashboard();

  return (
    <PageContainer>
      <PageHeader
        title="Super Admin Dashboard"
        description="Overview of system-wide metrics and tenant statistics."
      />

      {isError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive mb-6">
          Failed to load dashboard: {(error as Error)?.message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16 mt-1" /> : <div className="text-2xl font-bold">{stats?.totalCompanies ?? 0}</div>}
            <p className="text-xs text-muted-foreground">Registered tenants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16 mt-1" /> : <div className="text-2xl font-bold">{stats?.activeCompanies ?? 0}</div>}
            <p className="text-xs text-muted-foreground">Currently active tenants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16 mt-1" /> : <div className="text-2xl font-bold">{stats?.totalUsers ?? 0}</div>}
            <p className="text-xs text-muted-foreground">Across all tenants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SaaS Apps</CardTitle>
            <AppWindow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16 mt-1" /> : <div className="text-2xl font-bold">{stats?.totalSaasApps ?? 0}</div>}
            <p className="text-xs text-muted-foreground">Discovered applications</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Companies</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-md" />)}</div>
            ) : !stats?.recentCompanies?.length ? (
              <EmptyState
                icon={Building2}
                title="No companies yet"
                description="No companies have registered yet."
                className="min-h-[200px]"
              />
            ) : (
              <div className="space-y-3">
                {stats.recentCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between rounded-md border border-border p-3"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className="truncate font-medium text-sm text-foreground">
                        {company.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {company.industry ?? 'N/A'} &middot; {company.country ?? 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {company.userCount} user{company.userCount !== 1 ? 's' : ''}
                        {company.contactEmail ? ` · ${company.contactEmail}` : ''}
                      </p>
                    </div>
                    <div className="ml-3 flex flex-col items-end gap-1 shrink-0">
                      <Badge
                        variant={company.isActive ? 'default' : 'secondary'}
                        className="text-xs capitalize"
                      >
                        {company.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      {company.subscriptionTier && (
                        <span className="text-xs text-muted-foreground capitalize">
                          {company.subscriptionTier}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-md" />)}</div>
            ) : !stats?.subscriptionBreakdown?.length ? (
              <p className="text-muted-foreground text-sm">No data available.</p>
            ) : (
              <div className="space-y-2">
                {stats.subscriptionBreakdown.map((item) => (
                  <div
                    key={item.tier}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                  >
                    <span className="text-sm font-medium capitalize text-foreground">
                      {item.tier}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {item.count} tenant{item.count !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
