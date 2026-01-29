'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Users, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  tenant_id: string;
  created_at: string;
  is_active: boolean;
  tenant?: {
      name: string;
  }
}

export default function UsersPage() {
  const searchParams = useSearchParams();
  const tenantIdFilter = searchParams.get('tenantId');

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [tenantIdFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/admin/users`;

      if (tenantIdFilter) {
          url += `?tenantId=${tenantIdFilter}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">
              {tenantIdFilter ? 'Managing users for selected company' : 'Manage all platform users'}
          </p>
        </div>
        <Link href={`/admin/users/create${tenantIdFilter ? `?tenantId=${tenantIdFilter}` : ''}`}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </Link>
      </div>

       <div className="flex max-w-sm items-center relative">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
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
                         <div className="text-center py-12 text-muted-foreground">
                            No users found.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
