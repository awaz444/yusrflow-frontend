'use client';

import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, MoreVertical } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

import type { App } from '@/lib/types';

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
  const { t } = useLanguage();

  const translateCategory = (category: string) => {
    if (!category) return '';
    const key = `categories.${category.toLowerCase().replace(/ /g, '_')}`;
    const translated = t(key);
    return translated !== key ? translated : category;
  };

  const translateRisk = (risk: string) => {
    if (!risk) return '';
    const key = `applications.${risk.toLowerCase()}`;
    const translated = t(key);
    return translated !== key ? translated : risk;
  };

  const translateStatus = (status: string) => {
    if (!status) return '';
    const key = `applications.${status === 'non_compliant' ? 'nonCompliant' : status.toLowerCase()}`;
    const translated = t(key);
    return translated !== key ? translated : status.replace('_', ' ');
  };
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
        <table className="w-full text-sm min-w-[500px] sm:min-w-0">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-6 py-4 text-left">
                <Checkbox
                  checked={apps.length > 0 && selectedIds.length === apps.length}
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                />
              </th>
              <th className="px-6 py-4 text-left">
                <SortHeader column="name" label={t('dashboard.table.application')} />
              </th>
              <th className="px-6 py-4 text-left hidden md:table-cell">
                <SortHeader column="category" label={t('applications.category')} />
              </th>
              <th className="px-6 py-4 text-left">
                <SortHeader column="complianceScore" label={t('dashboard.complianceScore')} />
              </th>
              <th className="px-6 py-4 text-left">
                <SortHeader column="riskLevel" label={t('applications.riskLevel')} />
              </th>
              <th className="px-6 py-4 text-left hidden sm:table-cell">
                <SortHeader column="status" label={t('dashboard.table.status')} />
              </th>
              <th className="px-6 py-4 text-left hidden lg:table-cell">
                <SortHeader column="users" label={t('applications.users')} />
              </th>
              <th className="px-6 py-4 text-left hidden lg:table-cell">
                <SortHeader column="monthlySpend" label="Monthly Spend" />
              </th>
              <th className="px-6 py-4 text-left hidden lg:table-cell">Billing Cycle</th>
              <th className="px-6 py-4 text-left">{t('applications.actions')}</th>
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
                <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{translateCategory(app.category)}</td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${getScoreColor(app.complianceScore)}`}>
                    {app.complianceScore}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-block ${getRiskLevelColor(app.riskLevel)}`}>
                    {translateRisk(app.riskLevel)}
                  </span>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-block ${getStatusColor(app.status)}`}>
                    {translateStatus(app.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">{app.users}</td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  {app.monthlySpend ? (
                    <span className="font-medium text-foreground">
                      {new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(app.monthlySpend)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic truncate max-w-[100px] block" title="Data required">Pending</span>
                  )}
                  {app.costPerUser ? (
                    <span className="text-xs text-muted-foreground block mt-1">
                      ({app.costPerUser} / user)
                    </span>
                  ) : app.manualMonthlyCost ? (
                    <span className="text-xs text-muted-foreground block mt-1">
                      (Flat fee)
                    </span>
                  ) : null}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground capitalize hidden lg:table-cell">{app.billingCycle || 'Monthly'}</td>
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
          <p className="text-muted-foreground">{t('applications.noResults')}</p>
        </div>
      )}
    </Card>
  );
}
