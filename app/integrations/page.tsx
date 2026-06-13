'use client';

import { useState, useEffect } from 'react';
import { IntegrationCard } from '@/components/integrations/integration-card';
import { fetchFromApi } from '@/lib/api';
import { Building2, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { LoadingState } from '@/components/ui/loading-state';

interface IntegrationStatus {
    provider: 'microsoft' | 'google';
    isConnected: boolean;
    requiresReconnect?: boolean;
    displayName?: string;
    lastSyncAt?: string;
}

export default function IntegrationsPage() {
    const { t, language } = useLanguage();
    const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
    const [discovering, setDiscovering] = useState(false);

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

    const handleDiscoverSaasApps = async () => {
        try {
            setDiscovering(true);
            const result = await fetchFromApi('integration/discover', {
                method: 'POST',
            });

            alert(t('integrations.discoveryComplete').replace('{count}', result.discoveredCount));

            // Reload integration status to update last sync time
            await loadIntegrationStatus();
        } catch (error: any) {
            console.error('Failed to discover SaaS apps:', error);
            alert(t('integrations.discoveryFailed').replace('{error}', error.message || 'Unknown error'));
        } finally {
            setDiscovering(false);
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
            <PageContainer>
                <div className="animate-pulse">
                    <LoadingState message="Loading integration status..." />
                </div>
            </PageContainer>
        );
    }

    const microsoftStatus = getMicrosoftStatus();
    const googleStatus = getGoogleStatus();

    return (
        <PageContainer>
            {/* Page Header */}
            <PageHeader
                title={t('integrations.title')}
                description={t('integrations.subtitle')}
                icon={Link2}
            />

                {/* Integration Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Microsoft 365 Integration */}
                    <IntegrationCard
                        provider="microsoft"
                        displayName={t('integrations.microsoft365')}
                        description={t('integrations.microsoft365Desc')}
                        icon={
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                <path d="M11.5 0v11.5H0V0h11.5zm0 12.5V24H0V12.5h11.5zm12.5-12.5v11.5H12.5V0H24zm0 12.5V24H12.5V12.5H24z" fill="#f25022" />
                                <path d="M11.5 0v11.5H0V0h11.5z" fill="#7fba00" />
                                <path d="M24 0v11.5H12.5V0H24z" fill="#00a4ef" />
                                <path d="M11.5 12.5V24H0V12.5h11.5z" fill="#ffb900" />
                            </svg>
                        }
                        isConnected={microsoftStatus.isConnected}
                        requiresReconnect={microsoftStatus.requiresReconnect}
                        isLoading={connectingProvider === 'microsoft'}
                        onConnect={handleConnectMicrosoft}
                        onReconnect={handleConnectMicrosoft}
                    />

                    {/* Google Workspace Integration */}
                    <IntegrationCard
                        provider="google"
                        displayName={t('integrations.googleWorkspace')}
                        description={t('integrations.googleWorkspaceDesc')}
                        icon={
                            <Building2 className="w-6 h-6 text-blue-500" />
                        }
                        isConnected={googleStatus.isConnected}
                        isComingSoon={true}
                        onConnect={handleConnectGoogle}
                    />
                </div>

                {/* Discovery Section - Only show if Microsoft is connected*/}
                {microsoftStatus.isConnected && (
                    <div className="mt-8 p-6 bg-card rounded-lg border border-border">
                        <h2 className="text-xl font-semibold mb-2">{t('integrations.discoverSaaS')}</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            {t('integrations.discoverSaaSDesc')}
                        </p>
                        <Button
                            onClick={handleDiscoverSaasApps}
                            disabled={discovering}
                            className="w-full sm:w-auto"
                        >
                            {discovering ? t('integrations.discovering') : t('integrations.discoverApps')}
                        </Button>
                        {microsoftStatus.lastSyncAt && (
                            <p className="text-xs text-muted-foreground mt-2">
                                {t('integrations.lastDiscovery')}: {new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(microsoftStatus.lastSyncAt))}
                            </p>
                        )}
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-12 p-6 bg-muted/50 rounded-lg border border-border">
                    <h2 className="text-lg font-semibold mb-2">{t('integrations.whyConnect')}</h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span><strong>{t('integrations.automatedDiscoveryTitle')}:</strong> {t('integrations.automatedDiscoveryDesc')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span><strong>{t('integrations.complianceMonitoringTitle')}:</strong> {t('integrations.complianceMonitoringDesc')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span><strong>{t('integrations.securityInsightsTitle')}:</strong> {t('integrations.securityInsightsDesc')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span><strong>{t('integrations.userActivityTitle')}:</strong> {t('integrations.userActivityDesc')}</span>
                        </li>
                    </ul>
                </div>
        </PageContainer>
    );
}
