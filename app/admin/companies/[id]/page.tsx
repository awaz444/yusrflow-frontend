'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building2, Users, Mail, Phone, Loader2, Ban, CheckCircle, Pencil, X, Save } from 'lucide-react';
import { fetchAdminTenantById, updateAdminTenantStatus, fetchFromApi } from '@/lib/services/admin.service';
import { toast } from 'sonner';
import { PageContainer } from '@/components/layout/page-container';

interface TenantDetail {
    id: string;
    name: string;
    industry: string | null;
    country: string | null;
    subscriptionTier: string | null;
    employeeCount: string | null;
    onboardingStatus: 'pending' | 'active' | 'suspended' | 'cancelled';
    contactEmail: string | null;
    contactPhone: string | null;
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
    const [company, setCompany] = useState<TenantDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: '',
        industry: '',
        country: '',
        subscriptionTier: '',
    });

    useEffect(() => {
        if (params.id) fetchCompany(params.id as string);
    }, [params.id]);

    const fetchCompany = async (id: string) => {
        try {
            const data = await fetchAdminTenantById(id);
            setCompany(data as any);
        } catch (error) {
            console.error('Failed to fetch company:', error);
            toast.error('Failed to load company details');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        if (!company) return;
        setEditData({
            name: company.name || '',
            industry: company.industry || '',
            country: company.country || '',
            subscriptionTier: company.subscriptionTier || 'basic',
        });
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        if (!company) return;
        setUpdating(true);
        try {
            await fetchFromApi(`/admin/tenants/${company.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: editData.name,
                    industry: editData.industry,
                    country: editData.country,
                    subscriptionTier: editData.subscriptionTier,
                }),
            });
            toast.success('Company details updated');
            setIsEditing(false);
            fetchCompany(company.id);
        } catch (error) {
            console.error('Failed to update company:', error);
            toast.error('Failed to update company details');
        } finally {
            setUpdating(false);
        }
    };

    const toggleCompanyStatus = async () => {
        if (!company) return;
        setUpdating(true);
        const newStatus = company.onboardingStatus === 'active' ? 'suspended' : 'active';
        try {
            await updateAdminTenantStatus(company.id, newStatus);
            toast.success(`Company ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
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
            <PageContainer>
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </PageContainer>
        );
    }

    if (!company) {
        return (
            <PageContainer>
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Company not found.</p>
                    <Link href="/admin/companies">
                        <Button variant="link">Go back</Button>
                    </Link>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="space-y-6">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/companies">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3 flex-wrap">
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

                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        {!isEditing && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleEdit}
                                className="gap-2 flex-1 sm:flex-none justify-center"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit Details
                            </Button>
                        )}
                        <Button
                            variant={company.onboardingStatus === 'active' ? 'destructive' : 'default'}
                            size="sm"
                            onClick={toggleCompanyStatus}
                            disabled={updating}
                            className="gap-2 flex-1 sm:flex-none justify-center"
                        >
                            {updating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : company.onboardingStatus === 'active' ? (
                                <Ban className="w-4 h-4" />
                            ) : (
                                <CheckCircle className="w-4 h-4" />
                            )}
                            {company.onboardingStatus === 'active' ? 'Suspend Company' : 'Activate Company'}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Company Information Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Company Information
                            </CardTitle>
                            {isEditing && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEditing(false)}
                                        disabled={updating}
                                    >
                                        <X className="w-4 h-4 mr-1" /> Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSaveEdit}
                                        disabled={updating || !editData.name}
                                        className="gap-1"
                                    >
                                        {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="edit-name">Company Name *</Label>
                                        <Input
                                            id="edit-name"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            placeholder="Company name"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="edit-industry">Industry</Label>
                                        <Input
                                            id="edit-industry"
                                            value={editData.industry}
                                            onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                                            placeholder="e.g. Technology, Finance"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="edit-country">Country</Label>
                                        <Input
                                            id="edit-country"
                                            value={editData.country}
                                            onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                                            placeholder="e.g. SA, AE, EG"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="edit-tier">Subscription Tier</Label>
                                        <Select
                                            value={editData.subscriptionTier}
                                            onValueChange={(val) => setEditData({ ...editData, subscriptionTier: val })}
                                        >
                                            <SelectTrigger id="edit-tier">
                                                <SelectValue placeholder="Select tier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="basic">Basic</SelectItem>
                                                <SelectItem value="professional">Professional</SelectItem>
                                                <SelectItem value="enterprise">Enterprise</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Industry</p>
                                        <p className="font-medium">{company.industry || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Country</p>
                                        <p className="font-medium">{company.country || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Subscription</p>
                                        <p className="font-medium capitalize">{company.subscriptionTier || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Employees</p>
                                        <p className="font-medium">{company.employeeCount || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground"><Mail className="w-4 h-4 inline mr-1" />Email</p>
                                        <p className="font-medium truncate">{company.contactEmail || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground"><Phone className="w-4 h-4 inline mr-1" />Phone</p>
                                        <p className="font-medium">{company.contactPhone || 'N/A'}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Users Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Users ({company.users?.length || 0})
                            </CardTitle>
                            <Link href={`/admin/users/create?tenantId=${company.id}`}>
                                <Button size="sm" variant="outline">Add User</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                {company.users && company.users.length > 0 ? (
                                    company.users.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm truncate">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                            <div className="text-right ml-2 shrink-0">
                                                <Badge variant="outline" className="text-xs capitalize">{user.role}</Badge>
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
        </PageContainer>
    );
}
