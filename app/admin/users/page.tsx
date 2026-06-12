'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
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
  first_name: string | null;
  last_name: string | null;
  role: string;
  is_active: boolean | null;
  last_login_at: string | null;
  created_at: string;
  tenant_id: string | null;
  tenant?: { name: string } | null;
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
      const ids = new Set<string>(allUsers.map((u: AdminUser) => u.tenant_id ?? '__no_tenant__'));
      setExpandedTenants(ids);
    }
  }, [allUsers.length]);


  // Group users by tenant
  const groupedByTenant = (() => {
    const groups: Record<string, { tenantName: string; users: AdminUser[] }> = {};

    allUsers.forEach((user: AdminUser) => {
      const tenantId = user.tenant_id ?? '__no_tenant__';
      const tenantName = user.tenant?.name ?? (tenantId === '__no_tenant__' ? 'No Company' : tenantId);
      if (!groups[tenantId]) {
        groups[tenantId] = { tenantName, users: [] };
      }
      const emailMatch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const nameMatch = `${user.first_name ?? ''} ${user.last_name ?? ''}`.toLowerCase().includes(searchTerm.toLowerCase());
      if (!searchTerm || emailMatch || nameMatch) {
        groups[tenantId].users.push(user);
      }
    });

    // Remove empty groups from search filter
    return Object.entries(groups).filter(([, g]) => g.users.length > 0);
  })();

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
      <PageHeader
        title="Users"
        description={tenantIdFilter ? 'Managing users for selected company' : 'All platform users grouped by company'}
        icon={Users}
      >
        <Link href={`/admin/users/create${tenantIdFilter ? `?tenantId=${tenantIdFilter}` : ''}`}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </Link>
      </PageHeader>

      {/* Search */}
      <div className="flex max-w-sm items-center relative mb-6">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9"
        />
      </div>

      {isError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive mb-6">
          Failed to load users. Please try again.
        </div>
      )}

      {/* Grouped by tenant */}
      {usersLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
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
          description={searchTerm ? 'No users matched your search.' : 'No users exist yet.'}
        />
      ) : (
        <div className="space-y-4">
          {groupedByTenant.map(([tenantId, group]) => {
            const isExpanded = expandedTenants.has(tenantId);
            return (
              <Card key={tenantId} className="overflow-hidden">
                {/* Company Header (clickable to collapse) */}
                <button
                  onClick={() => toggleTenant(tenantId)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors border-b border-border"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-accent shrink-0" />
                    <span className="font-semibold text-foreground">{group.tenantName}</span>
                    <Badge variant="secondary" className="text-xs">
                      {group.users.length} user{group.users.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {isExpanded
                      ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    }
                  </div>
                </button>

                {/* Users Table */}
                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/20">
                          <th className="h-10 px-4 text-left font-medium text-muted-foreground">Name</th>
                          <th className="h-10 px-4 text-left font-medium text-muted-foreground">Email</th>
                          <th className="h-10 px-4 text-left font-medium text-muted-foreground">Role</th>
                          <th className="h-10 px-4 text-left font-medium text-muted-foreground">Status</th>
                          <th className="h-10 px-4 text-left font-medium text-muted-foreground">Joined</th>
                          <th className="h-10 px-4 text-right font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.users.map((user) => (
                          <tr key={user.id} className="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
                            <td className="p-4 font-medium">
                              {user.first_name || user.last_name
                                ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
                                : <span className="text-muted-foreground italic">No name</span>
                              }
                            </td>
                            <td className="p-4 text-muted-foreground">{user.email}</td>
                            <td className="p-4">
                              <Badge variant="outline" className="capitalize">{user.role}</Badge>
                            </td>
                            <td className="p-4">
                              <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                {user.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="p-4 text-muted-foreground text-xs">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52">
                                  <DropdownMenuItem
                                    onClick={() => openCredentialsDialog(user)}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <ShieldCheck className="w-4 h-4" />
                                    View Credentials
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => openResetDialog(user)}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <KeyRound className="w-4 h-4" />
                                    Reset Password
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => setDeleteDialog({ userId: user.id, userEmail: user.email, loading: false })}
                                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* View Credentials Dialog */}
      <Dialog open={!!credentialsDialog} onOpenChange={(open) => { if (!open) setCredentialsDialog(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              User Credentials
            </DialogTitle>
            <DialogDescription>
              Account details for this user. Only admins can view this information.
            </DialogDescription>
          </DialogHeader>

          {credentialsDialog?.loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          )}

          {credentialsDialog?.error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {credentialsDialog.error}
            </div>
          )}

          {credentialsDialog?.user && (
            <div className="space-y-4 py-1">
              {/* Email row with copy */}
              <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-4 h-4 text-accent shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Email</p>
                      <p className="text-sm font-mono font-medium text-foreground truncate">{credentialsDialog.user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border hover:bg-secondary/50"
                  >
                    {credentialsDialog.copied
                      ? <><Check className="w-3 h-3 text-green-400" /> Copied!</>
                      : <><Copy className="w-3 h-3" /> Copy</>
                    }
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Role</p>
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent capitalize">
                      {credentialsDialog.user.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Status</p>
                    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                      credentialsDialog.user.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                      {credentialsDialog.user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-secondary/10 p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-sm font-medium text-foreground">
                    {[credentialsDialog.user.firstName, credentialsDialog.user.lastName].filter(Boolean).join(' ') || '—'}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/10 p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Company</p>
                  <p className="text-sm font-medium text-foreground">{credentialsDialog.user.tenant?.name || '—'}</p>
                </div>
                {credentialsDialog.user.department && (
                  <div className="rounded-lg border border-border bg-secondary/10 p-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Department</p>
                    <p className="text-sm font-medium text-foreground">{credentialsDialog.user.department}</p>
                  </div>
                )}
                {credentialsDialog.user.jobTitle && (
                  <div className="rounded-lg border border-border bg-secondary/10 p-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Job Title</p>
                    <p className="text-sm font-medium text-foreground">{credentialsDialog.user.jobTitle}</p>
                  </div>
                )}
                <div className="rounded-lg border border-border bg-secondary/10 p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Last Login</p>
                  <p className="text-sm font-medium text-foreground">
                    {credentialsDialog.user.lastLogin
                      ? new Date(credentialsDialog.user.lastLogin).toLocaleDateString()
                      : 'Never'}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/10 p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Joined</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(credentialsDialog.user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCredentialsDialog(null)}>
              Close
            </Button>
            {credentialsDialog?.user && (
              <Button
                className="gap-2"
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-accent" />
              Reset Password
            </DialogTitle>
            <DialogDescription>
              Set a new password for <span className="font-semibold text-foreground">{resetDialog?.userEmail}</span>.
              No current password needed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {resetDialog?.error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {resetDialog.error}
              </div>
            )}
            {resetDialog?.success && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm text-green-400">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {resetDialog.success}
              </div>
            )}
            {!resetDialog?.success && (
              <div className="space-y-2">
                <Label htmlFor="new-password-admin">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password-admin"
                    type={resetDialog?.showPassword ? 'text' : 'password'}
                    value={resetDialog?.newPassword ?? ''}
                    onChange={(e) => setResetDialog(p => p && ({ ...p, newPassword: e.target.value }))}
                    placeholder="Min. 6 characters"
                    className="pr-10"
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
            <Button variant="outline" onClick={() => setResetDialog(null)} disabled={resetDialog?.loading}>
              {resetDialog?.success ? 'Close' : 'Cancel'}
            </Button>
            {!resetDialog?.success && (
              <Button
                onClick={handleResetPassword}
                disabled={resetDialog?.loading || !resetDialog?.newPassword}
                className="gap-2"
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
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate <span className="font-semibold text-foreground">{deleteDialog?.userEmail}</span>? This action cannot be easily undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)} disabled={deleteDialog?.loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleteDialog?.loading}
              className="gap-2"
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
