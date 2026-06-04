'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/lib/i18n/language-context';
import { ShieldAlert, ShieldCheck, Shield, CheckCircle2, Loader2, ChevronDown, ChevronUp, AlertCircle, ClipboardCheck } from 'lucide-react';
import { fetchFromApi } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { appsKeys } from '@/lib/query-keys';
import { usePermissions } from '@/lib/hooks/use-permissions';

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
    const queryClient = useQueryClient();
    const [isScanning, setIsScanning] = useState(false);
    const [isAcknowledging, setIsAcknowledging] = useState<string | null>(null);
    const [acknowledgeNotes, setAcknowledgeNotes] = useState<Record<string, string>>({});
    const [showNotes, setShowNotes] = useState<string | null>(null);

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
            { id: 'ndmo', name: 'NDMO (Pending Scan)', score: a.complianceScore, isFixed: false, status: 'pending' }
        ];
    };

    const [compliances, setCompliances] = useState(() => mapScores(app));

    // Re-sync when parent page refreshes the app data after a global scan
    useEffect(() => {
        setCompliances(mapScores(app));
    }, [app.detailedScores, app.complianceScore]);

    const handleAcknowledge = async (id: string) => {
        const notes = acknowledgeNotes[id]?.trim();
        if (!notes) return; // notes required
        setIsAcknowledging(id);
        try {
            // Persist the acknowledgement with remediation notes
            await fetchFromApi(`/reports/engine/score/${id}/resolve`, {
                method: 'PATCH',
                body: JSON.stringify({ notes }),
            });

            // Optimistically update local UI
            setCompliances((prev: any[]) => prev.map(c =>
                c.id === id ? { ...c, score: 100, isFixed: true, status: 'pass', reason: `Acknowledged: ${notes}` } : c
            ));
            setShowNotes(null);

            // Refresh parent data
            queryClient.invalidateQueries({ queryKey: appsKeys.list() });
        } catch (e) {
            console.error('Failed to save acknowledgement', e);
        } finally {
            setIsAcknowledging(null);
        }
    };

    const handleScanApp = async () => {
        setIsScanning(true);
        try {
            await fetchFromApi(`/reports/engine/scan/${app.id}`, {
                method: 'POST'
            });

            // Poll for completion since evaluation is async on the backend
            const poll = async () => {
                try {
                    const status = await fetchFromApi(`/reports/engine/scan/${app.id}/status`);
                    if (status.isRunning) {
                        setTimeout(poll, 2000);
                    } else {
                        // Evaluation finished, refresh data to get real scores
                        queryClient.invalidateQueries({ queryKey: appsKeys.list() });
                        setIsScanning(false);
                    }
                } catch (e) {
                    console.error('Polling failed', e);
                    setIsScanning(false);
                }
            };
            
            // Start polling after a short delay
            setTimeout(poll, 1000);

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
                            ) : 'Run a Compliance Test'}
                        </Button>
                    ) : (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium bg-secondary/50 px-2 py-1 rounded-md">
                            <ClipboardCheck className="w-4 h-4" />
                            Scan Complete
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border space-y-4">
                {compliances.map((compliance: any) => (
                    <ComplianceItem
                        key={compliance.id}
                        compliance={compliance}
                        onAcknowledge={() => handleAcknowledge(compliance.id)}
                        isAcknowledging={isAcknowledging === compliance.id}
                        notes={acknowledgeNotes[compliance.id] || ''}
                        onNotesChange={(val) => setAcknowledgeNotes(prev => ({ ...prev, [compliance.id]: val }))}
                        showNotes={showNotes === compliance.id}
                        onToggleNotes={() => setShowNotes(prev => prev === compliance.id ? null : compliance.id)}
                        t={t}
                    />
                ))}
            </div>
        </Card>
    );
}

function ComplianceItem({ compliance, onAcknowledge, isAcknowledging, notes, onNotesChange, showNotes, onToggleNotes, t }: {
    compliance: any;
    onAcknowledge: () => void;
    isAcknowledging: boolean;
    notes: string;
    onNotesChange: (val: string) => void;
    showNotes: boolean;
    onToggleNotes: () => void;
    t: any;
}) {
    const { can } = usePermissions();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex flex-col gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors group">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{compliance.name}</div>
                    {isExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                </div>
                {!compliance.isFixed && can('acknowledgeIssue') ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); onToggleNotes(); }}
                        className="h-7 text-xs gap-1"
                    >
                        <ClipboardCheck className="w-3 h-3" />
                        Acknowledge
                    </Button>
                ) : !compliance.isFixed ? (
                    <span className="text-xs text-muted-foreground italic">
                        Needs Auditor review
                    </span>
                ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        Acknowledged
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${compliance.score >= 90 ? 'bg-green-500' : compliance.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${compliance.score}%` }}
                    />
                </div>
                <span className="text-sm font-medium w-9 text-right font-mono">{compliance.score}%</span>
            </div>

            {isExpanded && (
                <div className="text-xs text-muted-foreground bg-secondary/30 p-2 rounded border border-border mt-1 animate-in slide-in-from-top-1 duration-200">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                        <p>{compliance.reason || 'AI evaluation complete. No detailed reasoning provided.'}</p>
                    </div>
                </div>
            )}

            {showNotes && !compliance.isFixed && (
                <div className="mt-1 space-y-2 animate-in slide-in-from-top-1 duration-200" onClick={(e) => e.stopPropagation()}>
                    <p className="text-xs text-muted-foreground">
                        This is a <strong>manual acknowledgement</strong>. Document the remediation actions taken or the reason this finding is accepted.
                    </p>
                    <Textarea
                        placeholder="Describe the remediation action taken or reason for acceptance..."
                        value={notes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        className="text-xs min-h-[70px] resize-none"
                        rows={3}
                    />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            className="h-7 text-xs gap-1 flex-1"
                            onClick={onAcknowledge}
                            disabled={isAcknowledging || !notes.trim()}
                        >
                            {isAcknowledging ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                            Confirm Acknowledgement
                        </Button>
                    </div>
                </div>
            )}
        </div>
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
