'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  Users,
  Loader2,
  MoreHorizontal,
  KeyRound,
  Trash2,
  Building2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Copy,
  Check,
  Mail,
  Calendar,
  Briefcase,
} from 'lucide-react';
import { useAdminUsers } from '@/lib/hooks/use-admin-users';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { API_BASE_URL } from '@/lib/api';

interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isActive: boolean | null;
  lastLogin: string | null;
  createdAt: string;
  tenantId: string | null;
  tenantName?: string | null;
}

interface ResetPasswordState {
  userId: string;
  userEmail: string;
  newPassword: string;
  showPassword: boolean;
  loading: boolean;
  error: string;
  success: string;
}

interface DeleteState {
  userId: string;
  userEmail: string;
  loading: boolean;
}

interface CredentialsState {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    department: string | null;
    jobTitle: string | null;
    isActive: boolean | null;
    lastLogin: string | null;
    createdAt: string;
    tenant: { id: string; name: string; industry: string | null } | null;
  } | null;
  loading: boolean;
  error: string;
  copied: boolean;
}

function UsersPageContent() {
  const searchParams = useSearchParams();
  const tenantIdFilter = searchParams.get('tenantId') ?? undefined;

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTenants, setExpandedTenants] = useState<Set<string>>(new Set());
  const [resetDialog, setResetDialog] = useState<ResetPasswordState | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteState | null>(null);
  const [credentialsDialog, setCredentialsDialog] = useState<CredentialsState | null>(null);

  const { data: usersData, isLoading: usersLoading, isError, refetch } = useAdminUsers(
    tenantIdFilter ? { tenantId: tenantIdFilter } : undefined
  );

  // Auto-expand all tenant groups when data first loads
  const allUsers = usersData?.users ?? [];
  useEffect(() => {
    if (allUsers.length > 0 && expandedTenants.size === 0) {
      const ids = new Set<string>(allUsers.map((u: AdminUser) => u.tenantId ?? '__no_tenant__'));
      setExpandedTenants(ids);
    }
  }, [allUsers.length]);


  // Group users by tenant
  const groupedByTenant = (() => {
    const groups: Record<string, { tenantName: string; users: AdminUser[] }> = {};

    allUsers.forEach((user: AdminUser) => {
      const tenantId = user.tenantId ?? '__no_tenant__';
      const tenantName = user.tenantName ?? (tenantId === '__no_tenant__' ? 'No Company' : tenantId);
      if (!groups[tenantId]) {
        groups[tenantId] = { tenantName, users: [] };
      }
      const emailMatch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const nameMatch = `${user.firstName ?? ''} ${user.lastName ?? ''}`.toLowerCase().includes(searchTerm.toLowerCase());
      if (!searchTerm || emailMatch || nameMatch) {
        groups[tenantId].users.push(user);
      }
    });

    // Remove empty groups from search filter
    return Object.entries(groups).filter(([, g]) => g.users.length > 0);
  })();

  // Local metric definitions
  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter(u => u.isActive).length;
  const adminUsers = allUsers.filter(u => u.role === 'admin').length;
  const companyGroups = groupedByTenant.length;

  const toggleTenant = (tenantId: string) => {
    setExpandedTenants(prev => {
      const next = new Set(prev);
      if (next.has(tenantId)) next.delete(tenantId);
      else next.add(tenantId);
      return next;
    });
  };

  const openResetDialog = (user: AdminUser) => {
    setResetDialog({
      userId: user.id,
      userEmail: user.email,
      newPassword: '',
      showPassword: false,
      loading: false,
      error: '',
      success: '',
    });
  };

  const openCredentialsDialog = async (user: AdminUser) => {
    setCredentialsDialog({ user: null, loading: true, error: '', copied: false });
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/admin/users/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCredentialsDialog({ user: data, loading: false, error: '', copied: false });
      } else {
        setCredentialsDialog({ user: null, loading: false, error: data.message || 'Failed to load user details.', copied: false });
      }
    } catch {
      setCredentialsDialog({ user: null, loading: false, error: 'An error occurred.', copied: false });
    }
  };

  const copyEmail = () => {
    if (!credentialsDialog?.user) return;
    navigator.clipboard.writeText(credentialsDialog.user.email);
    setCredentialsDialog(p => p && ({ ...p, copied: true }));
    setTimeout(() => setCredentialsDialog(p => p && ({ ...p, copied: false })), 2000);
  };

  const handleResetPassword = async () => {
    if (!resetDialog) return;
    if (resetDialog.newPassword.length < 6) {
      setResetDialog(p => p && ({ ...p, error: 'Password must be at least 6 characters.' }));
      return;
    }
    setResetDialog(p => p && ({ ...p, loading: true, error: '', success: '' }));
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/admin/users/${resetDialog.userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ newPassword: resetDialog.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetDialog(p => p && ({ ...p, loading: false, success: 'Password reset successfully!', newPassword: '' }));
      } else {
        setResetDialog(p => p && ({ ...p, loading: false, error: data.message || 'Failed to reset password.' }));
      }
    } catch {
      setResetDialog(p => p && ({ ...p, loading: false, error: 'An error occurred.' }));
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteDialog) return;
    setDeleteDialog(p => p && ({ ...p, loading: true }));
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/admin/users/${deleteDialog.userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setDeleteDialog(null);
        refetch();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete user');
        setDeleteDialog(p => p && ({ ...p, loading: false }));
      }
    } catch {
      setDeleteDialog(p => p && ({ ...p, loading: false }));
    }
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Users"
          description={tenantIdFilter ? 'Managing users for selected company' : 'All platform users grouped by company'}
          icon={Users}
        >
          <Link href={`/admin/users/create${tenantIdFilter ? `?tenantId=${tenantIdFilter}` : ''}`}>
            <Button className="gap-2 bg-accent hover:bg-accent/90 shadow-md">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </Link>
        </PageHeader>

        {/* Directory statistics overview */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card/50 border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Total Users</p>
                <h3 className="text-xl font-extrabold text-foreground">{usersLoading ? '...' : totalUsers}</h3>
              </div>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Users className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Active Users</p>
                <h3 className="text-xl font-extrabold text-emerald-500">{usersLoading ? '...' : activeUsers}</h3>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Tenant Groups</p>
                <h3 className="text-xl font-extrabold text-amber-500">{usersLoading ? '...' : companyGroups}</h3>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <Building2 className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Administrators</p>
                <h3 className="text-xl font-extrabold text-blue-500">{usersLoading ? '...' : adminUsers}</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex max-w-sm items-center relative bg-card/40 border border-border/50 p-4 rounded-xl">
          <Search className="absolute left-7 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 bg-secondary/35"
          />
        </div>

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-destructive animate-ping" />
            Failed to load users. Please refresh the page.
          </div>
        )}

        {/* Grouped by tenant */}
        {usersLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-border/60 bg-card/40">
                <CardHeader className="pb-3">
                  <Skeleton className="h-5 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex gap-4">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : groupedByTenant.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description={searchTerm ? 'No users matched your search criteria.' : 'No users exist yet.'}
          />
        ) : (
          <div className="space-y-5">
            {groupedByTenant.map(([tenantId, group]) => {
              const isExpanded = expandedTenants.has(tenantId);
              return (
                <Card key={tenantId} className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 shadow-sm">
                  {/* Company Header (clickable to collapse) */}
                  <button
                    onClick={() => toggleTenant(tenantId)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-secondary/20 transition-colors border-b border-border/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-secondary/80 border border-border/50 text-muted-foreground group-hover:text-primary transition-colors">
                        <Building2 className="w-4.5 h-4.5 shrink-0" />
                      </div>
                      <div>
                        <span className="font-bold text-foreground block text-sm sm:text-base">{group.tenantName}</span>
                        <span className="text-[10px] text-muted-foreground block font-mono">ID: {tenantId === '__no_tenant__' ? 'N/A' : tenantId}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-secondary/80 border border-border/60 text-foreground shrink-0 ml-1">
                        {group.users.length} user{group.users.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isExpanded
                        ? <ChevronDown className="w-4.5 h-4.5 text-muted-foreground transition-transform" />
                        : <ChevronRight className="w-4.5 h-4.5 text-muted-foreground transition-transform" />
                      }
                    </div>
                  </button>

                  {/* Users Table */}
                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[700px] text-left">
                        <thead>
                          <tr className="border-b border-border/40 bg-secondary/15 text-xs uppercase tracking-wider text-muted-foreground">
                            <th className="h-10 px-6 font-semibold">Name</th>
                            <th className="h-10 px-6 font-semibold">Email</th>
                            <th className="h-10 px-6 font-semibold">Role</th>
                            <th className="h-10 px-6 font-semibold">Status</th>
                            <th className="h-10 px-6 font-semibold">Joined</th>
                            <th className="h-10 px-6 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {group.users.map((user) => {
                            const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
                            return (
                              <tr key={user.id} className="hover:bg-secondary/20 transition-colors last:border-0">
                                <td className="px-6 py-4 font-medium flex items-center gap-3 whitespace-nowrap">
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary/25 to-violet-400/25 text-primary flex items-center justify-center text-xs font-bold shadow-sm">
                                    {initials}
                                  </div>
                                  <span className="font-semibold text-foreground">
                                    {user.firstName || user.lastName
                                      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                                      : <span className="text-muted-foreground italic">No name</span>
                                    }
                                  </span>
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
                                <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-secondary">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-52 rounded-xl">
                                      <DropdownMenuItem
                                        onClick={() => openCredentialsDialog(user)}
                                        className="gap-2 cursor-pointer text-xs"
                                      >
                                        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                                        View Credentials
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => openResetDialog(user)}
                                        className="gap-2 cursor-pointer text-xs"
                                      >
                                        <KeyRound className="w-4 h-4 text-muted-foreground" />
                                        Reset Password
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => setDeleteDialog({ userId: user.id, userEmail: user.email, loading: false })}
                                        className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Delete User
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* View Credentials Dialog */}
      <Dialog open={!!credentialsDialog} onOpenChange={(open) => { if (!open) setCredentialsDialog(null); }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <ShieldCheck className="w-5 h-5 text-accent" />
              User Credentials
            </DialogTitle>
            <DialogDescription className="text-xs">
              Account details for this user. Only admins can view this information.
            </DialogDescription>
          </DialogHeader>

          {credentialsDialog?.loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          )}

          {credentialsDialog?.error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {credentialsDialog.error}
            </div>
          )}

          {credentialsDialog?.user && (
            <div className="space-y-4 py-1">
              {/* Email row with copy */}
              <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-4 h-4 text-accent shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Email</p>
                      <p className="text-sm font-mono font-medium text-foreground truncate">{credentialsDialog.user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-lg border border-border hover:bg-secondary/50 font-bold"
                  >
                    {credentialsDialog.copied
                      ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied!</>
                      : <><Copy className="w-3.5 h-3.5" /> Copy</>
                    }
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-border/40">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Role</p>
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-accent/10 text-accent capitalize">
                      {credentialsDialog.user.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Status</p>
                    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded ${
                      credentialsDialog.user.isActive ? 'bg-green-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                      {credentialsDialog.user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-border bg-secondary/10 p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Full Name</p>
                  <p className="font-semibold text-foreground">
                    {[credentialsDialog.user.firstName, credentialsDialog.user.lastName].filter(Boolean).join(' ') || '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/10 p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Company</p>
                  <p className="font-semibold text-foreground">{credentialsDialog.user.tenant?.name || '—'}</p>
                </div>
                {credentialsDialog.user.department && (
                  <div className="rounded-xl border border-border bg-secondary/10 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Department</p>
                    <p className="font-semibold text-foreground">{credentialsDialog.user.department}</p>
                  </div>
                )}
                {credentialsDialog.user.jobTitle && (
                  <div className="rounded-xl border border-border bg-secondary/10 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Job Title</p>
                    <p className="font-semibold text-foreground">{credentialsDialog.user.jobTitle}</p>
                  </div>
                )}
                <div className="rounded-xl border border-border bg-secondary/10 p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Last Login</p>
                  <p className="font-semibold text-foreground">
                    {credentialsDialog.user.lastLogin
                      ? new Date(credentialsDialog.user.lastLogin).toLocaleDateString()
                      : 'Never'}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/10 p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Joined</p>
                  <p className="font-semibold text-foreground">
                    {new Date(credentialsDialog.user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl text-xs font-bold" onClick={() => setCredentialsDialog(null)}>
              Close
            </Button>
            {credentialsDialog?.user && (
              <Button
                className="gap-2 rounded-xl text-xs font-bold bg-accent"
                onClick={() => {
                  const u = credentialsDialog.user!;
                  setCredentialsDialog(null);
                  openResetDialog({ id: u.id, email: u.email } as AdminUser);
                }}
              >
                <KeyRound className="w-4 h-4" />
                Reset Password
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetDialog} onOpenChange={(open) => { if (!open) setResetDialog(null); }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <KeyRound className="w-5 h-5 text-accent" />
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-xs">
              Set a new password for <span className="font-semibold text-foreground">{resetDialog?.userEmail}</span>.
              No current password needed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {resetDialog?.error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {resetDialog.error}
              </div>
            )}
            {resetDialog?.success && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-400">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {resetDialog.success}
              </div>
            )}
            {!resetDialog?.success && (
              <div className="space-y-2">
                <Label htmlFor="new-password-admin" className="text-xs font-bold">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password-admin"
                    type={resetDialog?.showPassword ? 'text' : 'password'}
                    value={resetDialog?.newPassword ?? ''}
                    onChange={(e) => setResetDialog(p => p && ({ ...p, newPassword: e.target.value }))}
                    placeholder="Min. 6 characters"
                    className="pr-10 rounded-xl bg-secondary/35"
                    disabled={resetDialog?.loading}
                  />
                  <button
                    type="button"
                    onClick={() => setResetDialog(p => p && ({ ...p, showPassword: !p.showPassword }))}
                    className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-muted-foreground hover:text-foreground"
                  >
                    {resetDialog?.showPassword
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl text-xs font-bold" onClick={() => setResetDialog(null)} disabled={resetDialog?.loading}>
              {resetDialog?.success ? 'Close' : 'Cancel'}
            </Button>
            {!resetDialog?.success && (
              <Button
                onClick={handleResetPassword}
                disabled={resetDialog?.loading || !resetDialog?.newPassword}
                className="gap-2 rounded-xl text-xs font-bold bg-accent"
              >
                {resetDialog?.loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Reset Password
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={(open) => { if (!open) setDeleteDialog(null); }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-destructive">
              <Trash2 className="w-5 h-5 text-destructive" />
              Delete User
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to deactivate <span className="font-semibold text-foreground">{deleteDialog?.userEmail}</span>? This action cannot be easily undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl text-xs font-bold" onClick={() => setDeleteDialog(null)} disabled={deleteDialog?.loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleteDialog?.loading}
              className="gap-2 rounded-xl text-xs font-bold"
            >
              {deleteDialog?.loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <UsersPageContent />
    </Suspense>
  );
}
