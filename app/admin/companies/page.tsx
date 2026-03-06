'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Building2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Tenant {
  id: string;
  name: string;
  industry: string;
  onboardingStatus: 'pending' | 'active' | 'suspended' | 'cancelled';
  contactEmail: string;
  createdAt: string;
  userCount: number;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/admin/tenants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCompanies(data.tenants || []);
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Companies</h1>
          <p className="text-muted-foreground mt-1">Manage all tenant companies</p>
        </div>
        <Link href="/admin/companies/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Company
          </Button>
        </Link>
      </div>

      <div className="flex max-w-sm items-center relative">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
            <div className="col-span-full text-center py-12 text-muted-foreground bg-secondary/20 rounded-lg border border-dashed">
              No companies found. Create one to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
