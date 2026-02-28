'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import { ShieldAlert, ShieldCheck, Shield, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchFromApi } from '@/lib/api';

interface ReviewRisksModalProps {
    isOpen: boolean;
    onClose: () => void;
    apps: {
        id: string;
        name: string;
        riskLevel: string;
        complianceScore: number;
        status: string;
    }[];
}

const getRiskIcon = (level: string) => {
    switch (level) {
        case 'high':
        case 'critical':
            return <ShieldAlert className="w-5 h-5 text-red-500" />;
        case 'medium':
            return <Shield className="w-5 h-5 text-yellow-500" />;
        case 'low':
        default:
            return <ShieldCheck className="w-5 h-5 text-green-500" />;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'compliant':
            return 'bg-green-500/10 text-green-500 border-green-500/20';
        case 'partial':
            return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        case 'non_compliant':
            return 'bg-red-500/10 text-red-500 border-red-500/20';
        default:
            return 'bg-secondary text-foreground border-border';
    }
};

function AppRiskCard({ app }: { app: any }) {
    const { t } = useLanguage();
    const [isScanning, setIsScanning] = useState(false);

    const mapScores = (a: any) => {
        if (a.detailedScores && a.detailedScores.length > 0) {
            return a.detailedScores.map((score: any) => ({
                id: score.id,
                name: score.rule_code || 'Compliance Check',
                score: score.score,
                isFixed: score.score === 100,
                status: score.status,
                reason: score.reason
            }));
        }
        return [
            { id: 'pdpl', name: 'PDPL (Pending Scan)', score: a.complianceScore, isFixed: false, status: 'pending' },
            { id: 'gdpr', name: 'GDPR (Pending Scan)', score: a.complianceScore, isFixed: false, status: 'pending' }
        ];
    };

    const [compliances, setCompliances] = useState(() => mapScores(app));

    // Re-sync when parent page refreshes the app data after a global scan
    useEffect(() => {
        setCompliances(mapScores(app));
    }, [app.detailedScores, app.complianceScore]);

    const handleFix = async (id: string) => {
        try {
            // Persist the fix to the database so it survives a refresh
            await fetchFromApi(`/reports/engine/score/${id}/resolve`, { method: 'PATCH' });
        } catch (e) {
            console.error('Failed to save fix', e);
        }
        // Optimistically update local UI regardless
        setCompliances((prev: any[]) => prev.map(c =>
            c.id === id ? { ...c, score: 100, isFixed: true, status: 'pass', reason: 'Manually resolved by administrator.' } : c
        ));
    };

    const handleScanApp = async () => {
        setIsScanning(true);
        try {
            const response = await fetchFromApi(`/reports/engine/scan/${app.id}`, {
                method: 'POST'
            });

            if (response.success && response.app && response.app.detailedScores) {
                // Overwrite the local mock UI state with the real AI results immediately
                setCompliances(response.app.detailedScores.map((score: any) => ({
                    id: score.id,
                    name: score.rule_code || 'Compliance Check',
                    score: score.score,
                    isFixed: score.score === 100,
                    status: score.status,
                    reason: score.reason
                })));
            }

            setIsScanning(false);

        } catch (error) {
            console.error('Scan failed', error);
            setIsScanning(false);
        }
    };

    // Calculate new overall score dynamically based on average of standards
    const currentOverallScore = Math.round(compliances.reduce((acc: number, curr: any) => acc + curr.score, 0) / compliances.length) || 0;

    // Calculate new derived risk level based on the current overall score
    const currentRiskLevel = currentOverallScore >= 90 ? 'low' : currentOverallScore >= 70 ? 'medium' : 'high';
    const currentStatus = currentOverallScore >= 90 ? 'compliant' : currentOverallScore >= 70 ? 'partial' : 'non_compliant';

    return (
        <Card className="p-4 bg-card border border-border">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {getRiskIcon(currentRiskLevel)}
                    <div>
                        <h3 className="font-semibold text-lg">{app.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={getStatusColor(currentStatus)}>
                                {currentStatus === 'compliant' ? t('applications.compliant') :
                                    currentStatus === 'partial' ? t('applications.partial') :
                                        t('applications.nonCompliant')}
                            </Badge>
                            <Badge variant="outline" className="bg-secondary">
                                {currentRiskLevel.charAt(0).toUpperCase() + currentRiskLevel.slice(1)} Risk
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                    <div className="text-sm text-muted-foreground">{t('dashboard.complianceScore')}</div>
                    <div className={`text-2xl font-bold transition-colors ${currentOverallScore >= 90 ? 'text-green-500' :
                        currentOverallScore >= 70 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                        {currentOverallScore}%
                    </div>
                    {compliances.every((c: any) => c.status === 'pending') ? (
                        <Button size="sm" variant="secondary" onClick={handleScanApp} disabled={isScanning}>
                            {isScanning ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Scanning...
                                </span>
                            ) : 'Scan with AI'}
                        </Button>
                    ) : (
                        <div className="flex items-center gap-1.5 text-sm text-green-500 font-medium bg-green-500/10 px-2 py-1 rounded-md">
                            <CheckCircle2 className="w-4 h-4" />
                            Verified by AI
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border space-y-4">
                {compliances.map((compliance: any) => (
                    <div key={compliance.id} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <div className="text-sm font-medium">{compliance.name}</div>
                            {!compliance.isFixed ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleFix(compliance.id)}
                                    className="h-7 text-xs"
                                >
                                    {t('applications.fixIssue')}
                                </Button>
                            ) : (
                                <span className="text-xs text-green-500 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> {t('applications.sorted')}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${compliance.score >= 90 ? 'bg-green-500' : compliance.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${compliance.score}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium w-9 text-right">{compliance.score}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export function ReviewRisksModal({ isOpen, onClose, apps }: ReviewRisksModalProps) {
    const { t } = useLanguage();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('applications.reviewRisks')}</DialogTitle>
                    <DialogDescription>
                        Detailed compliance and risk overview for the selected application(s).
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {apps.map((app) => (
                        <AppRiskCard key={app.id} app={app} />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
