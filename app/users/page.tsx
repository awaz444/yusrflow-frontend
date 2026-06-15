'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  Users,
  Mail,
  Plus,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';
import { fetchFromApi } from '@/lib/api';
import { API_BASE_URL } from '@/lib/api';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { usePermissions } from '@/lib/hooks/use-permissions';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'auditor' | 'viewer';
  lastActive: string;
  status: 'active' | 'inactive';
}

interface ResetState {
  userId: string;
  userEmail: string;
  newPassword: string;
  showPassword: boolean;
  loading: boolean;
  error: string;
  success: string;
}

export default function UsersPage() {
  const { t, language } = useLanguage();
  const { can } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [resetDialog, setResetDialog] = useState<ResetState | null>(null);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await fetchFromApi('/auth/me');
        const me = profileData.user || profileData;
        setCurrentUserRole(me.role);

        // GET /users is tenant-scoped on the backend: the JwtAuthGuard injects
        // the caller's tenant_id from their JWT and the UsersController passes it
        // to getAllUsers() as a WHERE filter — only users from the same tenant are returned.
        const usersData = await fetchFromApi('/users');
        const usersList = usersData.users || [];
        const mappedUsers = usersList.map((u: any) => ({
          id: u.id,
          // Backend getAllUsers() returns camelCase (firstName/lastName)
          name: `${u.firstName || u.first_name || ''} ${u.lastName || u.last_name || ''}`.trim() || u.email,
          email: u.email,
          role: u.role,
          lastActive: u.lastLogin || u.last_login_at
            ? new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              }).format(new Date(u.lastLogin || u.last_login_at))
            : t('users.never'),
          status: (u.isActive ?? u.is_active) ? 'active' : 'inactive',
        }));
        setUsers(mappedUsers);
      } catch (err) {
        console.error('[Users] Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const canResetPasswords = currentUserRole === 'admin';

  const filteredUsers = useMemo(() =>
    users.filter((u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [users, searchTerm]
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-blue-500/20 text-blue-400';
      case 'viewer': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return t('users.admin');
      case 'viewer': return t('users.viewer');
      default: return role;
    }
  };

  const openResetDialog = (user: User) => {
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

  const handleResetPassword = async () => {
    if (!resetDialog) return;
    if (resetDialog.newPassword.length < 6) {
      setResetDialog(p => p && ({ ...p, error: 'Password must be at least 6 characters.' }));
      return;
    }
    setResetDialog(p => p && ({ ...p, loading: true, error: '', success: '' }));
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/users/${resetDialog.userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ newPassword: resetDialog.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetDialog(p => p && ({ ...p, loading: false, success: 'Password reset successfully!', newPassword: '' }));
      } else {
        const msg = Array.isArray(data.message) ? data.message.join(', ') : (data.message || 'Failed to reset password.');
        setResetDialog(p => p && ({ ...p, loading: false, error: msg }));
      }
    } catch {
      setResetDialog(p => p && ({ ...p, loading: false, error: 'An error occurred.' }));
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState message={t('Loading') || 'Loading users...'} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={t('users.title')}
        description={t('users.subtitle')}
        icon={Users}
      >
        {can('inviteUser') && (
          <Link href="/users/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {t('users.addUser')}
            </Button>
          </Link>
        )}
      </PageHeader>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder={t('common.search')}
          className="bg-card border-border text-foreground placeholder:text-muted-foreground max-w-md"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Users Table */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px] sm:min-w-0">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t('users.name')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden sm:table-cell">{t('users.email')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t('users.role')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">{t('users.lastActive')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t('users.status')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">{t('users.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0 border-none">
                    <EmptyState
                      icon={Users}
                      title="No users found"
                      description="There are no users matching your criteria."
                      className="rounded-none border-x-0 border-b-0 border-t"
                    />
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr key={user.id || `user-${index}`} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-muted-foreground">{user.lastActive}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.status === 'active' ? t('users.active') : t('users.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {canResetPasswords && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onClick={() => openResetDialog(user)}
                                className="gap-2 cursor-pointer"
                              >
                                <KeyRound className="w-4 h-4" />
                                Reset Password
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Showing <span className="font-semibold text-foreground">{Math.min(filteredUsers.length, (currentPage - 1) * pageSize + 1)}</span>{' '}
            to <span className="font-semibold text-foreground">{Math.min(filteredUsers.length, currentPage * pageSize)}</span>{' '}
            of <span className="font-semibold text-foreground">{filteredUsers.length}</span> users
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">{t('users.totalUsers')}</p>
          <p className="text-2xl font-bold text-foreground">{users.length}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">{t('users.admins')}</p>
          <p className="text-2xl font-bold text-blue-400">{users.filter(u => u.role === 'admin').length}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">{t('users.activeUsers')}</p>
          <p className="text-2xl font-bold text-green-400">{users.filter(u => u.status === 'active').length}</p>
        </Card>
      </div>

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
              No current password required.
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
                <Label htmlFor="mgr-reset-pw">New Password</Label>
                <div className="relative">
                  <Input
                    id="mgr-reset-pw"
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
                    {resetDialog?.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
    </PageContainer>
  );
}
