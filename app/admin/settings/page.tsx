'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchFromApi } from '@/lib/api';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tenant, setTenant] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    employee_count: '',
    country: 'SA',
  });

  useEffect(() => {
    const loadTenant = async () => {
      try {
        const data = await fetchFromApi('/tenants');
        setTenant(data);
        setFormData({
          name: data.name || '',
          industry: data.industry || '',
          employee_count: data.employee_count?.toString() || '',
          country: data.country || 'SA',
        });
      } catch (error) {
        console.error('Failed to load tenant:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTenant();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        name: formData.name,
        industry: formData.industry || null,
        employee_count: formData.employee_count ? parseInt(formData.employee_count) : null,
        country: formData.country,
      };

      const updated = await fetchFromApi('/tenants', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      setTenant(updated);
      alert('✅ Tenant settings updated successfully!');
    } catch (error: any) {
      console.error('Failed to update tenant:', error);
      alert(`❌ Failed to update settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tenant Settings</h1>
          <p className="text-muted-foreground">Manage your organization&apos;s configuration</p>
        </div>

        <Card className="bg-card border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Organization Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Acme Corporation"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Industry
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Technology, Finance, Healthcare, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Employee Count
              </label>
              <input
                type="number"
                value={formData.employee_count}
                onChange={(e) => setFormData({ ...formData, employee_count: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="100"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Country
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="SA">Saudi Arabia</option>
                <option value="AE">United Arab Emirates</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="IN">India</option>
              </select>
            </div>

            {tenant && (
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Subscription</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <p className="text-foreground font-medium capitalize">{tenant.subscription_tier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className={`font-medium ${tenant.is_active ? 'text-green-400' : 'text-red-400'}`}>
                      {tenant.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-6">
              <Button
                onClick={handleSave}
                disabled={saving || !formData.name}
                className="px-6"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-6 p-4 bg-secondary/20 border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">
            🎨 <strong>Coming soon:</strong> Logo upload, brand color customization, and advanced settings
          </p>
        </div>
      </div>
    </main>
  );
}
