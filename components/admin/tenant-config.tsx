'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n/language-context';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export function TenantConfig() {
  const { t } = useLanguage();
  const [config, setConfig] = useState({
    tenantName: 'Acme Corporation',
    industry: 'Technology',
    country: 'Saudi Arabia',
    employees: '500-1000',
    syncInterval: '1',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In production, this would save to backend
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-accent" />
          {t('admin.tenantConfig')}
        </CardTitle>
        <CardDescription>Manage your tenant settings and data synchronization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Tenant Name */}
          <div>
            <label className="text-sm font-medium block mb-2">Tenant Name</label>
            <input
              type="text"
              value={config.tenantName}
              onChange={(e) => handleChange('tenantName', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="text-sm font-medium block mb-2">Industry</label>
            <select
              value={config.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option>Technology</option>
              <option>Finance</option>
              <option>Healthcare</option>
              <option>Retail</option>
              <option>Manufacturing</option>
              <option>Other</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="text-sm font-medium block mb-2">Country</label>
            <select
              value={config.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option>Saudi Arabia</option>
              <option>United Arab Emirates</option>
              <option>Kuwait</option>
              <option>Qatar</option>
              <option>Bahrain</option>
              <option>Oman</option>
            </select>
          </div>

          {/* Employees */}
          <div>
            <label className="text-sm font-medium block mb-2">Number of Employees</label>
            <select
              value={config.employees}
              onChange={(e) => handleChange('employees', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option>1-50</option>
              <option>50-100</option>
              <option>100-500</option>
              <option>500-1000</option>
              <option>1000+</option>
            </select>
          </div>

          {/* Sync Interval */}
          <div>
            <label className="text-sm font-medium block mb-2">{t('admin.syncInterval')} (hours)</label>
            <select
              value={config.syncInterval}
              onChange={(e) => handleChange('syncInterval', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="1">Every 1 hour</option>
              <option value="4">Every 4 hours</option>
              <option value="12">Every 12 hours</option>
              <option value="24">Every 24 hours</option>
              <option value="manual">Manual only</option>
            </select>
          </div>
        </div>

        {/* Column Mapping Section */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h4 className="font-semibold text-sm">CSV Column Mapping</h4>
          <p className="text-sm text-muted-foreground">
            Map your custom CSV columns to the standard format
          </p>

          <div className="space-y-3">
            {[
              { standard: 'Application Name', custom: 'app_name' },
              { standard: 'Category', custom: 'dept_software' },
              { standard: 'Monthly Cost', custom: 'cost_sr' },
              { standard: 'User Count', custom: 'num_users' },
              { standard: 'Risk Level', custom: 'security_risk' },
              { standard: 'Compliance Status', custom: 'compliance' },
            ].map((mapping, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Standard</p>
                  <input
                    type="text"
                    value={mapping.standard}
                    disabled
                    className="w-full px-2 py-1.5 text-xs border border-border rounded bg-muted text-muted-foreground"
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Your Column</p>
                  <input
                    type="text"
                    defaultValue={mapping.custom}
                    className="w-full px-2 py-1.5 text-xs border border-border rounded bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-accent hover:bg-accent/90"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </CardContent>
    </Card>
  );
}
