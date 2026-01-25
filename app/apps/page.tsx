'use client';

import { useState, useMemo } from 'react';
import { AppsHeader } from '@/components/apps/apps-header';
import { FilterSidebar } from '@/components/apps/filter-sidebar';
import { AppsTable } from '@/components/apps/apps-table';
import { BulkActions } from '@/components/apps/bulk-actions';
import { mockSaasApps } from '@/lib/mockData';

type SortColumn = 'name' | 'category' | 'complianceScore' | 'riskLevel' | 'status' | 'monthlySpend' | 'users';

export default function AppsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const categories = useMemo(
    () => [...new Set(mockSaasApps.map((app) => app.category))].sort(),
    []
  );
  const riskLevels = ['low', 'medium', 'high'];
  const statuses = ['compliant', 'partial', 'non_compliant'];

  const filteredAndSortedApps = useMemo(() => {
    let filtered = mockSaasApps.filter((app) => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(app.category);
      const matchesRiskLevel =
        selectedRiskLevels.length === 0 || selectedRiskLevels.includes(app.riskLevel);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(app.status);

      return matchesSearch && matchesCategory && matchesRiskLevel && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, selectedCategories, selectedRiskLevels, selectedStatuses, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column as SortColumn);
      setSortDirection('asc');
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  };

  const handleRiskLevelChange = (level: string, checked: boolean) => {
    setSelectedRiskLevels((prev) =>
      checked ? [...prev, level] : prev.filter((l) => l !== level)
    );
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    setSelectedStatuses((prev) =>
      checked ? [...prev, status] : prev.filter((s) => s !== status)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedAppIds(checked ? filteredAndSortedApps.map((app) => app.id) : []);
  };

  const handleSelectApp = (id: string, checked: boolean) => {
    setSelectedAppIds((prev) =>
      checked ? [...prev, id] : prev.filter((appId) => appId !== id)
    );
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedRiskLevels([]);
    setSelectedStatuses([]);
  };

  const handleClearSelection = () => {
    setSelectedAppIds([]);
  };

  const handleExportCompliance = () => {
    console.log('Exporting compliance report for:', selectedAppIds);
    // TODO: Implement export functionality
  };

  const handleReviewRisks = () => {
    console.log('Reviewing risks for:', selectedAppIds);
    // TODO: Implement risk review functionality
  };

  const handleRemoveApps = () => {
    console.log('Removing apps:', selectedAppIds);
    // TODO: Implement remove functionality
  };

  const handleExport = () => {
    console.log('Exporting all apps');
    // TODO: Implement export functionality
  };

  const handleAddApp = () => {
    console.log('Adding new app');
    // TODO: Implement add app modal
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AppsHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddApp={handleAddApp}
          onExport={handleExport}
          appCount={mockSaasApps.length}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside>
            <FilterSidebar
              categories={categories}
              riskLevels={riskLevels}
              statuses={statuses}
              selectedCategories={selectedCategories}
              selectedRiskLevels={selectedRiskLevels}
              selectedStatuses={selectedStatuses}
              onCategoryChange={handleCategoryChange}
              onRiskLevelChange={handleRiskLevelChange}
              onStatusChange={handleStatusChange}
              onReset={handleResetFilters}
            />
          </aside>

          <div className="lg:col-span-3 space-y-4 flex flex-col">
            <div className="flex-1">
              <AppsTable
                apps={filteredAndSortedApps}
                selectedIds={selectedAppIds}
                onSelectAll={handleSelectAll}
                onSelectApp={handleSelectApp}
                onSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
              />
            </div>

            {selectedAppIds.length > 0 && (
              <BulkActions
                selectedCount={selectedAppIds.length}
                onExportCompliance={handleExportCompliance}
                onReviewRisks={handleReviewRisks}
                onRemove={handleRemoveApps}
                onClose={handleClearSelection}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
