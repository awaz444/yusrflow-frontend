'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrainCircuit, Loader2, CheckCircle2 } from 'lucide-react';
import { fetchFromApi } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { ComplianceIssue } from './compliance-issues';

interface IssueRemediationModalProps {
    isOpen: boolean;
    onClose: () => void;
    issue: ComplianceIssue | null;
    onResolved: (issueId: string) => void;
}

export function IssueRemediationModal({ isOpen, onClose, issue, onResolved }: IssueRemediationModalProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isResolving, setIsResolving] = useState(false);
    const [remediationPlan, setRemediationPlan] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && issue) {
            setIsLoading(true);
            setRemediationPlan(null);

            // Call the AI backend endpoint to generate a plan
            fetchFromApi(`/reports/engine/scan/${issue.appId}/remediate/${issue.ruleId}`, {
                method: 'POST'
            })
                .then(data => {
                    if (data.solution) {
                        setRemediationPlan(data.solution);
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
                method: 'PATCH'
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
                </div>

                <div className="flex justify-between items-center mt-6">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={handleResolve}
                        disabled={isLoading || isResolving}
                        className="bg-green-600 hover:bg-green-700 text-white gap-2"
                    >
                        {isResolving ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                        ) : (
                            <><CheckCircle2 className="w-4 h-4" /> Mark as Resolved</>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
