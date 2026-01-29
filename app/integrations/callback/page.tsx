'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchFromApi } from '@/lib/api';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const hasProcessed = useRef(false);

    useEffect(() => {
        // Prevent duplicate executions (React Strict Mode runs useEffect twice)
        if (hasProcessed.current) return;

        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
            setStatus('error');
            setErrorMessage(errorDescription || 'OAuth authorization failed');
            return;
        }

        if (!code) {
            setStatus('error');
            setErrorMessage('No authorization code received');
            return;
        }

        if (!state) {
            setStatus('error');
            setErrorMessage('No state parameter received');
            return;
        }

        // Mark as processed before making the API call
        hasProcessed.current = true;

        // Exchange code for tokens
        handleCallback(code, state);
    }, [searchParams]);

    const handleCallback = async (code: string, state: string) => {
        try {
            setStatus('loading');

            // Call backend to exchange code for tokens
            await fetchFromApi('integration/microsoft/callback', {
                method: 'POST',
                body: JSON.stringify({ code, state }),
            });

            setStatus('success');

            // Redirect to integrations page after 2 seconds
            setTimeout(() => {
                router.push('/integrations');
            }, 2000);
        } catch (error: any) {
            console.error('Failed to complete OAuth callback:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Failed to connect Microsoft account');
        }
    };

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        {status === 'loading' && (
                            <Loader2 className="w-16 h-16 text-primary animate-spin" />
                        )}
                        {status === 'success' && (
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                        )}
                        {status === 'error' && (
                            <XCircle className="w-16 h-16 text-red-500" />
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {status === 'loading' && 'Connecting...'}
                        {status === 'success' && 'Connection Successful!'}
                        {status === 'error' && 'Connection Failed'}
                    </CardTitle>
                </CardHeader>

                <CardContent className="text-center space-y-4">
                    {status === 'loading' && (
                        <CardDescription>
                            Please wait while we complete your Microsoft 365 integration...
                        </CardDescription>
                    )}

                    {status === 'success' && (
                        <>
                            <CardDescription>
                                Your Microsoft 365 account has been successfully connected. You will be redirected shortly.
                            </CardDescription>
                            <Button onClick={() => router.push('/integrations')} className="w-full">
                                Go to Integrations
                            </Button>
                        </>
                    )}

                    {status === 'error' && (
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
