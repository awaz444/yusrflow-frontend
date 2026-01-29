'use client';

import { useState, useEffect } from 'react';
import { IntegrationCard } from '@/components/integrations/integration-card';
import { fetchFromApi } from '@/lib/api';
import { Building2 } from 'lucide-react';

interface IntegrationStatus {
    provider: 'microsoft' | 'google';
    isConnected: boolean;
    displayName?: string;
    lastSyncAt?: string;
}

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [connectingProvider, setConnectingProvider] = useState<string | null>(null);

    useEffect(() => {
        loadIntegrationStatus();
    }, []);

    const loadIntegrationStatus = async () => {
        try {
            const statusData = await fetchFromApi('integration/status');
            setIntegrations(statusData);
        } catch (error) {
            console.error('Failed to load integration status:', error);
            // Set default empty states
            setIntegrations([
                { provider: 'microsoft', isConnected: false },
                { provider: 'google', isConnected: false },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleConnectMicrosoft = async () => {
        try {
            setConnectingProvider('microsoft');
            const response = await fetchFromApi('integration/microsoft/auth-url');

            // Redirect to Microsoft OAuth
            if (response.url) {
                window.location.href = response.url;
            }
        } catch (error) {
            console.error('Failed to get Microsoft auth URL:', error);
            setConnectingProvider(null);
        }
    };

    const handleConnectGoogle = () => {
        // Placeholder for Google OAuth
        console.log('Google integration coming soon');
    };

    const getMicrosoftStatus = () => {
        return integrations.find(i => i.provider === 'microsoft') || { provider: 'microsoft' as const, isConnected: false };
    };

    const getGoogleStatus = () => {
        return integrations.find(i => i.provider === 'google') || { provider: 'google' as const, isConnected: false };
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-muted rounded w-64 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-96 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-64 bg-muted rounded-lg"></div>
                            <div className="h-64 bg-muted rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const microsoftStatus = getMicrosoftStatus();
    const googleStatus = getGoogleStatus();

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Integrations</h1>
                    <p className="text-muted-foreground">
                        Connect your cloud services to enable automated discovery and compliance monitoring
                    </p>
                </div>

                {/* Integration Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Microsoft 365 Integration */}
                    <IntegrationCard
                        provider="microsoft"
                        displayName="Microsoft 365"
                        description="Connect your Microsoft 365 account to discover SaaS applications, monitor user activity, and ensure compliance with organizational policies."
                        icon={
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                <path d="M11.5 0v11.5H0V0h11.5zm0 12.5V24H0V12.5h11.5zm12.5-12.5v11.5H12.5V0H24zm0 12.5V24H12.5V12.5H24z" fill="#f25022" />
                                <path d="M11.5 0v11.5H0V0h11.5z" fill="#7fba00" />
                                <path d="M24 0v11.5H12.5V0H24z" fill="#00a4ef" />
                                <path d="M11.5 12.5V24H0V12.5h11.5z" fill="#ffb900" />
                            </svg>
                        }
                        isConnected={microsoftStatus.isConnected}
                        isLoading={connectingProvider === 'microsoft'}
                        onConnect={handleConnectMicrosoft}
                    />

                    {/* Google Workspace Integration */}
                    <IntegrationCard
                        provider="google"
                        displayName="Google Workspace"
                        description="Connect your Google Workspace to discover cloud applications, track usage patterns, and maintain security compliance standards."
                        icon={
                            <Building2 className="w-6 h-6 text-blue-500" />
                        }
                        isConnected={googleStatus.isConnected}
                        isComingSoon={true}
                        onConnect={handleConnectGoogle}
                    />
                </div>

                {/* Info Section */}
                <div className="mt-12 p-6 bg-muted/50 rounded-lg border border-border">
                    <h2 className="text-lg font-semibold mb-2">Why Connect Integrations?</h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span><strong>Automated Discovery:</strong> Automatically discover all SaaS applications used in your organization</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span><strong>Compliance Monitoring:</strong> Track compliance with regulations like PDPL, GDPR, and internal policies</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span><strong>Security Insights:</strong> Identify shadow IT and assess security risks across your applications</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span><strong>User Activity:</strong> Monitor employee productivity and optimize application usage</span>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
