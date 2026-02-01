'use client';

import { useState, useMemo, useEffect } from 'react';
import { AppsHeader } from '@/components/apps/apps-header';
import { FilterSidebar } from '@/components/apps/filter-sidebar';
import { AppsTable } from '@/components/apps/apps-table';
import { BulkActions } from '@/components/apps/bulk-actions';
import { fetchFromApi } from '@/lib/api';

type SortColumn = 'name' | 'category' | 'complianceScore' | 'riskLevel' | 'status' | 'monthlySpend' | 'users';

// Define the shape expected by the UI
interface SaasApp {
  id: string;
  name: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
  complianceScore: number;
  monthlySpend: number;
  users: number;
  status: 'compliant' | 'partial' | 'non_compliant';
}

export default function AppsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [apps, setApps] = useState<SaasApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApps() {
      try {
        const data = await fetchFromApi('saas-scanner');
        // Map backend data to frontend shape if necessary
        const mappedApps = data.map((app: any) => ({
          id: app.id,
          name: app.name,
          category: app.category || 'Uncategorized',
          riskLevel: (app.riskLevel as 'low' | 'medium' | 'high') || 'medium',
          complianceScore: 0,
          monthlySpend: 0,
          users: 0,
          status: 'compliant',
        }));
        setApps(mappedApps);
      } catch (error) {
        console.error('Failed to load apps:', error);
        // Set empty array so UI doesn't break
        setApps([]);
      } finally {
        setLoading(false);
      }
    }

    loadApps();
  }, []);

  const categories = useMemo(
    () => [...new Set(apps.map((app) => app.category))].sort(),
    [apps]
  );
  const riskLevels = ['low', 'medium', 'high'];
  const statuses = ['compliant', 'partial', 'non_compliant'];

  const filteredAndSortedApps = useMemo(() => {
    let filtered = apps.filter((app) => {
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
  }, [apps, searchTerm, selectedCategories, selectedRiskLevels, selectedStatuses, sortColumn, sortDirection]);

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

  if (loading) {
    return <div className="p-8">Loading apps...</div>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <AppsHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddApp={handleAddApp}
          onExport={handleExport}
          appCount={apps.length}
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
    </>
  );
}
