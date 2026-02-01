'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Download, Calendar, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  lastGenerated?: number;
  actions: Array<{
    label: string;
    icon: any;
    variant?: 'default' | 'outline';
  }>;
}

export default function ReportsPage() {
  const { t } = useLanguage();

  const reports: ReportCard[] = [
    {
      id: 'health-check',
      title: t('reports.complianceHealthCheck'),
      description: 'Comprehensive overview of your compliance status across all regulations',
      icon: FileText,
      lastGenerated: 2,
      actions: [
        { label: t('reports.generatePDF'), icon: Download },
        { label: t('reports.scheduleReport'), icon: Calendar, variant: 'outline' },
      ],
    },
    {
      id: 'saas-inventory',
      title: t('reports.saasInventory'),
      description: 'Complete list of all SaaS applications with compliance details and costs',
      icon: FileText,
      lastGenerated: 5,
      actions: [
        { label: t('reports.exportCSV'), icon: Download },
        { label: t('reports.scheduleReport'), icon: Calendar, variant: 'outline' },
      ],
    },
    {
      id: 'executive-summary',
      title: t('reports.executiveSummary'),
      description: 'High-level summary of compliance status for executives and stakeholders',
      icon: FileText,
      actions: [
        { label: t('reports.generatePDF'), icon: Download },
        { label: t('reports.scheduleReport'), icon: Calendar, variant: 'outline' },
      ],
    },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-bold text-foreground">{t('reports.title')}</h1>
          </div>
          <p className="text-muted-foreground">{t('reports.subtitle')}</p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const IconComponent = report.icon;
            return (
              <Card key={report.id} className="bg-card border-border p-6 hover:border-accent transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <IconComponent className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{report.title}</h3>
                    {report.lastGenerated && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('reports.lastGenerated')}: {report.lastGenerated} {t('reports.daysAgo')}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6">{report.description}</p>

                <div className="space-y-2">
                  {report.actions.map((action, index) => {
                    const ActionIcon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant={action.variant || 'default'}
                        className="w-full justify-start gap-2"
                      >
                        <ActionIcon className="w-4 h-4" />
                        {action.label}
                      </Button>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Scheduled Reports Section */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Scheduled Reports</h2>
          </div>

          <Card className="bg-card border-border p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Compliance Health Check</h3>
                <p className="text-sm text-muted-foreground">Every Monday at 9:00 AM</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  Pause
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Report Generation History */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Recent Reports</h2>
          </div>

          <div className="space-y-2">
            {[
              {
                name: 'Compliance Health Check - Jan 15, 2024',
                date: '2 hours ago',
              },
              {
                name: 'SaaS Inventory Export - Jan 10, 2024',
                date: '5 days ago',
              },
              {
                name: 'Executive Summary - Jan 8, 2024',
                date: '1 week ago',
              },
            ].map((item, index) => (
              <Card key={index} className="bg-card border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
