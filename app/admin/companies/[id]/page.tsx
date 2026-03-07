'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Users, Mail, Phone, Calendar, Loader2, Ban, CheckCircle } from 'lucide-react';
import { updateAdminTenantStatus } from '@/lib/services/admin.service';
import { toast } from 'sonner';

interface Tenant {
    id: string;
    name: string;
    industry: string;
    country: string;
    onboardingStatus: 'pending' | 'active' | 'suspended' | 'cancelled';
    contactEmail: string;
    contactPhone: string;
    createdAt: string;
    users: Array<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        isActive: boolean;
    }>;
}

export default function CompanyDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [company, setCompany] = useState<Tenant | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

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

    const toggleCompanyStatus = async () => {
        if (!company) return;

        setUpdating(true);
        const newStatus = company.onboardingStatus === 'active' ? 'suspended' : 'active';

        try {
            await updateAdminTenantStatus(company.id, newStatus);
            toast.success(`Company ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
            fetchCompany(company.id);
        } catch (error) {
            console.error('Failed to update company status:', error);
            toast.error('Failed to update company status');
        } finally {
            setUpdating(false);
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/companies">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            {company.name}
                            <Badge variant={
                                company.onboardingStatus === 'active' ? 'default' :
                                    company.onboardingStatus === 'suspended' ? 'destructive' : 'secondary'
                            }>
                                {company.onboardingStatus}
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground text-sm">Created on {new Date(company.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <Button
                    variant={company.onboardingStatus === 'active' ? 'destructive' : 'default'}
                    size="sm"
                    onClick={toggleCompanyStatus}
                    disabled={updating}
                    className="gap-2"
                >
                    {updating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : company.onboardingStatus === 'active' ? (
                        <Ban className="w-4 h-4" />
                    ) : (
                        <CheckCircle className="w-4 h-4" />
                    )}
                    {company.onboardingStatus === 'active' ? 'Block Company' : 'Activate Company'}
                </Button>
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
                                <p className="text-muted-foreground"><Mail className="w-4 h-4 inline mr-1" /> Email</p>
                                <p className="font-medium">{company.contactEmail || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground"><Phone className="w-4 h-4 inline mr-1" /> Phone</p>
                                <p className="font-medium">{company.contactPhone || 'N/A'}</p>
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
                                            <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
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
