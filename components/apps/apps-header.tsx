'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Filter, Plus, Search, UploadCloud } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

interface AppsHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddApp: () => void;
  onImportApp: () => void;
  onExport: () => void;
  appCount: number;
  onToggleFilters?: () => void;
}

export function AppsHeader({
  searchTerm,
  onSearchChange,
  onAddApp,
  onImportApp,
  onExport,
  appCount,
  onToggleFilters,
}: AppsHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('applications.title')}</h1>
        <p className="text-muted-foreground">
          {t('applications.managePrefix')} {appCount} {t('applications.manageSuffix')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder={t('applications.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-secondary border-border hover:border-border focus:border-accent w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {onToggleFilters && (
            <Button onClick={onToggleFilters} variant="outline" className="lg:hidden border-border hover:bg-background gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          )}

          <Button onClick={onExport} variant="outline" className="border-border hover:bg-background gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            {t('common.export')}
          </Button>

          <Button onClick={onImportApp} variant="outline" className="border-border hover:bg-background gap-2 bg-transparent">
            <UploadCloud className="w-4 h-4" />
            Import Application
          </Button>

          <Button onClick={onAddApp} className="bg-accent hover:bg-accent/90 text-white gap-2">
            <Plus className="w-4 h-4" />
            {t('applications.addApp')}
          </Button>
        </div>
      </div>
    </div>
  );
}
