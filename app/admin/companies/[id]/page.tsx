'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Users, Mail, Phone, Calendar, Loader2 } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  industry: string;
  country: string;
  onboarding_status: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  users: Array<{
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      is_active: boolean;
  }>;
}

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
        fetchCompany(params.id as string);
    }
  }, [params.id]);

  const fetchCompany = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/admin/tenants/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCompany(data);
      }
    } catch (error) {
      console.error('Failed to fetch company:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
      return (
        <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
  }

  if (!company) {
      return (
          <div className="text-center py-12">
              <p className="text-muted-foreground">Company not found.</p>
              <Link href="/admin/companies">
                  <Button variant="link">Go back</Button>
              </Link>
          </div>
      );
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
          <Link href="/admin/companies">
              <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
              </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                {company.name}
                <Badge variant={company.onboarding_status === 'active' ? 'default' : 'secondary'}>
                    {company.onboarding_status}
                </Badge>
            </h1>
            <p className="text-muted-foreground text-sm">Created on {new Date(company.created_at).toLocaleDateString()}</p>
          </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Company Information
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                          <p className="text-muted-foreground">Industry</p>
                          <p className="font-medium">{company.industry || 'N/A'}</p>
                      </div>
                      <div>
                          <p className="text-muted-foreground">Country</p>
                          <p className="font-medium">{company.country || 'N/A'}</p>
                      </div>
                      <div>
                          <p className="text-muted-foreground"><Mail className="w-4 h-4 inline mr-1"/> Email</p>
                          <p className="font-medium">{company.contact_email || 'N/A'}</p>
                      </div>
                      <div>
                          <p className="text-muted-foreground"><Phone className="w-4 h-4 inline mr-1"/> Phone</p>
                          <p className="font-medium">{company.contact_phone || 'N/A'}</p>
                      </div>
                  </div>
              </CardContent>
          </Card>

          <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                   <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Users
                  </CardTitle>
                  <Link href={`/admin/users/create?tenantId=${company.id}`}>
                    <Button size="sm" variant="outline">Add User</Button>
                  </Link>
              </CardHeader>
              <CardContent>
                  <div className="space-y-3">
                      {company.users && company.users.length > 0 ? (
                          company.users.map(user => (
                              <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                                  <div>
                                      <p className="font-medium text-sm">{user.first_name} {user.last_name}</p>
                                      <p className="text-xs text-muted-foreground">{user.email}</p>
                                  </div>
                                  <div className="text-right">
                                      <Badge variant="outline" className="text-xs">{user.role}</Badge>
                                  </div>
                              </div>
                          ))
                      ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">No users found.</p>
                      )}
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
