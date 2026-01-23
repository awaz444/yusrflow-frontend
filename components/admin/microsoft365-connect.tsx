'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n/language-context';
import { CheckCircle, AlertCircle, Settings as SettingsIcon } from 'lucide-react';

export function Microsoft365Connect() {
  const { t } = useLanguage();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [connectedApps, setConnectedApps] = useState<string[]>([
    'Microsoft Teams',
    'OneDrive',
    'SharePoint',
    'Exchange Online',
  ]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Simulate connection to Microsoft 365
      // In production, this would initiate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsConnected(true);
      setLastSync(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLastSync(new Date().toLocaleString());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-accent" />
              {t('admin.microsoft365')}
            </CardTitle>
            <CardDescription>{t('admin.connectM365')}</CardDescription>
          </div>
          {isConnected && (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Connected</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isConnected ? (
          <div className="space-y-4">
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-3">{t('admin.connectedApps')}</h4>
              <div className="grid grid-cols-2 gap-3">
                {connectedApps.map((app) => (
                  <div key={app} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>{t('admin.syncStatus')}:</strong> Active
              </p>
              {lastSync && (
                <p className="text-sm text-muted-foreground">
                  <strong>{t('admin.lastSync')}:</strong> {lastSync}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSync}
                disabled={isLoading}
                className="bg-accent hover:bg-accent/90"
              >
                {isLoading ? 'Syncing...' : 'Manual Sync'}
              </Button>
              <Button
                onClick={() => setIsConnected(false)}
                variant="outline"
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-900">Not Connected</p>
                <p className="text-amber-800 text-xs mt-1">
                  Connect your Microsoft 365 account to automatically discover and track all SaaS applications
                  used across your organization.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">What will be accessed:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>Application and service usage data</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>User access logs and audit trails</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>Integration and API connection data</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>Security and compliance configurations</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleConnect}
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90"
            >
              {isLoading ? 'Connecting...' : 'Connect Microsoft 365'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
