import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockSaasApps } from '@/lib/mockData';
import { TrendingUp } from 'lucide-react';

function getRiskLevelColor(level: string) {
  switch (level) {
    case 'low':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'high':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'critical':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'compliant':
      return 'bg-green-500/20 text-green-300';
    case 'partial':
      return 'bg-yellow-500/20 text-yellow-300';
    case 'non_compliant':
      return 'bg-red-500/20 text-red-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
  }
}

export function TopAppsSection() {
  return (
    <Card className="border-border bg-card col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">SaaS Applications</CardTitle>
          <span className="text-sm text-muted-foreground">
            {mockSaasApps.length} apps
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-4 font-semibold">Application</th>
                <th className="text-left py-3 px-4 font-semibold">Category</th>
                <th className="text-left py-3 px-4 font-semibold">Score</th>
                <th className="text-left py-3 px-4 font-semibold">Risk</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-right py-3 px-4 font-semibold">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              {mockSaasApps.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="font-medium text-foreground">{app.name}</span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {app.category}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <div className="w-12 bg-secondary/30 rounded-full h-1.5">
                        <div
                          className="bg-accent h-1.5 rounded-full"
                          style={{ width: `${app.complianceScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-accent">
                        {app.complianceScore}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={`capitalize ${getRiskLevelColor(
                        app.riskLevel
                      )}`}
                    >
                      {app.riskLevel}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="secondary"
                      className={`capitalize ${getStatusColor(app.status)}`}
                    >
                      {app.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-semibold text-foreground">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'SAR',
                        minimumFractionDigits: 0,
                      }).format(app.monthlySpend)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
