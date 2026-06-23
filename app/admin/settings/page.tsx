'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <PageContainer>
      <PageHeader
        title="Admin Settings"
        description="Manage platform-wide settings and your admin profile"
        icon={Settings}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
          <CardDescription>Your super admin account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-foreground font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="text-foreground font-medium capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-foreground font-medium">
                {user?.first_name} {user?.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Type</p>
              <p className="text-foreground font-medium">
                {user?.is_super_admin ? 'Super Administrator' : 'User'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>Global configuration options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/20 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">
                🚧 <strong>Coming soon:</strong> Platform-wide settings, email configuration,
                security policies, and system preferences will be available here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Platform status and version details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Platform Version</p>
              <p className="text-foreground font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Environment</p>
              <p className="text-foreground font-medium">Development</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
