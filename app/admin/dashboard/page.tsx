'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, AppWindow, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchFromApi } from '@/lib/api';

interface RecentCompany {
  id: string;
  name: string;
  industry: string | null;
  country: string | null;
  subscriptionTier: string | null;
  isActive: boolean | null;
  onboardingStatus: string | null;
  contactEmail: string | null;
  userCount: number;
  createdAt: string | null;
}

interface SubscriptionBreakdown {
  tier: string;
  count: number;
}

interface DashboardStats {
  totalCompanies: number;
  activeCompanies: number;
  totalUsers: number;
  totalSaasApps: number;
  recentCompanies: RecentCompany[];
  subscriptionBreakdown: SubscriptionBreakdown[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFromApi('/admin/dashboard')
      .then((data: DashboardStats) => setStats(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Super Admin Dashboard</h1>

      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading dashboard data...</span>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          Failed to load dashboard: {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '--' : stats?.totalCompanies ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">Registered tenants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '--' : stats?.activeCompanies ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">Currently active tenants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '--' : stats?.totalUsers ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">Across all tenants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SaaS Apps</CardTitle>
            <AppWindow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '--' : stats?.totalSaasApps ?? 0}
            </div>
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
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : !stats?.recentCompanies?.length ? (
              <p className="text-muted-foreground text-sm">No companies yet.</p>
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
              <p className="text-muted-foreground text-sm">Loading...</p>
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
    </div>
  );
}
