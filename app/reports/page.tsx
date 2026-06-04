'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/language-context';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { StaggerContainer, StaggerItem } from '@/components/ui/fade-in';
import { API_BASE_URL } from '@/lib/api';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: any;
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
      const urlToFetch = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const token = localStorage.getItem('accessToken');

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
      actions: [
        {
          label: t('reports.generatePDF'),
          icon: Download,
          onClick: () => handleDownload('health-check', '/reports/compliance-health/pdf', 'Compliance_Health_Check', 'application/pdf', 'pdf'),
        },
      ],
    },
    {
      id: 'saas-inventory',
      title: t('reports.saasInventory'),
      description: t('reports.descSaasInventory'),
      icon: FileText,
      actions: [
        {
          label: t('reports.exportCSV'),
          icon: Download,
          onClick: () => handleDownload('saas-inventory', '/reports/saas-inventory/csv', 'SaaS_Inventory', 'text/csv', 'csv'),
        },
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
          onClick: () => handleDownload('executive-summary', '/reports/executive-summary/pdf', 'Executive_Summary', 'application/pdf', 'pdf'),
        },
      ],
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={t('reports.title')}
        description={t('reports.subtitle')}
        icon={FileText}
      />

      {/* Reports Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const IconComponent = report.icon;
          return (
            <StaggerItem key={report.id}>
              <Card className="bg-card border-border p-6 hover:border-accent transition-colors h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-accent/10 rounded-lg shrink-0">
                    <IconComponent className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{report.title}</h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6 flex-1">{report.description}</p>

                <div className="space-y-2 mt-auto">
                  {report.actions.map((action, index) => {
                    const ActionIcon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant={action.variant || 'default'}
                        className="w-full justify-start gap-2"
                        onClick={action.onClick}
                        disabled={isGenerating[report.id]}
                      >
                        {isGenerating[report.id] ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <ActionIcon className="w-4 h-4" />
                        )}
                        {isGenerating[report.id] ? t('reports.generating') : action.label}
                      </Button>
                    );
                  })}
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </PageContainer>
  );
}
