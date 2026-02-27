'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, MoreHorizontal, Mail, Plus } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';
import { fetchFromApi } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'auditor' | 'viewer';
  lastActive: string;
  status: 'active' | 'inactive';
}

export default function UsersPage() {
  const { t, language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user profile (backend returns user object directly)
        const profileData = await fetchFromApi('/auth/me');
        console.log('[Users] Profile data:', profileData); // Debug log

        // Backend returns { user: {...} }, so extract the user object
        const user = profileData.user || profileData;
        setCurrentUser({
          id: user.id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
          email: user.email,
          role: user.role,
          lastActive: user.last_login_at ? new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(user.last_login_at)) : t('users.never'),
          status: 'active'
        });


        // Fetch all users in the tenant
        const usersData = await fetchFromApi('/users');
        console.log('[Users] All users:', usersData);

        // Map backend data to UI format
        // Backend returns { users: [...], pagination: {...} }
        const usersList = usersData.users || [];
        const mappedUsers = usersList.map((u: any) => ({
          id: u.id,
          name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
          email: u.email,
          role: u.role,
          lastActive: u.last_login_at ? new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(u.last_login_at)) : t('users.never'),
          status: u.is_active ? 'active' : 'inactive'
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


  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-500/20 text-blue-400';
      case 'auditor':
        return 'bg-purple-500/20 text-purple-400';
      case 'viewer':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return t('users.admin');
      case 'auditor':
        return t('users.auditor');
      case 'viewer':
        return t('users.viewer');
      default:
        return role;
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-accent" />
              <h1 className="text-3xl font-bold text-foreground">{t('users.title')}</h1>
            </div>
            <p className="text-muted-foreground">{t('users.subtitle')}</p>
          </div>
          {['admin', 'manager'].includes(currentUser?.role || '') && (
            <Link href="/users/create">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {t('users.addUser')}
              </Button>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder={t('common.search')}
            className="bg-card border-border text-foreground placeholder:text-muted-foreground max-w-md"
          />
        </div>

        {/* Users Table */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    {t('users.name')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    {t('users.email')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    {t('users.role')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    {t('users.lastActive')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    {t('users.status')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    {t('users.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id || `user-${index}`} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">{user.lastActive}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${user.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                          }`}
                      >
                        {user.status === 'active' ? t('users.active') : t('users.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          {t('users.edit')}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-500">
                          {t('users.deactivate')}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* User Count Summary */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-card border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">{t('users.totalUsers')}</p>
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
          </Card>
          <Card className="bg-card border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">{t('users.admins')}</p>
            <p className="text-2xl font-bold text-blue-400">{users.filter((u) => u.role === 'admin').length}</p>
          </Card>
          <Card className="bg-card border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">{t('users.activeUsers')}</p>
            <p className="text-2xl font-bold text-green-400">{users.filter((u) => u.status === 'active').length}</p>
          </Card>
        </div>
      </div>
    </>
  );
}
