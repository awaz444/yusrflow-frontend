'use client';

import { useState, useEffect, useRef } from 'react';
import { ComplianceOverview } from '@/components/compliance/compliance-overview';
import { ComplianceStats } from '@/components/compliance/compliance-stats';
import { ComplianceIssues, ComplianceIssue } from '@/components/compliance/compliance-issues';
import { ComplianceTimeline } from '@/components/compliance/compliance-timeline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle2, Clock, Download, FileText, ShieldCheck, Loader2 } from 'lucide-react';
import { fetchFromApi, downloadFile } from '@/lib/api';
import { useLanguage } from '@/lib/i18n/language-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CompliancePage() {
  const { t } = useLanguage();
  const [issues, setIssues] = useState<ComplianceIssue[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Compliance Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<{ scanned: number; total: number; lastApp: string }>({ scanned: 0, total: 0, lastApp: '' });
  const [scanComplete, setScanComplete] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const handleRunScan = async () => {
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

    // Poll the lightweight /reports/engine/status endpoint every 2.5s
    // This gives us real-time currentApp name directly from the engine
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const status = await fetchFromApi('/reports/engine/status');
        setScanProgress({
          scanned: status.scanned,
          total: status.total,
          lastApp: status.currentApp || 'Processing...'
        });

        if (!status.isRunning && status.total > 0) {
          clearInterval(pollRef.current!);
          setIsScanning(false);
          setScanComplete(true);
          // Refresh the compliance dashboard data with the new scan results
          await loadComplianceData();
        }
      } catch (e) {
        console.error('Status poll error', e);
      }
    }, 2000);
  };

  // Cleanup poll on unmount
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const loadComplianceData = async () => {
    try {
      const response = await fetchFromApi('/tenants/compliance');
      const data = response.data || response;
      setScores(data.scores || []);
      setIssues(data.issues || []);
      setTimelineEvents(data.timelineEvents || []);
    } catch (error) {
      console.error('Failed to load compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplianceData();
  }, []);

  const handleResolveIssue = (id: string) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, status: 'resolved' as const } : issue
      )
    );
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
    return <div className="p-8">{t('compliance.loading')}</div>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{t('compliance.title')}</h1>
              <p className="text-muted-foreground">
                {t('compliance.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {scanComplete && (
                <span className="text-sm text-green-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Scan complete!</span>
              )}
              <Button
                onClick={handleRunScan}
                disabled={isScanning}
                className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
              >
                {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {isScanning ? 'Scanning...' : 'Run Compliance Check'}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={downloading}
                    className="bg-accent hover:bg-accent/90 text-white gap-2"
                  >
                    {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    {downloading ? t('reports.generating') : t('compliance.generateReport')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownloadReport('en')}>
                    {t('common.english')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownloadReport('ar')}>
                    {t('common.arabic')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

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
      </div>
    </>
  );
}
