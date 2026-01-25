'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Calendar, FileText, BarChart3, Clock } from 'lucide-react';

const reports = [
  {
    id: '1',
    title: 'Compliance Health Check',
    description: 'Comprehensive assessment of all regulatory compliance status',
    icon: <BarChart3 className="w-12 h-12 text-blue-600" />,
    lastGenerated: '2 days ago',
    preview: 'Preview',
  },
  {
    id: '2',
    title: 'SaaS Inventory Report',
    description: 'Complete list of all applications with costs and compliance status',
    icon: <FileText className="w-12 h-12 text-green-600" />,
    lastGenerated: '5 days ago',
    preview: 'Export CSV',
  },
  {
    id: '3',
    title: 'Executive Summary',
    description: 'High-level overview for stakeholders and executives',
    icon: <BarChart3 className="w-12 h-12 text-purple-600" />,
    lastGenerated: 'Never',
    preview: 'Schedule',
  },
  {
    id: '4',
    title: 'Risk Assessment',
    description: 'Detailed analysis of high-risk applications and remediation paths',
    icon: <FileText className="w-12 h-12 text-red-600" />,
    lastGenerated: '1 week ago',
    preview: 'Generate',
  },
  {
    id: '5',
    title: 'Cost Optimization',
    description: 'SaaS spending analysis with recommendations for cost reduction',
    icon: <BarChart3 className="w-12 h-12 text-yellow-600" />,
    lastGenerated: '3 days ago',
    preview: 'Download',
  },
  {
    id: '6',
    title: 'User Activity Report',
    description: 'Application usage metrics and user engagement analytics',
    icon: <Clock className="w-12 h-12 text-indigo-600" />,
    lastGenerated: 'Today',
    preview: 'View',
  },
];

const scheduledReports = [
  {
    id: '1',
    name: 'Executive Summary',
    frequency: 'Weekly',
    nextRun: '2024-02-12',
    recipients: ['ciso@company.com', 'cto@company.com'],
  },
  {
    id: '2',
    name: 'Compliance Health Check',
    frequency: 'Monthly',
    nextRun: '2024-03-01',
    recipients: ['compliance@company.com'],
  },
];

export default function ReportsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <main className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Reports
          </h1>
          <p className="text-muted-foreground">
            Generate, download, and schedule compliance reports
          </p>
        </div>

        {/* Available Reports */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Available Reports</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Card key={report.id} className="p-6 flex flex-col hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {report.icon}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {report.lastGenerated}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  {report.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1">
                  {report.description}
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  {report.preview}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Scheduled Reports */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Scheduled Reports</h2>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              New Schedule
            </Button>
          </div>
          <div className="space-y-4">
            {scheduledReports.map((report) => (
              <Card key={report.id} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <h3 className="font-semibold text-foreground">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">Frequency: {report.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Run</p>
                    <p className="font-medium text-foreground">
                      {new Date(report.nextRun).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recipients</p>
                    <p className="text-sm font-medium text-foreground">
                      {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Export</h2>
          <p className="text-muted-foreground mb-6">
            Export all your application data in various formats for further analysis or integration
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export as CSV
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export as Excel
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
