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
    const [activeTab, setActiveTab] = useState('overview');
    const [userSearch, setUserSearch] = useState('');
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
        setActiveTab('settings');
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
            setActiveTab('overview');
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

    // Filter company users locally
    const filteredUsers = company.users?.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase())
    ) ?? [];

    const isActive = company.onboardingStatus === 'active';

    return (
        <PageContainer>
            <div className="space-y-6">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/40 border border-border/50 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/companies">
                            <Button variant="ghost" size="icon" className="hover:bg-secondary rounded-xl transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-3 flex-wrap">
                                {company.name}
                                <Badge variant="outline" className={cn(
                                  "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 shadow-sm shrink-0",
                                  isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                    company.onboardingStatus === 'pending' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                      "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                )}>
                                  <span className={cn(
                                    "w-1.5 h-1.5 rounded-full shrink-0 mr-1.5",
                                    isActive ? "bg-emerald-500 animate-pulse" : company.onboardingStatus === 'pending' ? "bg-amber-500 animate-pulse" : "bg-rose-500"
                                  )} />
                                  {company.onboardingStatus}
                                </Badge>
                            </h1>
                            <p className="text-muted-foreground text-xs mt-1">ID: <span className="font-mono">{company.id}</span> &middot; Created on {new Date(company.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <Button
                            variant={isActive ? 'destructive' : 'default'}
                            size="sm"
                            onClick={toggleCompanyStatus}
                            disabled={updating}
                            className="gap-2 justify-center shadow-sm h-9 px-4 rounded-xl"
                        >
                            {updating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isActive ? (
                                <Ban className="w-4 h-4" />
                            ) : (
                                <CheckCircle className="w-4 h-4" />
                            )}
                            {isActive ? 'Suspend Company' : 'Activate Company'}
                        </Button>
                    </div>
                </div>

                {/* Tab layout switches */}
                <div className="flex border-b border-border/50 gap-6">
                    {['overview', 'users', 'settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                if (tab !== 'settings') setIsEditing(false);
                                setActiveTab(tab);
                            }}
                            className={cn(
                                "pb-3 text-sm font-semibold capitalize transition-all relative",
                                activeTab === tab
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab === 'users' ? 'User Directory' : tab === 'settings' ? 'Actions & Settings' : tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-in fade-in zoom-in-50 duration-200" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content Rendering */}
                <div className="mt-6">
                    {activeTab === 'overview' && (
                        <div className="grid gap-6 md:grid-cols-5">
                            {/* Left details grid */}
                            <Card className="md:col-span-3 border-border/50 bg-card/60 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-muted-foreground" />
                                        Company Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Industry</p>
                                        <p className="font-bold text-foreground bg-secondary/35 p-2.5 rounded-xl border border-border/30">{company.industry || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Country</p>
                                        <p className="font-bold text-foreground bg-secondary/35 p-2.5 rounded-xl border border-border/30">{company.country || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Employee Size</p>
                                        <p className="font-bold text-foreground bg-secondary/35 p-2.5 rounded-xl border border-border/30">{company.employeeCount || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Contact Email</p>
                                        <p className="font-bold text-foreground bg-secondary/35 p-2.5 rounded-xl border border-border/30 truncate" title={company.contactEmail || ''}>
                                            {company.contactEmail ? (
                                                <a href={`mailto:${company.contactEmail}`} className="flex items-center gap-1.5 text-primary hover:underline">
                                                    <Mail className="w-3.5 h-3.5 shrink-0" />
                                                    {company.contactEmail}
                                                </a>
                                            ) : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Contact Phone</p>
                                        <p className="font-bold text-foreground bg-secondary/35 p-2.5 rounded-xl border border-border/30">{company.contactPhone || 'N/A'}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Right billing details */}
                            <div className="md:col-span-2 space-y-6">
                                <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            <Users className="w-5 h-5 text-muted-foreground" />
                                            Directory Overview
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center bg-secondary/20 p-3 rounded-xl border border-border/40">
                                            <span className="text-xs font-semibold text-muted-foreground">Total Users</span>
                                            <span className="text-lg font-extrabold text-foreground">{company.users?.length || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-secondary/20 p-3 rounded-xl border border-border/40">
                                            <span className="text-xs font-semibold text-muted-foreground">Active Admins</span>
                                            <span className="text-sm font-bold text-primary">
                                                {company.users?.filter(u => u.role === 'admin').length || 0}
                                            </span>
                                        </div>
                                        <Button
                                            onClick={() => setActiveTab('users')}
                                            className="w-full text-xs font-bold rounded-xl h-9"
                                            variant="outline"
                                        >
                                            View Directory List
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/50 bg-card/60 backdrop-blur-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
                                    <CardHeader>
                                        <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground">Subscription Tier</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-extrabold capitalize text-foreground">{company.subscriptionTier || 'Pilot'}</span>
                                            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                Active
                                            </span>
                                        </div>
                                        {/* Progress representation */}
                                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full" style={{
                                                width: company.subscriptionTier === 'enterprise' ? '100%' :
                                                       company.subscriptionTier === 'professional' ? '70%' : '35%'
                                            }} />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground">
                                            {company.subscriptionTier === 'enterprise' ? 'Unlimited connections enabled' : 'Standard limitations applied'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-bold">User Directory</CardTitle>
                                    <p className="text-xs text-muted-foreground">Managing users associated with {company.name}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative max-w-xs">
                                        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                                        <Input
                                            placeholder="Search directory..."
                                            value={userSearch}
                                            onChange={(e) => setUserSearch(e.target.value)}
                                            className="h-8.5 pl-8 bg-secondary/35 text-xs rounded-lg"
                                        />
                                    </div>
                                    <Link href={`/admin/users/create?tenantId=${company.id}`}>
                                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs font-bold rounded-lg h-8.5">Add User</Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-secondary/20 text-xs uppercase tracking-wider text-muted-foreground border-b border-border/40">
                                            <tr>
                                                <th className="px-6 py-3 font-semibold">User</th>
                                                <th className="px-6 py-3 font-semibold">Email</th>
                                                <th className="px-6 py-3 font-semibold">Role</th>
                                                <th className="px-6 py-3 font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/30">
                                            {filteredUsers.length > 0 ? (
                                                filteredUsers.map(user => {
                                                    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
                                                    return (
                                                        <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                                                            <td className="px-6 py-4 font-medium flex items-center gap-3 whitespace-nowrap">
                                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary/20 to-violet-400/20 text-primary flex items-center justify-center text-xs font-bold shadow-sm">
                                                                    {initials}
                                                                </div>
                                                                <span className="text-foreground font-semibold">{user.firstName} {user.lastName}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{user.email}</td>
                                                            <td className="px-6 py-4">
                                                                <Badge variant="outline" className={cn(
                                                                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                                                                    user.role === 'admin' ? "bg-primary/5 text-primary border-primary/20" : "bg-secondary text-muted-foreground border-border/60"
                                                                )}>
                                                                    {user.role}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Badge variant={user.isActive ? 'default' : 'secondary'} className="text-[10px] font-semibold px-2 py-0.5 rounded">
                                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="text-center py-8 text-sm text-muted-foreground">
                                                        No users found in directory.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'settings' && (
                        <div className="grid gap-6 md:grid-cols-5">
                            {/* Edit Details */}
                            <Card className="md:col-span-3 border-border/50 bg-card/60 backdrop-blur-sm">
                                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
                                    <div>
                                        <CardTitle className="text-lg font-bold">Edit Company Details</CardTitle>
                                        <p className="text-xs text-muted-foreground">Configure tenant metadata information.</p>
                                    </div>
                                    {!isEditing && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleEdit}
                                            className="rounded-xl h-8.5 font-bold text-xs"
                                        >
                                            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {isEditing ? (
                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-name" className="text-xs font-bold text-foreground">Company Name *</Label>
                                                <Input
                                                    id="edit-name"
                                                    value={editData.name}
                                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                    placeholder="Company name"
                                                    className="rounded-xl bg-secondary/30"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-industry" className="text-xs font-bold text-foreground">Industry</Label>
                                                    <Input
                                                        id="edit-industry"
                                                        value={editData.industry}
                                                        onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                                                        placeholder="e.g. Technology, Finance"
                                                        className="rounded-xl bg-secondary/30"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-country" className="text-xs font-bold text-foreground">Country</Label>
                                                    <Input
                                                        id="edit-country"
                                                        value={editData.country}
                                                        onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                                                        placeholder="e.g. SA, AE, EG"
                                                        className="rounded-xl bg-secondary/30"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-tier" className="text-xs font-bold text-foreground">Subscription Tier</Label>
                                                <Select
                                                    value={editData.subscriptionTier}
                                                    onValueChange={(val) => setEditData({ ...editData, subscriptionTier: val })}
                                                >
                                                    <SelectTrigger id="edit-tier" className="rounded-xl bg-secondary/30">
                                                        <SelectValue placeholder="Select tier" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="basic">Basic</SelectItem>
                                                        <SelectItem value="professional">Professional</SelectItem>
                                                        <SelectItem value="enterprise">Enterprise</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex justify-end gap-2.5 pt-4">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setIsEditing(false)}
                                                    disabled={updating}
                                                    className="rounded-xl text-xs font-bold h-9"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleSaveEdit}
                                                    disabled={updating || !editData.name}
                                                    className="bg-primary hover:bg-primary/90 rounded-xl text-xs font-bold h-9 px-4"
                                                >
                                                    {updating && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-secondary/20 rounded-xl border border-border/40 text-sm text-muted-foreground text-center">
                                            Click the <strong>Edit</strong> button above to modify the company profile properties.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Danger Zone */}
                            <Card className="md:col-span-2 border-red-500/20 bg-red-500/5 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-base font-bold text-red-500 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                        Danger Zone
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-xs">
                                    <div className="space-y-1 text-muted-foreground">
                                        <p className="font-semibold text-foreground">Suspend Account</p>
                                        <p>Suspending this tenant company will immediately revoke access for all associated users. The company configuration will be read-only until reactivated.</p>
                                    </div>
                                    <Button
                                        variant={isActive ? 'destructive' : 'default'}
                                        onClick={toggleCompanyStatus}
                                        disabled={updating}
                                        className="w-full text-xs font-bold rounded-xl h-9"
                                    >
                                        {updating ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                                        ) : isActive ? (
                                            <><Ban className="w-4 h-4 mr-1.5" /> Suspend Company</>
                                        ) : (
                                            <><CheckCircle className="w-4 h-4 mr-1.5" /> Activate Company</>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
