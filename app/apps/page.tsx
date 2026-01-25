'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppCard } from '@/components/apps/app-card';
import { mockSaasApps } from '@/lib/mockData';
import { Search, SlidersHorizontal, Grid2X2, List } from 'lucide-react';

type ViewMode = 'grid' | 'list';

export default function AppsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string | null>(null);
  const [complianceFilter, setComplianceFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredApps = mockSaasApps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = !riskFilter || app.riskLevel === riskFilter;
    const matchesCompliance =
      !complianceFilter ||
      (complianceFilter === 'compliant' && app.complianceScore >= 80) ||
      (complianceFilter === 'partial' && app.complianceScore >= 60 && app.complianceScore < 80) ||
      (complianceFilter === 'non-compliant' && app.complianceScore < 60);

    return matchesSearch && matchesRisk && matchesCompliance;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <main className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            SaaS Applications
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor all connected applications
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Search Applications
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by app name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Risk Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Risk Level
              </label>
              <Select value={riskFilter || 'all'} onValueChange={(val) => setRiskFilter(val === 'all' ? null : val)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Compliance Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Compliance Status
              </label>
              <Select
                value={complianceFilter || 'all'}
                onValueChange={(val) => setComplianceFilter(val === 'all' ? null : val)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="partial">Partially Compliant</SelectItem>
                  <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid2X2 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(riskFilter || complianceFilter || searchTerm) && (
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {riskFilter && (
                <Badge variant="secondary">
                  Risk: {riskFilter}
                  <button
                    onClick={() => setRiskFilter(null)}
                    className="ml-1 hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {complianceFilter && (
                <Badge variant="secondary">
                  Compliance: {complianceFilter}
                  <button
                    onClick={() => setComplianceFilter(null)}
                    className="ml-1 hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredApps.length} of {mockSaasApps.length} applications
          </p>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>

        {/* Applications Grid */}
        {filteredApps.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                name={app.name}
                complianceScore={app.complianceScore}
                riskLevel={app.riskLevel}
                dataRegion={app.dataRegion || 'Global'}
                monthlySpend={app.monthlySpend}
                users={app.users}
                onViewDetails={() => console.log('View details for', app.name)}
                onFixIssues={() => console.log('Fix issues for', app.name)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No applications found</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setRiskFilter(null);
              setComplianceFilter(null);
            }}>
              Clear Filters
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
