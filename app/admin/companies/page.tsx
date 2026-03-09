'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTenants } from '@/lib/hooks/use-tenants';
import { EmptyState } from '@/components/ui/empty-state';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading: loading, isError } = useTenants();
  const companies = data?.tenants ?? [];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <PageHeader
        title="Companies"
        description="Manage all tenant companies"
        icon={Building2}
      >
        <Link href="/admin/companies/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Company
          </Button>
        </Link>
      </PageHeader>

      <div className="flex max-w-sm items-center relative mb-6">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9"
        />
      </div>

      {isError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive mb-6">
          Failed to load companies. Please try again.
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Link key={company.id} href={`/admin/companies/${company.id}`}>
              <Card className="hover:bg-accent/5 transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    {company.name}
                  </CardTitle>
                  <Badge variant={
                    company.onboardingStatus === 'active' ? 'default' :
                      company.onboardingStatus === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {company.onboardingStatus}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground mt-2">
                    <p>Industry: {company.industry || 'N/A'}</p>
                    <p>Contact: {company.contactEmail || 'N/A'}</p>
                    <p>Users: {company.userCount || 0}</p>
                    <p className="text-xs pt-2">Created: {new Date(company.createdAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {filteredCompanies.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                icon={Building2}
                title="No companies found"
                description={searchTerm ? "No companies matched your search criteria." : "Create your first company to get started."}
                action={
                  !searchTerm ? (
                    <Link href="/admin/companies/create">
                      <Button className="mt-4 gap-2">
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
    </PageContainer>
  );
}
