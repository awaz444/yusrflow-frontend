'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  regulation: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved';
  affectedApps: string[];
  dueDate: Date;
}

interface ComplianceIssuesProps {
  issues: ComplianceIssue[];
  onResolve: (id: string) => void;
}

export function ComplianceIssues({ issues, onResolve }: ComplianceIssuesProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <Clock className="w-5 h-5" />;
      case 'low':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return { color: 'bg-red-500/20 text-red-400', label: 'Open' };
      case 'in-progress':
        return { color: 'bg-blue-500/20 text-blue-400', label: 'In Progress' };
      case 'resolved':
        return { color: 'bg-green-500/20 text-green-400', label: 'Resolved' };
      default:
        return { color: 'bg-gray-500/20 text-gray-400', label: status };
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {issues.length === 0 ? (
        <Card className="p-12 text-center bg-card border-border">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <p className="text-foreground font-semibold mb-2">All compliance issues resolved!</p>
          <p className="text-muted-foreground">Your organization is in good standing.</p>
        </Card>
      ) : (
        issues.map((issue) => {
          const statusInfo = getStatusBadge(issue.status);

          return (
            <Card
              key={issue.id}
              className={`p-6 bg-card border-2 transition-all hover:shadow-lg cursor-pointer ${getSeverityColor(
                issue.severity
              )}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="mt-1">{getSeverityIcon(issue.severity)}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{issue.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>

                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <Badge variant="outline" className="bg-background/50">
                          {issue.regulation}
                        </Badge>
                        <Badge variant="outline" className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <p className="mb-2">
                          <span className="font-medium">Affected Apps:</span> {issue.affectedApps.join(', ')}
                        </p>
                        <p>
                          <span className="font-medium">Due Date:</span> {formatDate(issue.dueDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onResolve(issue.id)}
                  disabled={issue.status === 'resolved'}
                  className="ml-2 flex-shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
