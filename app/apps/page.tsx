'use client';

import { useState, useMemo } from 'react';
import { AppsHeader } from '@/components/apps/apps-header';
import { FilterSidebar } from '@/components/apps/filter-sidebar';
import { AppsTable } from '@/components/apps/apps-table';
import { BulkActions } from '@/components/apps/bulk-actions';
import { AddAppModal } from '@/components/apps/add-app-modal';
import { ReviewRisksModal } from '@/components/apps/review-risks-modal';
import { useLanguage } from '@/lib/i18n/language-context';
import { ImportAppModal } from '@/components/apps/import-app-modal';
import { useApps, useAddApp, useDeleteApps } from '@/lib/hooks/use-apps';
import { useQueryClient } from '@tanstack/react-query';
import { appsKeys } from '@/lib/query-keys';
import type { App } from '@/lib/types';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { AppWindow } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type SortColumn = 'name' | 'category' | 'complianceScore' | 'riskLevel' | 'status' | 'users';

export default function AppsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isReviewRisksModalOpen, setIsReviewRisksModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  const { data: apps = [], isLoading, error } = useApps();
  const addApp = useAddApp();
  const deleteApps = useDeleteApps();
  const queryClient = useQueryClient();

  const categories = useMemo(
    () => [...new Set((apps || []).map((app: App) => app.category))].sort(),
    [apps]
  );
  const riskLevels = ['low', 'medium', 'high'];
  const statuses = ['compliant', 'partial', 'non_compliant'];

  const filteredAndSortedApps = useMemo(() => {
    let filtered = (apps || []).filter((app: App) => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(app.category);
      const matchesRiskLevel =
        selectedRiskLevels.length === 0 || selectedRiskLevels.includes(app.riskLevel);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(app.status);

      return matchesSearch && matchesCategory && matchesRiskLevel && matchesStatus;
    });

    // Sort
    filtered.sort((a: App, b: App) => {
      let aValue: any = a[sortColumn as keyof App];
      let bValue: any = b[sortColumn as keyof App];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
      if (bValue === undefined) return sortDirection === 'asc' ? -1 : 1;

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
    setSelectedAppIds(checked ? filteredAndSortedApps.map((app: App) => app.id) : []);
  };

  const handleSelectApp = (id: string, checked: boolean) => {
    setSelectedAppIds((prev: string[]) =>
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

  const downloadCSV = (data: App[], filename: string) => {
    const headers = ['URL / ID', 'Name', 'Category', 'Compliance Score', 'Risk Level', 'Status', 'Active Users'];

    const csvContent = [
      headers.join(','),
      ...data.map((app) =>
        [
          `"${app.id}"`,
          `"${app.name}"`,
          `"${app.category}"`,
          `${app.complianceScore}%`,
          `"${app.riskLevel}"`,
          `"${app.status}"`,
          app.users,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCompliance = () => {
    const selectedAppsData = (apps || []).filter((app: App) => selectedAppIds.includes(app.id));
    downloadCSV(selectedAppsData, 'compliance-report.csv');
  };

  const selectedAppsData = useMemo(() => {
    return (apps || []).filter((app: App) => selectedAppIds.includes(app.id)) as App[];
  }, [apps, selectedAppIds]);

  const handleReviewRisks = () => {
    setIsReviewRisksModalOpen(true);
  };

  const handleRemoveApps = async () => {
    try {
      if (!confirm(t('applications.deleteAppConfirm').replace('{count}', selectedAppIds.length.toString()))) return;

      await deleteApps.mutateAsync(selectedAppIds);
      setSelectedAppIds([]);
    } catch (error) {
      console.error('Failed to remove apps:', error);
      alert(t('applications.deleteFailed'));
    }
  };

  const handleExport = () => {
    downloadCSV(filteredAndSortedApps, 'saas-applications.csv');
  };

  const handleAddApp = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveApp = async (data: any) => {
    try {
      await addApp.mutateAsync(data);
    } catch (error) {
      console.error('Failed to save app:', error);
      alert('Failed to save application. Please try again.');
    }
  };


  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState message={t('applications.loading') || "Loading applications..."} />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          icon={AppWindow}
          title="Error Loading Applications"
          description={String(error)}
          className="border-destructive/20 bg-destructive/5"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        <AppsHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddApp={() => setIsAddModalOpen(true)}
          onImportApp={() => setIsImportModalOpen(true)}
          onExport={handleExport}
          appCount={filteredAndSortedApps?.length || 0}
          onToggleFilters={() => setIsFiltersOpen(true)}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="hidden lg:block">
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
              {filteredAndSortedApps.length === 0 ? (
                <EmptyState
                  icon={AppWindow}
                  title="No applications found"
                  description="We couldn't find any SaaS applications matching your search or filters."
                  action={
                    <button onClick={handleResetFilters} className="text-primary hover:underline">
                      Clear filters
                    </button>
                  }
                />
              ) : (
                <AppsTable
                  apps={filteredAndSortedApps}
                  selectedIds={selectedAppIds}
                  onSelectAll={handleSelectAll}
                  onSelectApp={handleSelectApp}
                  onSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                />
              )}
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

      <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <DialogContent className="max-w-md p-6 max-h-[85vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>Filter Applications</DialogTitle>
          </DialogHeader>
          <div className="py-4">
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <AddAppModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSaveApp}
      />
      <ImportAppModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: appsKeys.list() })}
      />
      <ReviewRisksModal
        isOpen={isReviewRisksModalOpen}
        onClose={() => setIsReviewRisksModalOpen(false)}
        apps={selectedAppsData}
      />
    </PageContainer>
  );
}
