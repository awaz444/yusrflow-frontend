'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Download, Calendar, RefreshCw } from 'lucide-react';
import { useState } from 'react';
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
    onClick?: () => void;
  }>;
}

export default function ReportsPage() {
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});

  const handleDownload = async (
    reportId: string,
    endpoint: string,
    filenamePrefix: string,
    mimeType: string,
    extension: string
  ) => {
    setIsGenerating((prev) => ({ ...prev, [reportId]: true }));
    try {
      // Use native fetch to ensure pure Blob response is preserved
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const urlToFetch = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const token = localStorage.getItem('accessToken');

      console.log('Fetching Report from', urlToFetch, 'Token exists:', !!token);

      const rawResponse = await fetch(urlToFetch, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': mimeType,
        },
      });

      if (!rawResponse.ok) {
        throw new Error(`Failed to generate report: ${rawResponse.statusText}`);
      }

      const blob = await rawResponse.blob();
      const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
      const link = document.createElement('a');
      link.href = url;

      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `Yusrflow_${filenamePrefix}_${dateStr}.${extension}`);

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
    } finally {
      setIsGenerating((prev) => ({ ...prev, [reportId]: false }));
    }
  };

  const reports: ReportCard[] = [
    {
      id: 'health-check',
      title: t('reports.complianceHealthCheck'),
      description: t('reports.descHealthCheck'),
      icon: FileText,
      lastGenerated: 2,
      actions: [
        {
          label: t('reports.generatePDF'),
          icon: Download,
          onClick: () => handleDownload('health-check', '/reports/compliance-health/pdf', 'Compliance_Health_Check', 'application/pdf', 'pdf')
        },
        { label: t('reports.scheduleReport'), icon: Calendar, variant: 'outline' },
      ],
    },
    {
      id: 'saas-inventory',
      title: t('reports.saasInventory'),
      description: t('reports.descSaasInventory'),
      icon: FileText,
      lastGenerated: 5,
      actions: [
        {
          label: t('reports.exportCSV'),
          icon: Download,
          onClick: () => handleDownload('saas-inventory', '/reports/saas-inventory/csv', 'SaaS_Inventory', 'text/csv', 'csv')
        },
        { label: t('reports.scheduleReport'), icon: Calendar, variant: 'outline' },
      ],
    },
    {
      id: 'executive-summary',
      title: t('reports.executiveSummary'),
      description: t('reports.descExecutiveSummary'),
      icon: FileText,
      actions: [
        {
          label: t('reports.generatePDF'),
          icon: Download,
          onClick: () => handleDownload('executive-summary', '/reports/executive-summary/pdf', 'Executive_Summary', 'application/pdf', 'pdf')
        },
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
                        onClick={action.onClick}
                        disabled={isGenerating[report.id] && action.label.includes('Generate')}
                      >
                        {isGenerating[report.id] && action.onClick ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <ActionIcon className="w-4 h-4" />
                        )}
                        {isGenerating[report.id] && action.onClick ? t('reports.generating') : action.label}
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
            <h2 className="text-2xl font-bold text-foreground">{t('reports.scheduledReports')}</h2>
          </div>

          <Card className="bg-card border-border p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">{t('reports.complianceHealthCheck')}</h3>
                <p className="text-sm text-muted-foreground">{t('reports.everyMonday')}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  {t('reports.edit')}
                </Button>
                <Button variant="outline" size="sm">
                  {t('reports.pause')}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Report Generation History */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">{t('reports.recentReports')}</h2>
          </div>

          <div className="space-y-2">
            {[
              {
                name: t('reports.demoReport1'),
                date: t('reports.demoDate1'),
              },
              {
                name: t('reports.demoReport2'),
                date: t('reports.demoDate2'),
              },
              {
                name: t('reports.demoReport3'),
                date: t('reports.demoDate3'),
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
