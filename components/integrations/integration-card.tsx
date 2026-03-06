'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

interface IntegrationCardProps {
    provider: 'microsoft' | 'google';
    displayName: string;
    description: string;
    icon: React.ReactNode;
    isConnected: boolean;
    isComingSoon?: boolean;
    isLoading?: boolean;
    onConnect: () => void;
    onReconnect?: () => void;
    onDisconnect?: () => void;
}

export function IntegrationCard({
    provider,
    displayName,
    description,
    icon,
    isConnected,
    isComingSoon = false,
    isLoading = false,
    onConnect,
    onReconnect,
    onDisconnect,
}: IntegrationCardProps) {
    const { t } = useLanguage();

    return (
        <Card className="relative overflow-hidden transition-all hover:shadow-lg">
            {isComingSoon && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                        {t('integrations.comingSoon')}
                    </Badge>
                </div>
            )}

            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            {icon}
                        </div>
                        <div>
                            <CardTitle className="text-xl">{displayName}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                {isConnected ? (
                                    <Badge variant="default" className="bg-green-500/10 text-green-600 dark:text-green-400">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        {t('integrations.connected')}
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-muted">
                                        <XCircle className="w-3 h-3 mr-1" />
                                        {t('integrations.notConnected')}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <CardDescription className="text-sm">
                    {description}
                </CardDescription>

                <div className="flex gap-2">
                    {isConnected ? (
                        <>
                            <Button variant="outline" size="sm" disabled>
                                {t('integrations.manage')}
                            </Button>
                            {onReconnect && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={onReconnect}
                                    disabled={isLoading}
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {t('integrations.reconnect')}
                                </Button>
                            )}
                            {onDisconnect && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={onDisconnect}
                                    disabled={isLoading}
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {t('integrations.disconnect')}
                                </Button>
                            )}
                        </>
                    ) : (
                        <Button
                            onClick={onConnect}
                            disabled={isComingSoon || isLoading}
                            className="w-full"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {t('integrations.connect').replace('{app}', displayName)}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
