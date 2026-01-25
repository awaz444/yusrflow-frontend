'use client';

import { SummaryCard } from '@/components/dashboard/summary-card';
import { ComplianceMeter } from '@/components/dashboard/compliance-meter';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockSaasApps, mockTenant } from '@/lib/mockData';
import {
  Activity,
  AlertCircle,
  Zap,
  DollarSign,
  Clock,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Home() {
  const totalApps = mockSaasApps.length;
  const shadowITApps = mockSaasApps.filter(app => app.category === 'Collaboration').length;
  const averageComplianceScore = Math.round(
    mockSaasApps.reduce((sum, app) => sum + app.complianceScore, 0) /
      mockSaasApps.length
  );
  const highRiskApps = mockSaasApps.filter(
    (app) => app.riskLevel === 'high' || app.riskLevel === 'critical'
  ).length;
  const totalMonthlySpend = mockSaasApps.reduce(
    (sum, app) => sum + app.monthlySpend,
    0
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <main className="p-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to {mockTenant.name}
          </h1>
          <p className="text-muted-foreground">
            Real-time SaaS application monitoring and compliance tracking
          </p>
          <Button className="mt-4 bg-primary hover:bg-primary/90 text-white">
            <Zap className="w-4 h-4 mr-2" />
            Scan Apps
          </Button>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="SaaS Applications"
            value={totalApps}
            subtext={`${shadowITApps} shadow IT detected`}
            icon={<Activity className="w-6 h-6" />}
            trend={{ value: 3, direction: 'up', label: 'from last month' }}
            color="blue"
          />
          <SummaryCard
            title="PDPL Compliance"
            value={`${averageComplianceScore}%`}
            subtext="Overall compliance score"
            icon={<AlertCircle className="w-6 h-6" />}
            trend={{ value: 2, direction: 'up', label: 'improved' }}
            color={
              averageComplianceScore >= 80
                ? 'green'
                : averageComplianceScore >= 60
                  ? 'yellow'
                  : 'red'
            }
          />
          <SummaryCard
            title="High Risk Apps"
            value={highRiskApps}
            subtext="Require immediate attention"
            icon={<AlertCircle className="w-6 h-6" />}
            color="red"
          />
          <SummaryCard
            title="Monthly Spend"
            value={`SAR ${(totalMonthlySpend / 1000).toFixed(1)}K`}
            subtext="SAR 3,200 potential savings"
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Compliance Issues */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Compliance Issues
              </h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>App Name</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSaasApps.slice(0, 5).map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {app.riskLevel === 'critical'
                            ? 'Data outside GCC'
                            : 'Missing encryption'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              app.riskLevel === 'critical'
                                ? 'bg-red-100 text-red-800'
                                : app.riskLevel === 'high'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {app.riskLevel === 'critical'
                              ? 'Critical'
                              : app.riskLevel === 'high'
                                ? 'High'
                                : 'Medium'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50">
                            Open
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-primary">
                            Fix
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: <Activity className="w-5 h-5 text-primary" />,
                    title: 'Microsoft 365 connected',
                    time: '2 hours ago',
                  },
                  {
                    icon: <Zap className="w-5 h-5 text-green-600" />,
                    title: 'Compliance scan completed',
                    time: '1 day ago',
                  },
                  {
                    icon: <Clock className="w-5 h-5 text-blue-600" />,
                    title: 'PDF report generated',
                    time: '2 days ago',
                  },
                  {
                    icon: <Activity className="w-5 h-5 text-purple-600" />,
                    title: 'New user added',
                    time: '3 days ago',
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex gap-3 pb-4 border-b border-border last:border-0">
                    <div className="flex-shrink-0 pt-1">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Compliance Breakdown */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-8">
            Compliance Overview
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            {[
              { label: 'PDPL', score: 78 },
              { label: 'SDAIA', score: 72 },
              { label: 'NCA', score: 65 },
              { label: 'CITC', score: 80 },
              { label: 'SOC2', score: 88 },
            ].map((reg) => (
              <div key={reg.label} className="flex flex-col items-center">
                <ComplianceMeter score={reg.score} size="sm" />
                <p className="mt-4 text-sm font-semibold text-foreground">{reg.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
