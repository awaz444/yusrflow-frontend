'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  categories: string[];
  riskLevels: string[];
  statuses: string[];
  selectedCategories: string[];
  selectedRiskLevels: string[];
  selectedStatuses: string[];
  onCategoryChange: (category: string, checked: boolean) => void;
  onRiskLevelChange: (level: string, checked: boolean) => void;
  onStatusChange: (status: string, checked: boolean) => void;
  onReset: () => void;
}

export function FilterSidebar({
  categories,
  riskLevels,
  statuses,
  selectedCategories,
  selectedRiskLevels,
  selectedStatuses,
  onCategoryChange,
  onRiskLevelChange,
  onStatusChange,
  onReset,
}: FilterSidebarProps) {
  const totalFilters = selectedCategories.length + selectedRiskLevels.length + selectedStatuses.length;

  return (
    <Card className="p-6 bg-card border-border h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {totalFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => onCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Level Filter */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Risk Level</h4>
          <div className="space-y-2">
            {riskLevels.map((level) => {
              const colorMap: { [key: string]: string } = {
                low: 'bg-green-500/20 text-green-400',
                medium: 'bg-yellow-500/20 text-yellow-400',
                high: 'bg-red-500/20 text-red-400',
              };

              return (
                <div key={level} className="flex items-center gap-2">
                  <Checkbox
                    id={`risk-${level}`}
                    checked={selectedRiskLevels.includes(level)}
                    onCheckedChange={(checked) => onRiskLevelChange(level, checked as boolean)}
                  />
                  <Label htmlFor={`risk-${level}`} className="text-sm cursor-pointer flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${colorMap[level] || 'bg-gray-400'}`} />
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance Status Filter */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Status</h4>
          <div className="space-y-2">
            {statuses.map((status) => {
              const statusLabels: { [key: string]: string } = {
                compliant: 'Compliant',
                partial: 'Partially Compliant',
                non_compliant: 'Non-Compliant',
              };

              return (
                <div key={status} className="flex items-center gap-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={selectedStatuses.includes(status)}
                    onCheckedChange={(checked) => onStatusChange(status, checked as boolean)}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                    {statusLabels[status] || status}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
