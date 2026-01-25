'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, Plus, MoreHorizontal, Mail } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'auditor' | 'viewer';
  lastActive: string;
  status: 'active' | 'inactive';
}

export default function UsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      email: 'ahmed.rashid@company.com',
      role: 'admin',
      lastActive: '2 hours ago',
      status: 'active',
    },
    {
      id: '2',
      name: 'Fatima Al-Saud',
      email: 'fatima.saud@company.com',
      role: 'auditor',
      lastActive: '1 day ago',
      status: 'active',
    },
    {
      id: '3',
      name: 'Mohammed Al-Dosari',
      email: 'mohammed.dosari@company.com',
      role: 'viewer',
      lastActive: '3 days ago',
      status: 'active',
    },
  ]);

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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-accent" />
              <h1 className="text-3xl font-bold text-foreground">{t('users.title')}</h1>
            </div>
            <p className="text-muted-foreground">{t('users.subtitle')}</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-white gap-2">
            <Plus className="w-4 h-4" />
            {t('users.addUser')}
          </Button>
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
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
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
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {user.status === 'active' ? 'Active' : 'Inactive'}
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
            <p className="text-sm text-muted-foreground mb-1">Total Users</p>
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
          </Card>
          <Card className="bg-card border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Admins</p>
            <p className="text-2xl font-bold text-blue-400">{users.filter((u) => u.role === 'admin').length}</p>
          </Card>
          <Card className="bg-card border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Active Users</p>
            <p className="text-2xl font-bold text-green-400">{users.filter((u) => u.status === 'active').length}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
