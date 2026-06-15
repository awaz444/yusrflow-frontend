'use client';

import { useState, useEffect } from 'react';
import { IntegrationCard } from '@/components/integrations/integration-card';
import { fetchFromApi } from '@/lib/api';
import { Building2, Link2, RefreshCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { LoadingState } from '@/components/ui/loading-state';
import { useQueryClient } from '@tanstack/react-query';
import { appsKeys, tenantKeys } from '@/lib/query-keys';
import { usePermissions } from '@/lib/hooks/use-permissions';

interface IntegrationStatus {
    provider: 'microsoft' | 'google';
    isConnected: boolean;
    requiresReconnect?: boolean;
    displayName?: string;
    lastSyncAt?: string;
}

type SyncToast = {
    type: 'success' | 'error';
    message: string;
} | null;

export default function IntegrationsPage() {
    const { t, language } = useLanguage();
    const queryClient = useQueryClient();
    const { can } = usePermissions();
    const canManage = can('manageIntegrations');
    const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
    const [discovering, setDiscovering] = useState(false);
    const [syncToast, setSyncToast] = useState<SyncToast>(null);

    useEffect(() => {
        loadIntegrationStatus();
    }, []);

    // Auto-dismiss toast after 6 seconds
    useEffect(() => {
        if (!syncToast) return;
        const timer = setTimeout(() => setSyncToast(null), 6000);
        return () => clearTimeout(timer);
    }, [syncToast]);

    const loadIntegrationStatus = async () => {
        try {
            const statusData = await fetchFromApi('integration/status');
            setIntegrations(statusData);
        } catch (error) {
            console.error('Failed to load integration status:', error);
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
            const origin = window.location.origin;
            const response = await fetchFromApi(`integration/microsoft/auth-url?origin=${encodeURIComponent(origin)}`);
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
            setSyncToast(null);

            const result = await fetchFromApi('integration/discover', { method: 'POST' });

            // Invalidate app and dashboard caches so they reflect fresh data immediately
            await queryClient.invalidateQueries({ queryKey: appsKeys.list() });
            await queryClient.invalidateQueries({ queryKey: tenantKeys.dashboard() });

            setSyncToast({
                type: 'success',
                message: `✓ Sync complete — ${result.discoveredCount ?? 0} app${result.discoveredCount !== 1 ? 's' : ''} discovered from your Microsoft 365 tenant.`,
            });

            await loadIntegrationStatus();
        } catch (error: any) {
            console.error('Failed to discover SaaS apps:', error);
            setSyncToast({
                type: 'error',
                message: `Sync failed: ${error.message || 'Unknown error. Check backend logs.'}`,
            });
        } finally {
            setDiscovering(false);
        }
    };

    const handleConnectGoogle = () => {
        console.log('Google integration coming soon');
    };

    const getMicrosoftStatus = () =>
        integrations.find(i => i.provider === 'microsoft') || { provider: 'microsoft' as const, isConnected: false };

    const getGoogleStatus = () =>
        integrations.find(i => i.provider === 'google') || { provider: 'google' as const, isConnected: false };

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
            <PageHeader
                title={t('integrations.title')}
                description={t('integrations.subtitle')}
                icon={Link2}
            />

            {/* Sync Result Toast */}
            {syncToast && (
                <div className={`mb-6 flex items-start gap-3 p-4 rounded-lg border text-sm font-medium transition-all duration-300 ${
                    syncToast.type === 'success'
                        ? 'bg-green-500/10 border-green-500/30 text-green-500'
                        : 'bg-destructive/10 border-destructive/30 text-destructive'
                }`}>
                    {syncToast.type === 'success'
                        ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                        : <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    }
                    <span>{syncToast.message}</span>
                    <button
                        onClick={() => setSyncToast(null)}
                        className="ml-auto shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                    >✕</button>
                </div>
            )}

            {/* Integration Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    // Only admins can initiate a connection — guard both at UI and API level
                    onConnect={canManage ? handleConnectMicrosoft : undefined}
                    onReconnect={canManage ? handleConnectMicrosoft : undefined}
                />

                <IntegrationCard
                    provider="google"
                    displayName={t('integrations.googleWorkspace')}
                    description={t('integrations.googleWorkspaceDesc')}
                    icon={<Building2 className="w-6 h-6 text-blue-500" />}
                    isConnected={googleStatus.isConnected}
                    isComingSoon={true}
                    onConnect={canManage ? handleConnectGoogle : undefined}
                />
            </div>

            {/* Discovery Section — admin only */}
            {microsoftStatus.isConnected && canManage && (
                <div className="mt-8 p-6 bg-card rounded-lg border border-border">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">{t('integrations.discoverSaaS')}</h2>
                            <p className="text-sm text-muted-foreground">
                                {t('integrations.discoverSaaSDesc')}
                            </p>
                            {microsoftStatus.lastSyncAt && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Last synced:{' '}
                                    <span className="text-foreground font-medium">
                                        {new Intl.DateTimeFormat(
                                            language === 'ar' ? 'ar-EG' : 'en-US',
                                            { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
                                        ).format(new Date(microsoftStatus.lastSyncAt))}
                                    </span>
                                </p>
                            )}
                            {!microsoftStatus.lastSyncAt && (
                                <p className="text-xs text-amber-500 mt-2 font-medium">
                                    ⚠ Not yet synced — click Sync Now to fetch your real Microsoft 365 data.
                                </p>
                            )}
                        </div>
                        <Button
                            onClick={handleDiscoverSaasApps}
                            disabled={discovering}
                            className="shrink-0 flex items-center gap-2"
                        >
                            {discovering
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Syncing…</>
                                : <><RefreshCw className="w-4 h-4" /> {microsoftStatus.lastSyncAt ? 'Re-sync Now' : 'Sync Now'}</>
                            }
                        </Button>
                    </div>
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
