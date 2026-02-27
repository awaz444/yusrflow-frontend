'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/lib/i18n/language-context';
import { Loader2 } from 'lucide-react';

interface AddAppModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}

export function AddAppModal({ isOpen, onClose, onSubmit }: AddAppModalProps) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        riskLevel: 'medium',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await onSubmit(formData);
            setFormData({ name: '', category: '', riskLevel: 'medium' });
            onClose();
        } catch (error) {
            console.error('Failed to add app:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('applications.addAppModalTitle')}</DialogTitle>
                    <DialogDescription>
                        {t('applications.addAppModalDesc')}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('applications.appNameLabel')}</Label>
                        <Input
                            id="name"
                            placeholder={t('applications.appNamePlaceholder')}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">{t('applications.appCategoryLabel')}</Label>
                        <Input
                            id="category"
                            placeholder={t('applications.appCategoryPlaceholder')}
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="riskLevel">{t('applications.riskLevelLabel')}</Label>
                        <Select
                            value={formData.riskLevel}
                            onValueChange={(value) => setFormData({ ...formData, riskLevel: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('applications.selectRiskLevel')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">{t('dashboard.riskLevels.low')}</SelectItem>
                                <SelectItem value="medium">{t('dashboard.riskLevels.medium')}</SelectItem>
                                <SelectItem value="high">{t('dashboard.riskLevels.high')}</SelectItem>
                                <SelectItem value="critical">{t('dashboard.riskLevels.critical') || 'Critical Risk'}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            {t('applications.cancel')}
                        </Button>
                        <Button type="submit" disabled={!formData.name || loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {t('applications.saveApplication')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
