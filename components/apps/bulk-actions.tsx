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
    <Card className="bg-card border-accent/30 p-4 sticky bottom-0 flex items-center justify-between gap-4">
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
  );
}
