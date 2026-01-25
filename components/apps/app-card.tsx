'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, AlertCircle } from 'lucide-react';
import { ComplianceMeter } from '@/components/dashboard/compliance-meter';

interface AppCardProps {
  name: string;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  dataRegion: string;
  monthlySpend: number;
  users: number;
  onViewDetails?: () => void;
  onFixIssues?: () => void;
}

export function AppCard({
  name,
  complianceScore,
  riskLevel,
  dataRegion,
  monthlySpend,
  users,
  onViewDetails,
  onFixIssues,
}: AppCardProps) {
  const riskColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  const riskLabels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
    critical: 'Critical',
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all hover:border-primary/50 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground text-lg">{name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{dataRegion}</p>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Compliance Score */}
      <div className="mb-6 flex justify-center">
        <div className="w-24 h-24">
          <ComplianceMeter score={complianceScore} size="sm" />
        </div>
      </div>

      {/* Risk Level */}
      <div className="mb-4">
        <Badge className={riskColors[riskLevel]}>
          {riskLabels[riskLevel]}
        </Badge>
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-4 py-4 border-t border-b border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Monthly Cost</span>
          <span className="font-semibold text-foreground">SAR {monthlySpend.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Users</span>
          <span className="font-semibold text-foreground">{users}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-transparent"
          onClick={onViewDetails}
        >
          <Eye className="w-4 h-4 mr-2" />
          Details
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-orange-600 hover:text-orange-700 border-orange-200 hover:bg-orange-50 bg-transparent"
          onClick={onFixIssues}
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Fix Issues
        </Button>
      </div>
    </Card>
  );
}
