'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface ComplianceScore {
  regulation: string;
  score: number;
  trend: number;
  status: 'compliant' | 'partial' | 'at-risk';
}

interface ComplianceOverviewProps {
  scores: ComplianceScore[];
}

export function ComplianceOverview({ scores }: ComplianceOverviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'partial':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'at-risk':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'Compliant';
      case 'partial':
        return 'Partial';
      case 'at-risk':
        return 'At Risk';
      default:
        return status;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {scores.map((score) => (
        <Card
          key={score.regulation}
          className={`p-6 border-2 ${getStatusColor(score.status)} transition-all hover:shadow-lg`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{score.regulation}</p>
              <h3 className="text-3xl font-bold">{score.score}%</h3>
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${
                score.trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              {score.trend >= 0 ? '+' : ''}{score.trend}%
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-background/50 rounded-full h-2">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(score.score)}`}
                style={{ width: `${score.score}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{getStatusLabel(score.status)}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
