'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Shield, Trash2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

interface BulkActionsProps {
  selectedCount: number;
  onExportCompliance: () => void;
  onReviewRisks: () => void;
  onRemove: () => void;
  onClose: () => void;
}

export function BulkActions({
  selectedCount,
  onExportCompliance,
  onReviewRisks,
  onRemove,
  onClose,
}: BulkActionsProps) {
  const { t } = useLanguage();

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 md:left-64 z-50 pointer-events-none">
      <Card className="bg-card/80 backdrop-blur-md border-accent/20 p-4 shadow-2xl flex items-center justify-between gap-4 w-full max-w-5xl pointer-events-auto">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium">
            {selectedCount} {t('common.applications')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCompliance}
            className="border-border hover:bg-background bg-transparent"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            {t('applications.exportReport')}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onReviewRisks}
            className="border-border hover:bg-background bg-transparent"
          >
            <Shield className="w-4 h-4 mr-2" />
            {t('applications.reviewRisks')}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('common.delete')}
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            {t('common.clearSelection')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
