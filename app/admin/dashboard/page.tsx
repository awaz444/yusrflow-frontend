'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Users, AppWindow, CheckCircle2 } from 'lucide-react';
import { useAdminDashboard } from '@/lib/hooks/use-admin-dashboard';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { data: stats, isLoading: loading, isError, error } = useAdminDashboard();

  // Helper to get total subscription count
  const totalSubscriptionsCount = stats?.subscriptionBreakdown?.reduce((acc, curr) => acc + curr.count, 0) || 1;

  const statMetrics = [
    {
      title: "Total Companies",
      value: stats?.totalCompanies ?? 0,
      desc: "Registered tenants",
      icon: Building2,
      glowColor: "from-pink-500 to-rose-500 bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/10",
      trend: "+3 new this week"
    },
    {
      title: "Active Companies",
      value: stats?.activeCompanies ?? 0,
      desc: "Currently active tenants",
      icon: CheckCircle2,
      glowColor: "from-emerald-500 to-teal-500 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10",
      trend: `${stats?.totalCompanies ? Math.round((stats.activeCompanies / stats.totalCompanies) * 100) : 0}% active rate`
    },
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      desc: "Across all tenants",
      icon: Users,
      glowColor: "from-blue-500 to-indigo-500 bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/10",
      trend: "Uptime verified"
    },
    {
      title: "Total SaaS Apps",
      value: stats?.totalSaasApps ?? 0,
      desc: "Discovered applications",
      icon: AppWindow,
      glowColor: "from-amber-500 to-orange-500 bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/10",
      trend: "OAuth & API scanning active"
    }
  ];

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <PageHeader
            title="Super Admin Dashboard"
            description="Overview of system-wide metrics and tenant statistics."
          />
          {/* <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20 animate-pulse text-xs">
            ● System Health: Healthy
          </Badge> */}
        </div>

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-destructive animate-ping" />
            Failed to load dashboard: {(error as Error)?.message}
          </div>
        )}

        {/* Dynamic Metric Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i} className="border-border/50 relative overflow-hidden bg-card/60 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            statMetrics.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <Card key={i} className="group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{metric.title}</CardTitle>
                    <div className={cn("p-2 rounded-xl border shadow-sm transition-all duration-300 group-hover:scale-110", metric.glowColor)}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    <div className="text-3xl font-extrabold text-foreground tracking-tight">{metric.value}</div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground">{metric.desc}</span>
                      <span className="font-semibold text-[10px] bg-secondary/80 px-2 py-0.5 rounded-full border border-border/40 text-foreground shrink-0">{metric.trend}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Dashboard Panels */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Recent Companies Column */}
          <Card className="lg:col-span-3 border-border/50 bg-card/40 backdrop-blur-sm shadow-md overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Recent Companies</CardTitle>
                  <p className="text-xs text-muted-foreground">Latest registered organization tenants on the platform.</p>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  Live Feed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
                </div>
              ) : !stats?.recentCompanies?.length ? (
                <EmptyState
                  icon={Building2}
                  title="No companies registered yet"
                  description="Tenant organizations will appear here as soon as they sign up."
                  className="min-h-[250px]"
                />
              ) : (
                <div className="space-y-4">
                  {stats.recentCompanies.map((company, index) => {
                    const initials = company.name ? company.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : 'CO';
                    const gradientIndex = index % 3;
                    const avatarsGradients = [
                      "from-violet-500 to-indigo-500 text-white",
                      "from-sky-500 to-blue-500 text-white",
                      "from-emerald-500 to-teal-500 text-white"
                    ];
                    return (
                      <div
                        key={company.id}
                        className="group flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-4 hover:bg-secondary/40 hover:border-primary/20 transition-all duration-200 shadow-sm"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner shrink-0 bg-gradient-to-tr", avatarsGradients[gradientIndex])}>
                            {initials}
                          </div>
                          <div className="min-w-0 space-y-1">
                            <p className="truncate font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                              {company.name}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">{company.industry ?? 'General'}</span>
                              <span>&middot;</span>
                              <span>{company.country ?? 'SA'}</span>
                              <span>&middot;</span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {company.userCount} user{company.userCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                            {company.contactEmail && (
                              <p className="text-[11px] text-muted-foreground/80 truncate font-mono">
                                {company.contactEmail}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex flex-col items-end gap-1.5 shrink-0">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-sm",
                            company.isActive
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-secondary/80 text-muted-foreground border-border"
                          )}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", company.isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground")} />
                            {company.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {company.subscriptionTier && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded-md">
                              {company.subscriptionTier}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Breakdown Panel */}
          <Card className="lg:col-span-2 border-border/50 bg-card/40 backdrop-blur-sm shadow-md overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-lg font-bold">Subscription Breakdown</CardTitle>
              <p className="text-xs text-muted-foreground">Distribution of billing tiers across tenants.</p>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                </div>
              ) : !stats?.subscriptionBreakdown?.length ? (
                <EmptyState
                  icon={Building2}
                  title="No breakdown data"
                  description="Billing statistics will show once companies sign up."
                  className="min-h-[250px]"
                />
              ) : (
                <div className="space-y-6">
                  {stats.subscriptionBreakdown.map((item, index) => {
                    const percentage = Math.round((item.count / totalSubscriptionsCount) * 100);
                    const colorGradients = [
                      "from-violet-500 to-indigo-500",
                      "from-sky-500 to-blue-500",
                      "from-emerald-500 to-teal-500"
                    ];
                    const borderColors = [
                      "border-violet-500/20",
                      "border-sky-500/20",
                      "border-emerald-500/20"
                    ];
                    const textColors = [
                      "text-violet-500",
                      "text-sky-500",
                      "text-emerald-500"
                    ];
                    const bgColors = [
                      "bg-violet-500/10",
                      "bg-sky-500/10",
                      "bg-emerald-500/10"
                    ];
                    const colorIndex = index % 3;

                    return (
                      <div key={item.tier} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border", textColors[colorIndex], bgColors[colorIndex], borderColors[colorIndex])}>
                            {item.tier}
                          </span>
                          <span className="text-xs font-bold text-foreground">
                            {item.count} tenant{item.count !== 1 ? 's' : ''} ({percentage}%)
                          </span>
                        </div>
                        {/* Custom Progress Bar */}
                        <div className="h-2 w-full bg-secondary/60 rounded-full overflow-hidden border border-border/40">
                          <div
                            className={cn("h-full rounded-full bg-gradient-to-r", colorGradients[colorIndex])}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Summary Card */}
                  <div className="rounded-xl border border-border bg-secondary/15 p-4 mt-8 flex flex-col gap-1 items-center text-center">
                    <p className="text-xs text-muted-foreground">Total Paid Active Subscriptions</p>
                    <p className="text-2xl font-extrabold text-foreground">{totalSubscriptionsCount}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
