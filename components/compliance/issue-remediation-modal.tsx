'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Loader2, CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, ClipboardCheck } from 'lucide-react';
import { fetchFromApi } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { ComplianceIssue } from './compliance-issues';
import { usePermissions } from '@/lib/hooks/use-permissions';

interface AlternativeApp {
    name: string;
    description: string;
    pdplCompliance: string;
    website: string;
}

interface IssueRemediationModalProps {
    isOpen: boolean;
    onClose: () => void;
    issue: ComplianceIssue | null;
    onResolved: (issueId: string) => void;
}

export function IssueRemediationModal({ isOpen, onClose, issue, onResolved }: IssueRemediationModalProps) {
    const { can } = usePermissions();
    const [isLoading, setIsLoading] = useState(true);
    const [isResolving, setIsResolving] = useState(false);
    const [remediationPlan, setRemediationPlan] = useState<string | null>(null);
    const [alternatives, setAlternatives] = useState<AlternativeApp[]>([]);
    const [notes, setNotes] = useState('');
    const [showNotes, setShowNotes] = useState(false);

    useEffect(() => {
        if (isOpen && issue) {
            setIsLoading(true);
            setRemediationPlan(null);
            setAlternatives([]);
            setNotes('');
            setShowNotes(false);

            // Call the AI backend endpoint to generate a plan
            fetchFromApi(`/reports/engine/scan/${issue.appId}/remediate/${issue.ruleId}`, {
                method: 'POST'
            })
                .then(data => {
                    if (data.solution) {
                        setRemediationPlan(data.solution);
                    }
                    if (Array.isArray(data.alternatives)) {
                        setAlternatives(data.alternatives);
                    }
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, issue]);

    const handleResolve = async () => {
        if (!issue) return;
        setIsResolving(true);
        try {
            await fetchFromApi(`/reports/engine/score/${issue.id}/resolve`, {
                method: 'PATCH',
                body: JSON.stringify({ notes: notes.trim() })
            });
            onResolved(issue.id);
            onClose();
        } catch (error) {
            console.error('Failed to resolve issue', error);
        } finally {
            setIsResolving(false);
        }
    };

    if (!issue) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] bg-background border-border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <BrainCircuit className="w-5 h-5 text-purple-500" />
                        AI Remediation Analysis
                    </DialogTitle>
                    <DialogDescription>
                        {issue.title}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <div className="bg-muted p-4 rounded-lg mb-4 text-sm border border-border">
                        <strong>Identified Flaw:</strong> {issue.description}
                    </div>

                    <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-card">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                <p>Gemini is gathering context and generating a specific fix for {issue.affectedApps[0]}...</p>
                            </div>
                        ) : remediationPlan ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown border-border="true">
                                    {remediationPlan}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="text-center text-red-500">Failed to generate a remediation plan.</div>
                        )}
                    </ScrollArea>

                    {/* PDPL-Compliant Alternatives — shown only for PDPL failures */}
                    {!isLoading && issue.regulation === 'PDPL' && alternatives.length > 0 && (
                        <div className="mt-5">
                            <div className="flex items-center gap-2 mb-3">
                                <ShieldCheck className="w-4 h-4 text-green-400" />
                                <h4 className="text-sm font-semibold text-foreground">
                                    PDPL-Compliant Alternatives for {issue.affectedApps[0]}
                                </h4>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                                If remediation is not feasible, consider switching to one of these apps verified for Saudi PDPL compliance:
                            </p>
                            <div className="space-y-2">
                                {alternatives.map((alt, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start justify-between gap-3 rounded-lg border border-green-500/20 bg-green-500/5 p-3"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-semibold text-foreground">{alt.name}</span>
                                                <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 rounded px-1.5 py-0.5 font-medium">
                                                    PDPL Friendly
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-1">{alt.description}</p>
                                            <div className="flex items-start gap-1 text-xs text-green-400">
                                                <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                <span>{alt.pdplCompliance}</span>
                                            </div>
                                        </div>
                                        {alt.website && (
                                            <a
                                                href={alt.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-shrink-0"
                                            >
                                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                                                    <ExternalLink className="w-3 h-3" />
                                                    Visit
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {showNotes ? (
                    <div className="mt-6 space-y-4 border-t pt-4">
                        <div>
                            <label className="text-xs font-semibold text-foreground mb-1 block">Remediation & Acceptance Notes (Required)</label>
                            <p className="text-xs text-muted-foreground mb-2">
                                Document the remediation action taken or the reason this finding is manually acknowledged.
                            </p>
                            <Textarea
                                placeholder="Describe the remediation action taken or reason for acceptance..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="text-xs min-h-[80px]"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <Button variant="outline" onClick={() => setShowNotes(false)}>
                                Back
                            </Button>
                            <Button
                                onClick={handleResolve}
                                disabled={isLoading || isResolving || !notes.trim()}
                                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                            >
                                {isResolving ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Acknowledging...</>
                                ) : (
                                    <><ClipboardCheck className="w-4 h-4" /> Confirm Acknowledgement</>
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center mt-6">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        {can('acknowledgeIssue') ? (
                            <Button
                                onClick={() => setShowNotes(true)}
                                disabled={isLoading}
                                className="bg-accent hover:bg-accent/90 text-white gap-2"
                            >
                                <ClipboardCheck className="w-4 h-4" />
                                Acknowledge Issue
                            </Button>
                        ) : (
                            <span className="text-xs text-muted-foreground italic">
                                Auditor or Admin privileges required to acknowledge compliance issues
                            </span>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
