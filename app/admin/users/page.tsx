'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Users, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAdminUsers } from '@/lib/hooks/use-admin-users';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';

function UsersPageContent() {
  const searchParams = useSearchParams();
  const tenantIdFilter = searchParams.get('tenantId') ?? undefined;

  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading: loading, isError } = useAdminUsers(
    tenantIdFilter ? { tenantId: tenantIdFilter } : undefined
  );
  const users = data?.data ?? [];

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <PageHeader
        title="Users"
        description={tenantIdFilter ? 'Managing users for selected company' : 'Manage all platform users'}
        icon={Users}
      >
        <Link href={`/admin/users/create${tenantIdFilter ? `?tenantId=${tenantIdFilter}` : ''}`}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </Link>
      </PageHeader>

      <div className="flex max-w-sm items-center relative mb-6">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
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

      {loading ? (
        <Card>
          <CardHeader><CardTitle>User Directory</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>User Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.length > 0 ? (
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Role</th>
                        {!tenantIdFilter && <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Company</th>}
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle font-medium">
                            <Link href={`/admin/users/${user.id}`} className="hover:underline">
                              {user.first_name} {user.last_name}
                            </Link>
                          </td>
                          <td className="p-4 align-middle">{user.email}</td>
                          <td className="p-4 align-middle">
                            <Badge variant="outline">{user.role}</Badge>
                          </td>
                          {!tenantIdFilter && (
                            <td className="p-4 align-middle">
                              {user.tenant?.name || 'N/A'}
                            </td>
                          )}
                          <td className="p-4 align-middle">
                            <Badge variant={user.is_active ? 'default' : 'secondary'}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title="No users found"
                  description={searchTerm ? "No users matched your search." : "No users exist in the system yet."}
                  className="border-none"
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
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
