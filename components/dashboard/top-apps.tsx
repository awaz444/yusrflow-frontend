'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Search,
  Filter,
  AppWindow
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

function getRiskLevelColor(level: string) {
  switch (level?.toLowerCase()) {
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
  switch (status?.toLowerCase()) {
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

type SortField = 'name' | 'category' | 'complianceScore' | 'riskLevel' | 'status';
type SortDirection = 'asc' | 'desc';

export function TopAppsSection({ apps }: { apps: any[] }) {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('riskLevel');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Advanced Filter States
  const [riskFilters, setRiskFilters] = useState<string[]>(['critical', 'high', 'medium', 'low']);
  const [statusFilters, setStatusFilters] = useState<string[]>(['compliant', 'partial', 'non_compliant']);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to desc when changing field
    }
  };

  const toggleRiskFilter = (risk: string) => {
    setRiskFilters(prev =>
      prev.includes(risk)
        ? prev.filter(r => r !== risk)
        : [...prev, risk]
    );
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const getRiskWeight = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };

  const filteredAndSortedApps = useMemo(() => {
    // First filter
    let processed = apps.filter(app => {
      // Risk & Status advanced filters
      if (app.riskLevel && !riskFilters.includes(app.riskLevel.toLowerCase())) return false;
      if (app.status && !statusFilters.includes(app.status.toLowerCase())) return false;

      // Text Search
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        app.name?.toLowerCase().includes(term) ||
        app.category?.toLowerCase().includes(term) ||
        app.riskLevel?.toLowerCase().includes(term) ||
        app.status?.replace('_', ' ').toLowerCase().includes(term)
      );
    });

    // Then sort
    processed.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
        case 'category':
        case 'status':
          const strA = String(a[sortField] || '');
          const strB = String(b[sortField] || '');
          comparison = strA.localeCompare(strB);
          break;
        case 'complianceScore':
          comparison = (a[sortField] || 0) - (b[sortField] || 0);
          break;
        case 'riskLevel':
          comparison = getRiskWeight(a.riskLevel) - getRiskWeight(b.riskLevel);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return processed;
  }, [apps, searchTerm, sortField, sortDirection, riskFilters, statusFilters]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3 inline text-muted-foreground/50" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="ml-1 h-3 w-3 inline text-foreground" />
      : <ArrowDown className="ml-1 h-3 w-3 inline text-foreground" />;
  };

  const Th = ({ field, label, align = 'left', className }: { field: SortField, label: string, align?: 'left' | 'right', className?: string }) => (
    <th
      className={`py-3 px-4 font-semibold cursor-pointer hover:bg-secondary/30 transition-colors ${align === 'right' ? 'text-right' : 'text-left'} ${className || ''}`}
      onClick={() => handleSort(field)}
    >
      <div className={`flex items-center ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );

  return (
    <Card className="border-border bg-card w-full min-w-0 overflow-hidden">
      <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <CardTitle className="text-lg">{t('dashboard.overview.saasApplications')}</CardTitle>
          <span className="text-sm text-muted-foreground sm:hidden tracking-tighter">
            {filteredAndSortedApps.length} apps
          </span>
        </div>

        <div className="flex items-center justify-end flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('dashboard.table.searchPlaceholder')}
              className="w-full pl-9 bg-background/50 border-border/50 text-sm h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 border-border/50 bg-background/50">
                <Filter className="mr-2 h-4 w-4" />
                {t('dashboard.table.filters')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuLabel>Risk Level</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuCheckboxItem checked={riskFilters.includes('critical')} onCheckedChange={() => toggleRiskFilter('critical')}>
                <span className="text-red-400">Critical</span>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={riskFilters.includes('high')} onCheckedChange={() => toggleRiskFilter('high')}>
                <span className="text-orange-400">High</span>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={riskFilters.includes('medium')} onCheckedChange={() => toggleRiskFilter('medium')}>
                <span className="text-yellow-400">Medium</span>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={riskFilters.includes('low')} onCheckedChange={() => toggleRiskFilter('low')}>
                <span className="text-green-400">Low</span>
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator className="bg-border mt-2" />
              <DropdownMenuLabel>Compliance Status</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuCheckboxItem checked={statusFilters.includes('compliant')} onCheckedChange={() => toggleStatusFilter('compliant')}>
                <span className="text-green-300">Compliant</span>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={statusFilters.includes('partial')} onCheckedChange={() => toggleStatusFilter('partial')}>
                <span className="text-yellow-300">Partial</span>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={statusFilters.includes('non_compliant')} onCheckedChange={() => toggleStatusFilter('non_compliant')}>
                <span className="text-red-300">Non Compliant</span>
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-sm text-muted-foreground hidden lg:block whitespace-nowrap ml-2 min-w-[60px] text-right">
            {filteredAndSortedApps.length} apps
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 overflow-hidden">
        <div className="overflow-x-auto rounded-md border border-border/50 w-full">
          <table className="w-full text-sm min-w-[450px] sm:min-w-0">
            <thead>
              <tr className="border-b border-border bg-secondary/10 text-muted-foreground">
                <Th field="name" label={t('dashboard.table.application')} />
                <Th field="category" label={t('dashboard.table.category')} className="hidden md:table-cell" />
                <Th field="complianceScore" label={t('dashboard.table.score')} />
                <Th field="riskLevel" label={t('dashboard.table.risk')} />
                <Th field="status" label={t('dashboard.table.status')} className="hidden sm:table-cell" />
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-0 border-none">
                    <EmptyState
                      icon={AppWindow}
                      title="No applications found"
                      description="Adjust your filters or add some SaaS applications."
                      className="border-none min-h-[250px] bg-transparent"
                    />
                  </td>
                </tr>
              ) : (
                filteredAndSortedApps.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors last:border-0"
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground">{app.name}</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">
                      {translateCategory(app.category)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary/50 rounded-full h-2">
                          <div
                            className="bg-accent h-2 rounded-full"
                            style={{ width: `${app.complianceScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-accent w-8">
                          {app.complianceScore}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={`capitalize font-medium ${getRiskLevelColor(
                          app.riskLevel
                        )}`}
                      >
                        {translateRisk(app.riskLevel)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <Badge
                        variant="secondary"
                        className={`capitalize font-medium ${getStatusColor(app.status)}`}
                      >
                        {translateStatus(app.status)}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
