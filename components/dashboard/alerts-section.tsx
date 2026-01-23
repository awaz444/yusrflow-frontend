import { AlertCircle, AlertTriangle, PaletteIcon as AlertIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAlerts } from '@/lib/mockData';

function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'critical':
      return <AlertIcon className="h-5 w-5 text-red-500" />;
    case 'high':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  }
}

function getSeverityBadgeClass(severity: string) {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/20 text-red-400';
    case 'high':
      return 'bg-orange-500/20 text-orange-400';
    default:
      return 'bg-yellow-500/20 text-yellow-400';
  }
}

export function AlertsSection() {
  return (
    <Card className="border-border bg-card col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Active Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex gap-3 rounded-lg border border-border/50 bg-secondary/20 p-3"
            >
              <div className="flex-shrink-0 pt-0.5">
                {getSeverityIcon(alert.severity)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {alert.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.description}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getSeverityBadgeClass(
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {alert.app} •{' '}
                  {alert.timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
