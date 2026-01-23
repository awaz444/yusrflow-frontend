'use client';

import { useState } from 'react';
import { ComplianceOverview } from '@/components/compliance/compliance-overview';
import { ComplianceStats } from '@/components/compliance/compliance-stats';
import { ComplianceIssues } from '@/components/compliance/compliance-issues';
import { ComplianceTimeline } from '@/components/compliance/compliance-timeline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, Clock, Download, FileText } from 'lucide-react';
import {
  mockComplianceScoresDetailed,
  mockComplianceIssues,
  mockTimelineEvents,
} from '@/lib/mockData';

export default function CompliancePage() {
  const [issues, setIssues] = useState(mockComplianceIssues);

  const handleResolveIssue = (id: string) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, status: 'resolved' as const } : issue
      )
    );
  };

  const criticalIssues = issues.filter((issue) => issue.severity === 'critical').length;
  const openIssues = issues.filter((issue) => issue.status === 'open').length;
  const resolvedIssues = issues.filter((issue) => issue.status === 'resolved').length;
  const inProgressIssues = issues.filter((issue) => issue.status === 'in-progress').length;

  const stats = [
    {
      label: 'Critical Issues',
      value: criticalIssues,
      change: -1,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'bg-red-500/20 text-red-400',
    },
    {
      label: 'Open Issues',
      value: openIssues,
      change: 2,
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-yellow-500/20 text-yellow-400',
    },
    {
      label: 'In Progress',
      value: inProgressIssues,
      change: 1,
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      label: 'Resolved',
      value: resolvedIssues,
      change: 2,
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'bg-green-500/20 text-green-400',
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Compliance Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor and track compliance status across all regulations and applications
              </p>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-white gap-2">
              <Download className="w-4 h-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <ComplianceStats stats={stats} />
        </div>

        {/* Compliance Scores */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Regulatory Compliance Scores</h2>
          <ComplianceOverview scores={mockComplianceScoresDetailed} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Issues Section */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-foreground mb-4">Active Issues</h2>
            <ComplianceIssues issues={issues} onResolve={handleResolveIssue} />
          </div>

          {/* Timeline Section */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
            <ComplianceTimeline events={mockTimelineEvents} />
          </div>
        </div>

        {/* Compliance Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
            <h3 className="font-semibold text-green-400 mb-2">Best Practices</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Regular compliance audits (quarterly)</li>
              <li>• Keep all applications updated</li>
              <li>• Monitor security patches</li>
              <li>• Document all compliance efforts</li>
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
            <h3 className="font-semibold text-blue-400 mb-2">Upcoming Deadlines</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• PDPL Audit: March 15, 2025</li>
              <li>• SOC2 Review: April 30, 2025</li>
              <li>• SDAIA Compliance: June 1, 2025</li>
              <li>• Policy Review: February 28, 2025</li>
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
            <h3 className="font-semibold text-purple-400 mb-2">Resources</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• PDPL Guidelines</li>
              <li>• SOC2 Framework</li>
              <li>• SDAIA Requirements</li>
              <li>• Risk Assessment Guide</li>
            </ul>
          </Card>
        </div>
      </div>
    </main>
  );
}
