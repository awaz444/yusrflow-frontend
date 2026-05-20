'use client';

import { useEffect, useMemo, useState } from 'react';
import { ComplianceOverview } from '@/components/compliance/compliance-overview';
import { ComplianceStats } from '@/components/compliance/compliance-stats';
import { ComplianceIssues, ComplianceIssue } from '@/components/compliance/compliance-issues';
import { ComplianceTimeline } from '@/components/compliance/compliance-timeline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle2, Clock, Download, FileText, ShieldCheck, Loader2, RefreshCw, Info } from 'lucide-react';
import { fetchFromApi, downloadFile } from '@/lib/api';
import { useLanguage } from '@/lib/i18n/language-context';
import { useComplianceDashboard } from '@/lib/hooks/use-compliance-dashboard';
import { tenantKeys } from '@/lib/query-keys';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ComplianceMethodology } from '@/components/compliance/compliance-methodology';

export default function CompliancePage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { data: complianceData, isLoading: loading } = useComplianceDashboard();
  const [downloading, setDownloading] = useState(false);

  // Compliance Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [showScanConfirm, setShowScanConfirm] = useState(false);
  const [scanProgress, setScanProgress] = useState<{ scanned: number; total: number; lastApp: string }>({ scanned: 0, total: 0, lastApp: '' });
  const [scanComplete, setScanComplete] = useState(false);
  const [resolvedIssueIds, setResolvedIssueIds] = useState<Set<string>>(new Set());

  const scores = complianceData?.scores || [];
  const timelineEvents = complianceData?.timelineEvents || [];
  const issues = useMemo(() => {
    const rawIssues = (complianceData?.issues || []) as ComplianceIssue[];
    return rawIssues.map((issue) =>
      resolvedIssueIds.has(issue.id) ? { ...issue, status: 'resolved' as const } : issue
    );
  }, [complianceData?.issues, resolvedIssueIds]);

  const { data: statusData } = useQuery({
    queryKey: tenantKeys.scanStatus(),
    queryFn: async () => {
      const status = await fetchFromApi('/reports/engine/status');
      return status.data || status;
    },
    enabled: isScanning,
    refetchInterval: isScanning ? 2000 : false,
    refetchOnWindowFocus: false,
  });

  const startScan = async () => {
    setShowScanConfirm(false);
    setScanComplete(false);
    setIsScanning(true);
    setScanProgress({ scanned: 0, total: 0, lastApp: 'Starting...' });

    try {
      await fetchFromApi('/reports/engine/scan-all', { method: 'POST' });
    } catch (e) {
      console.error('Failed to trigger scan', e);
      setIsScanning(false);
      return;
    }
  };

  const handleRunScan = async () => {
    if (complianceData?.subscriptionTier === 'enterprise') {
      setShowScanConfirm(true);
    } else {
      startScan();
    }
  };

  useEffect(() => {
    if (!statusData || !isScanning) return;

    setScanProgress({
      scanned: statusData.scanned,
      total: statusData.total,
      lastApp: statusData.currentApp || 'Processing...'
    });

    if (!statusData.isRunning && statusData.total > 0) {
      setIsScanning(false);
      setScanComplete(true);
      queryClient.invalidateQueries({ queryKey: tenantKeys.compliance() });
    }
  }, [statusData, isScanning, queryClient]);

  const handleResolveIssue = (id: string) => {
    setResolvedIssueIds((prev) => new Set(prev).add(id));
  };

  const handleDownloadReport = async (lang: string = 'en') => {
    setDownloading(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      await downloadFile(`/reports/compliance-health/pdf?lang=${lang}`, `Yusrflow_Compliance_Report_${lang.toUpperCase()}_${timestamp}.pdf`);
    } catch (error) {
      console.error('Failed to download report:', error);
    } finally {
      setDownloading(false);
    }
  };

  const criticalIssues = issues.filter((issue) => issue.severity === 'critical').length;
  const openIssues = issues.filter((issue) => issue.status === 'open').length;
  const resolvedIssues = issues.filter((issue) => issue.status === 'resolved').length;
  const inProgressIssues = issues.filter((issue) => issue.status === 'in-progress').length;

  const stats = [
    {
      label: t('compliance.criticalIssues'),
      value: criticalIssues,
      change: -1,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'bg-red-500/20 text-red-400',
    },
    {
      label: t('compliance.openIssues'),
      value: openIssues,
      change: 2,
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-yellow-500/20 text-yellow-400',
    },
    {
      label: t('compliance.inProgress'),
      value: inProgressIssues,
      change: 1,
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      label: t('compliance.resolved'),
      value: resolvedIssues,
      change: 2,
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'bg-green-500/20 text-green-400',
    },
  ];

  if (loading) {
    return <PageContainer><LoadingState message={t('compliance.loading') || "Loading compliance data..."} /></PageContainer>;
  }

  return (
    <PageContainer>
      <PageHeader
        title={t('compliance.title')}
        description={t('compliance.subtitle')}
        icon={ShieldCheck}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleRunScan}
            disabled={isScanning}
          >
            {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isScanning ? t('compliance.scanning') : t('compliance.runScan')}
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 border border-primary/20 hover:bg-primary/10"
            onClick={() => {
              const el = document.getElementById('methodology-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Info className="w-4 h-4" />
            {t('common.methodology') || 'Methodology'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2" disabled={downloading}>
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {downloading ? t('compliance.downloading') : t('compliance.downloadReport')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDownloadReport('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadReport('ar')}>
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </PageHeader>

        {/* Live Compliance Scan Progress */}
        {isScanning && (
          <Card className="mb-8 p-6 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-blue-500/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                <div>
                  <p className="font-semibold text-foreground">AI Compliance Scan Running</p>
                  <p className="text-sm text-muted-foreground">Currently evaluating: <span className="text-purple-300">{scanProgress.lastApp}</span></p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-400">{scanProgress.scanned}<span className="text-muted-foreground text-base">/{scanProgress.total}</span></p>
                <p className="text-xs text-muted-foreground">apps scanned</p>
              </div>
            </div>
            <Progress
              value={scanProgress.total > 0 ? Math.round((scanProgress.scanned / scanProgress.total) * 100) : 0}
              className="h-3 bg-purple-500/20"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {scanProgress.total > 0 ? `${Math.round((scanProgress.scanned / scanProgress.total) * 100)}% complete` : 'Initializing...'}
            </p>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="mb-8">
          <ComplianceStats stats={stats} />
        </div>

        {/* Compliance Scores */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('compliance.regulatoryScores')}</h2>
          <ComplianceOverview scores={scores} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Issues Section */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t('compliance.activeIssues')}</h2>
            <ComplianceIssues issues={issues} onResolve={handleResolveIssue} />
          </div>

          {/* Timeline Section */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">{t('compliance.recentActivity')}</h2>
            <ComplianceTimeline events={timelineEvents} />
          </div>
        </div>

        {/* Compliance Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
            <h3 className="font-semibold text-green-400 mb-2">{t('compliance.bestPractices')}</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• {t('compliance.bp1')}</li>
              <li>• {t('compliance.bp2')}</li>
              <li>• {t('compliance.bp3')}</li>
              <li>• {t('compliance.bp4')}</li>
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
            <h3 className="font-semibold text-blue-400 mb-2">{t('compliance.upcomingDeadlines')}</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• {t('compliance.d1')}</li>
              <li>• {t('compliance.d2')}</li>
              <li>• {t('compliance.d3')}</li>
              <li>• {t('compliance.d4')}</li>
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
            <h3 className="font-semibold text-purple-400 mb-2">{t('compliance.resources')}</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• {t('compliance.r1')}</li>
              <li>• {t('compliance.r2')}</li>
              <li>• {t('compliance.r3')}</li>
              <li>• {t('compliance.r4')}</li>
            </ul>
          </Card>
        </div>

        {/* Methodology Section */}
        <div id="methodology-section" className="mt-16 pt-16 border-t">
          <ComplianceMethodology />
        </div>

        {/* Enterprise Scan Confirmation Dialog */}
        <Dialog open={showScanConfirm} onOpenChange={setShowScanConfirm}>
          <DialogContent className="sm:max-w-md border-purple-500/30 bg-background/95 backdrop-blur-md">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-6 h-6 text-purple-400" />
                <DialogTitle className="text-xl">Enterprise Scan Limit</DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground text-base leading-relaxed">
                For now, the <span className="text-purple-400 font-semibold uppercase">Enterprise</span> plan allows scanning <span className="text-foreground font-bold">up to 12 apps</span> per session.
                <br /><br />
                Clicking <span className="text-foreground font-semibold">Okay</span> will proceed with scanning the first 12 applications in your inventory.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
              <Button variant="ghost" onClick={() => setShowScanConfirm(false)}>
                Cancel
              </Button>
              <Button 
                onClick={startScan}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 shadow-lg shadow-purple-500/20"
              >
                Okay
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </PageContainer>
  );
}
