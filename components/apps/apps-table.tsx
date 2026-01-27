'use client';

import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, MoreVertical } from 'lucide-react';

interface App {
  id: string;
  name: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
  complianceScore: number;
  monthlySpend: number;
  users: number;
  status: 'compliant' | 'partial' | 'non_compliant';
}

interface AppsTableProps {
  apps: App[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectApp: (id: string, checked: boolean) => void;
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

export function AppsTable({
  apps,
  selectedIds,
  onSelectAll,
  onSelectApp,
  onSort,
  sortColumn,
  sortDirection,
}: AppsTableProps) {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500/20 text-green-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'high':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-500/20 text-green-400';
      case 'partial':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'non_compliant':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const SortHeader = ({ column, label }: { column: string; label: string }) => (
    <button
      onClick={() => onSort(column)}
      className="flex items-center gap-2 font-semibold text-foreground hover:text-accent transition-colors"
    >
      {label}
      {sortColumn === column ? (
        sortDirection === 'asc' ? (
          <ArrowUp className="w-4 h-4" />
        ) : (
          <ArrowDown className="w-4 h-4" />
        )
      ) : (
        <ArrowUpDown className="w-4 h-4 opacity-40" />
      )}
    </button>
  );

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-6 py-4 text-left">
                <Checkbox
                  checked={apps.length > 0 && selectedIds.length === apps.length}
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                />
              </th>
              <th className="px-6 py-4 text-left">
                <SortHeader column="name" label="Application" />
              </th>
              <th className="px-6 py-4 text-left">
                <SortHeader column="category" label="Category" />
              </th>
              <th className="px-6 py-4 text-left">
                <SortHeader column="complianceScore" label="Compliance Score" />
              </th>
              <th className="px-6 py-4 text-left">
                <SortHeader column="riskLevel" label="Risk Level" />
              </th>
              <th className="px-6 py-4 text-left">
                <SortHeader column="status" label="Status" />
              </th>
              <th className="px-6 py-4 text-left">
                <SortHeader column="monthlySpend" label="Monthly Spend" />
              </th>
              <th className="px-6 py-4 text-left">
                <SortHeader column="users" label="Users" />
              </th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app, index) => (
              <tr
                key={app.id}
                className={`border-b border-border transition-colors hover:bg-secondary/30 ${index % 2 === 0 ? 'bg-background' : 'bg-secondary/10'
                  }`}
              >
                <td className="px-6 py-4">
                  <Checkbox
                    checked={selectedIds.includes(app.id)}
                    onCheckedChange={(checked) => onSelectApp(app.id, checked as boolean)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{app.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{app.category}</td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${getScoreColor(app.complianceScore)}`}>
                    {app.complianceScore}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(app.riskLevel)}`}>
                    {app.riskLevel.charAt(0).toUpperCase() + app.riskLevel.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    {app.status === 'compliant'
                      ? 'Compliant'
                      : app.status === 'partial'
                        ? 'Partial'
                        : 'Non-Compliant'}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-foreground">SR {app.monthlySpend.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{app.users}</td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {apps.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-muted-foreground">No applications found matching your filters.</p>
        </div>
      )}
    </Card>
  );
}
