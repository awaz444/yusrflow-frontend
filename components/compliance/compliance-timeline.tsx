'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'success' | 'warning' | 'pending';
}

interface ComplianceTimelineProps {
  events: TimelineEvent[];
}

export function ComplianceTimeline({ events }: ComplianceTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return null;
    }
  };

  const getLineColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/30';
      case 'warning':
        return 'bg-yellow-500/30';
      case 'pending':
        return 'bg-blue-500/30';
      default:
        return 'bg-gray-500/30';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-6">Compliance Activity</h3>

      <div className="relative space-y-6">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-4">
            {/* Timeline line */}
            <div className="relative flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-muted-foreground z-10">
                {getIcon(event.type)}
              </div>
              {index < events.length - 1 && (
                <div className={`w-1 h-12 mt-2 ${getLineColor(event.type)}`} />
              )}
            </div>

            {/* Timeline content */}
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-semibold text-foreground">{event.title}</h4>
                <span className="text-xs text-muted-foreground">{formatDate(event.date)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No compliance events yet.</p>
        </div>
      )}
    </Card>
  );
}
