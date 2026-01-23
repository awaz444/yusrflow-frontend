'use client';

import React from "react"

import { Card } from '@/components/ui/card';
import { TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface ComplianceStatItem {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface ComplianceStatsProps {
  stats: ComplianceStatItem[];
}

export function ComplianceStats({ stats }: ComplianceStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6 bg-card border-border">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
            <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-green-500/20 text-green-400">
              <TrendingUp className="w-3 h-3" />
              {stat.change >= 0 ? '+' : ''}{stat.change}%
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
}
