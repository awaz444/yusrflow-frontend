'use client';

import { useLanguage } from '@/lib/i18n/language-context';
import { Microsoft365Connect } from '@/components/admin/microsoft365-connect';
import { CSVUpload } from '@/components/admin/csv-upload';
import { TenantConfig } from '@/components/admin/tenant-config';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">{t('admin.title')}</h1>
          </div>
          <p className="text-muted-foreground">
            Manage data integrations, configure your tenant settings, and control data synchronization
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card border border-border p-1 rounded-lg">
            <TabsTrigger
              value="integrations"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              {t('admin.dataIntegration')}
            </TabsTrigger>
            <TabsTrigger
              value="csv"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              CSV Upload
            </TabsTrigger>
            <TabsTrigger
              value="config"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              Configuration
            </TabsTrigger>
          </TabsList>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Microsoft365Connect />
          </TabsContent>

          {/* CSV Upload Tab */}
          <TabsContent value="csv" className="space-y-6">
            <CSVUpload />
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-6">
            <TenantConfig />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
