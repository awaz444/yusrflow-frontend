'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Tenant {
    id: string;
    name: string;
}

export default function CreateUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedTenantId = searchParams.get('tenantId');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>([]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'viewer',
    tenantId: preSelectedTenantId || '',
    department: '',
    jobTitle: '',
    sendWelcomeEmail: true
  });

  useEffect(() => {
      fetchTenants();
  }, []);

  const fetchTenants = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/admin/tenants?limit=100`, { // Fetching top 100 for dropdown
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setTenants(data.data || []);
        }
      } catch (e) {
          console.error("Failed to fetch tenants", e);
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSelectChange = (value: string, field: string) => {
      setFormData({
          ...formData,
          [field]: value
      });
  };

  const handleCheckboxChange = (checked: boolean) => {
      setFormData({
          ...formData,
          sendWelcomeEmail: checked
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/admin/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
           email: formData.email,
           password: formData.password,
           firstName: formData.firstName,
           lastName: formData.lastName,
           role: formData.role,
           tenantId: formData.tenantId,
           department: formData.department,
           jobTitle: formData.jobTitle,
           sendWelcomeEmail: formData.sendWelcomeEmail
        }),
      });

      const data = await response.json();

      if (response.ok) {
          if (preSelectedTenantId) {
             router.push(`/admin/companies/${preSelectedTenantId}`);
          } else {
             router.push('/admin/users');
          }
      } else {
        setError(data.message || 'Failed to create user');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
          <Link href={preSelectedTenantId ? `/admin/companies/${preSelectedTenantId}` : "/admin/users"}>
              <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
              </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Add New User</h1>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>User Details</CardTitle>
              <CardDescription>Create a new user for a tenant company.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="tenantId">Company *</Label>
                    <Select
                        value={formData.tenantId}
                        onValueChange={(val) => handleSelectChange(val, 'tenantId')}
                        disabled={loading || !!preSelectedTenantId}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Company" />
                        </SelectTrigger>
                        <SelectContent>
                            {tenants.map(tenant => (
                                <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Temporary Password *</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select onValueChange={(val) => handleSelectChange(val, 'role')} value={formData.role} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="auditor">Auditor</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                            id="department"
                            value={formData.department}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                </div>

                 <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                            id="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            disabled={loading}
                        />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                        id="sendWelcomeEmail"
                        checked={formData.sendWelcomeEmail}
                        onCheckedChange={handleCheckboxChange}
                        disabled={loading}
                    />
                    <Label htmlFor="sendWelcomeEmail" className="text-sm font-normal cursor-pointer">
                        Send welcome email with credentials (will log to server console for now)
                    </Label>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Link href={preSelectedTenantId ? `/admin/companies/${preSelectedTenantId}` : "/admin/users"}>
                        <Button variant="outline" type="button" disabled={loading}>
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Create User
                    </Button>
                </div>
            </form>
          </CardContent>
      </Card>
    </div>
  );
}
