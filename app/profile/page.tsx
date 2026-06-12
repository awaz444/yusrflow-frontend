'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { fetchFromApi } from '@/lib/api';

type Tab = 'profile' | 'password';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }

    setPasswordLoading(true);
    try {
      await fetchFromApi('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err?.message || '';
      // Strip the "API Error: Bad Request - " prefix if present
      const match = msg.match(/API Error:.*?-\s*(.*)/s);
      if (match) {
        try {
          const parsed = JSON.parse(match[1]);
          setPasswordError(
            Array.isArray(parsed.message)
              ? parsed.message.join(', ')
              : parsed.message || 'Failed to change password.'
          );
        } catch {
          setPasswordError(match[1] || 'Failed to change password.');
        }
      } else {
        setPasswordError(msg || 'Failed to change password.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Profile"
        description="Manage your account information and security settings"
        icon={User}
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-secondary/30 p-1 rounded-lg w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-card text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Info Tab */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">First Name</p>
                <p className="text-foreground font-medium">{user?.first_name || '—'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Last Name</p>
                <p className="text-foreground font-medium">{user?.last_name || '—'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="text-foreground font-medium">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Role</p>
                <p className="text-foreground font-medium capitalize">{user?.role}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Account Type</p>
                <p className="text-foreground font-medium">
                  {user?.is_super_admin ? 'Super Administrator' : 'Standard User'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your login password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
              {passwordSuccess && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={passwordLoading}
                  placeholder="Enter your current password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={passwordLoading}
                  placeholder="At least 8 characters"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={passwordLoading}
                  placeholder="Repeat new password"
                />
              </div>

              <Button type="submit" disabled={passwordLoading} className="w-full mt-2">
                {passwordLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
