'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, AlertCircle } from 'lucide-react';

interface RuleCardProps {
  title: string;
  description: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  affectedApps: string[];
  remediation: string;
  expanded?: boolean;
}

export function RuleCard({
  title,
  description,
  status,
  affectedApps,
  remediation,
  expanded = false,
}: RuleCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(expanded);

  const statusConfig = {
    compliant: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-800' },
    partial: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' },
    'non-compliant': { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-800' },
  };

  const config = statusConfig[status];
  const statusLabel = {
    compliant: 'Compliant',
    partial: 'Partially Compliant',
    'non-compliant': `Non-Compliant (${affectedApps.length} apps)`,
  };

  return (
    <Card className={`p-6 cursor-pointer transition-colors hover:bg-gray-50 ${config.bg}`}>
      <div onClick={() => setIsExpanded(!isExpanded)} className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex items-center gap-2">
            <Badge className={config.badge}>
              {statusLabel[status]}
            </Badge>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Affected Applications</h4>
            <div className="flex flex-wrap gap-2">
              {affectedApps.map((app) => (
                <Badge key={app} variant="outline">
                  {app}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Remediation Steps
            </h4>
            <p className="text-sm text-muted-foreground">{remediation}</p>
          </div>
          <Button variant="outline" className="w-full bg-transparent">
            View Detailed Fix Guide
          </Button>
        </div>
      )}
    </Card>
  );
}
