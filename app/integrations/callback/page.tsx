'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchFromApi } from '@/lib/api';
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Phase = 'connecting' | 'syncing' | 'success' | 'error';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [phase, setPhase] = useState<Phase>('connecting');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [discoveredCount, setDiscoveredCount] = useState<number | null>(null);
    const hasProcessed = useRef(false);

    useEffect(() => {
        // Prevent duplicate executions (React Strict Mode runs useEffect twice)
        if (hasProcessed.current) return;

        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
            setPhase('error');
            setErrorMessage(errorDescription || 'OAuth authorization failed');
            return;
        }

        if (!code) {
            setPhase('error');
            setErrorMessage('No authorization code received');
            return;
        }

        if (!state) {
            setPhase('error');
            setErrorMessage('No state parameter received');
            return;
        }

        // Mark as processed before making the API call
        hasProcessed.current = true;

        // Phase 1: Exchange code for tokens, then Phase 2: Sync data
        handleCallback(code, state);
    }, [searchParams]);

    const handleCallback = async (code: string, state: string) => {
        try {
            // ── Phase 1: Exchange OAuth code for tokens ──────────────────────────
            setPhase('connecting');
            const redirectUri = window.location.origin + '/integrations/callback';
            await fetchFromApi('integration/microsoft/callback', {
                method: 'POST',
                body: JSON.stringify({ code, state, redirectUri }),
            });

            // ── Phase 2: Trigger SaaS discovery to populate real M365 data ──────
            // The backend auto-triggers discovery in the background after the callback,
            // but we also trigger it here explicitly via the authenticated endpoint so
            // the user sees the result count and the data is ready when they land on /apps.
            setPhase('syncing');
            try {
                const discoverResult = await fetchFromApi('integration/discover', {
                    method: 'POST',
                });
                setDiscoveredCount(discoverResult?.discoveredCount ?? null);
            } catch (discoveryError: any) {
                // Discovery failure is non-fatal — the account is still connected.
                // The user can trigger discovery manually from the Integrations page.
                console.warn('[Callback] Auto-discovery failed (non-fatal):', discoveryError.message);
                setDiscoveredCount(null);
            }

            setPhase('success');

            // Redirect to integrations page after 3 seconds
            setTimeout(() => {
                router.push('/integrations');
            }, 3000);
        } catch (error: any) {
            console.error('Failed to complete OAuth callback:', error);
            setPhase('error');
            setErrorMessage(error.message || 'Failed to connect Microsoft account');
        }
    };

    const phaseLabel: Record<Phase, string> = {
        connecting: 'Connecting your account…',
        syncing: 'Syncing your Microsoft 365 data…',
        success: 'Connection Successful!',
        error: 'Connection Failed',
    };

    const phaseDescription: Record<Phase, string> = {
        connecting: 'Securely exchanging credentials with Microsoft. Please wait…',
        syncing: 'Discovering apps, users, and licensing from your Microsoft 365 tenant. This may take a moment…',
        success: discoveredCount !== null
            ? `Your Microsoft 365 account is connected. ${discoveredCount} app${discoveredCount !== 1 ? 's' : ''} discovered. Redirecting you shortly…`
            : 'Your Microsoft 365 account has been successfully connected. Redirecting you shortly…',
        error: errorMessage,
    };

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        {(phase === 'connecting') && (
                            <Loader2 className="w-16 h-16 text-primary animate-spin" />
                        )}
                        {(phase === 'syncing') && (
                            <RefreshCw className="w-16 h-16 text-primary animate-spin" />
                        )}
                        {phase === 'success' && (
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                        )}
                        {phase === 'error' && (
                            <XCircle className="w-16 h-16 text-red-500" />
                        )}
                    </div>
                    <CardTitle className="text-2xl">{phaseLabel[phase]}</CardTitle>
                </CardHeader>

                <CardContent className="text-center space-y-4">
                    {phase !== 'error' && (
                        <CardDescription className={phase === 'error' ? 'text-red-500' : ''}>
                            {phaseDescription[phase]}
                        </CardDescription>
                    )}

                    {phase === 'success' && (
                        <Button onClick={() => router.push('/integrations')} className="w-full">
                            Go to Integrations
                        </Button>
                    )}

                    {phase === 'error' && (
                        <>
                            <CardDescription className="text-red-500">
                                {errorMessage}
                            </CardDescription>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/integrations')}
                                    className="flex-1"
                                >
                                    Back to Integrations
                                </Button>
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="flex-1"
                                >
                                    Try Again
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Progress indicator for loading phases */}
                    {(phase === 'connecting' || phase === 'syncing') && (
                        <div className="flex justify-center gap-2 pt-2">
                            <div className={`h-1.5 w-16 rounded-full transition-colors duration-500 ${phase === 'connecting' || phase === 'syncing' ? 'bg-primary' : 'bg-muted'}`} />
                            <div className={`h-1.5 w-16 rounded-full transition-colors duration-500 ${phase === 'syncing' ? 'bg-primary' : 'bg-muted'}`} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}

export default function IntegrationCallbackPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </main>
        }>
            <CallbackContent />
        </Suspense>
    );
}

