'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Building2, Mail, Users, Calendar, Briefcase, Globe, Ban, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTenants } from '@/lib/hooks/use-tenants';
import { updateAdminTenantStatus } from '@/lib/services/admin.service';
import { EmptyState } from '@/components/ui/empty-state';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  
  const { data, isLoading: loading, isError, refetch } = useTenants();
  const companies = data?.tenants ?? [];

  // Calculate local metrics
  const totalCount = companies.length;
  const activeCount = companies.filter(c => c.onboardingStatus === 'active').length;
  const pendingCount = companies.filter(c => c.onboardingStatus === 'pending').length;
  const suspendedCount = companies.filter(c => c.onboardingStatus === 'suspended' || c.onboardingStatus === 'suspended').length;

  const handleToggleStatus = async (id: string, currentStatus: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setTogglingId(id);
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await updateAdminTenantStatus(id, newStatus);
      toast.success(`Company status updated to ${newStatus}`);
      refetch();
    } catch (err) {
      toast.error('Failed to update company status');
    } finally {
      setTogglingId(null);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && company.onboardingStatus === statusFilter;
  });

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Companies"
          description="Manage tenant organizations, onboarded clients, and billing tiers."
          icon={Building2}
        >
          <Link href="/admin/companies/create">
            <Button className="gap-2 bg-accent hover:bg-accent/90 shadow-md">
              <Plus className="w-4 h-4" />
              Add Company
            </Button>
          </Link>
        </PageHeader>

        {/* Mini stats cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card/50 border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Total</p>
                <h3 className="text-xl font-extrabold text-foreground">{loading ? '...' : totalCount}</h3>
              </div>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Building2 className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Active</p>
                <h3 className="text-xl font-extrabold text-emerald-500">{loading ? '...' : activeCount}</h3>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Pending</p>
                <h3 className="text-xl font-extrabold text-amber-500">{loading ? '...' : pendingCount}</h3>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <Globe className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Suspended</p>
                <h3 className="text-xl font-extrabold text-rose-500">{loading ? '...' : suspendedCount}</h3>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                <Ban className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card/40 border border-border/50 p-4 rounded-xl">
          <div className="flex max-w-sm items-center relative w-full">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search companies by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 bg-secondary/30"
            />
          </div>

          {/* Tab switches */}
          <div className="flex bg-secondary/50 border border-border/60 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {['all', 'active', 'pending', 'suspended'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={cn(
                  "flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap",
                  statusFilter === tab
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-3">
            <span className="w-2 h-2 bg-destructive rounded-full animate-ping" />
            Failed to load companies. Please refresh.
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-card/50 border-border/50">
                <CardHeader className="pb-3 flex flex-row justify-between items-start">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-16" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company) => {
              const isActive = company.onboardingStatus === 'active';
              const isPending = company.onboardingStatus === 'pending';
              const isSuspended = company.onboardingStatus === 'suspended';

              return (
                <Link key={company.id} href={`/admin/companies/${company.id}`} className="group">
                  <Card className="hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-border/60 bg-card/60 hover:border-primary/20 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
                    <div>
                      {/* Top Accent line based on status */}
                      <div className={cn(
                        "h-1 w-full absolute top-0 left-0",
                        isActive ? "bg-emerald-500" : isPending ? "bg-amber-500" : "bg-rose-500"
                      )} />
                      
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 pt-5">
                        <CardTitle className="text-base font-bold flex items-center gap-2 group-hover:text-primary transition-colors text-foreground">
                          <Building2 className="w-4.5 h-4.5 text-muted-foreground shrink-0" />
                          {company.name}
                        </CardTitle>
                        
                        <Badge variant="outline" className={cn(
                          "text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 px-2.5 py-0.5 shadow-sm shrink-0",
                          isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                            isPending ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                              "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            isActive ? "bg-emerald-500 animate-pulse" : isPending ? "bg-amber-500 animate-pulse" : "bg-rose-500"
                          )} />
                          {company.onboardingStatus}
                        </Badge>
                      </CardHeader>

                      <CardContent className="space-y-3.5 pt-1">
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-muted-foreground/80 shrink-0" />
                            <span>Industry: <strong className="text-foreground">{company.industry || 'General'}</strong></span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground/80 shrink-0" />
                            <span className="truncate">Contact: <strong className="text-foreground">{company.contactEmail || 'N/A'}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-muted-foreground/80 shrink-0" />
                            <span>Users: <strong className="text-foreground">{company.userCount || 0}</strong></span>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    <CardContent className="pt-0 pb-4 flex items-center justify-between border-t border-border/40 mt-4 pt-3.5 bg-secondary/10">
                      <span className="text-[10px] text-muted-foreground/80 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 shrink-0" />
                        {new Date(company.createdAt).toLocaleDateString()}
                      </span>

                      {/* Quick inline status switch */}
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={togglingId === company.id}
                        onClick={(e) => handleToggleStatus(company.id, company.onboardingStatus, e)}
                        className={cn(
                          "h-7 text-[10px] font-bold uppercase tracking-wider rounded-lg px-2.5 transition-all gap-1.5 shrink-0 bg-background/80 hover:shadow-sm border border-border/40",
                          isActive ? "text-rose-500 hover:bg-rose-500/10" : "text-emerald-500 hover:bg-emerald-500/10"
                        )}
                      >
                        {togglingId === company.id ? (
                          <Skeleton className="w-12 h-4" />
                        ) : isActive ? (
                          <><Ban className="w-3 h-3 shrink-0" /> Suspend</>
                        ) : (
                          <><CheckCircle className="w-3 h-3 shrink-0" /> Activate</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}

            {filteredCompanies.length === 0 && (
              <div className="col-span-full">
                <EmptyState
                  icon={Building2}
                  title="No companies found"
                  description={searchTerm ? "Try searching for a different keyword or removing status filters." : "Onboard your first company to begin managing tenants."}
                  action={
                    !searchTerm ? (
                      <Link href="/admin/companies/create">
                        <Button className="mt-4 gap-2 bg-primary">
                          <Plus className="w-4 h-4" />
                          Add Company
                        </Button>
                      </Link>
                    ) : undefined
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
