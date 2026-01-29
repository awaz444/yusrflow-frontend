import { fetchFromApi } from '../api';

export interface SaasApp {
    id: string;
    name: string;
    vendor?: string;
    category?: string;
    risk_level?: string;
    is_shadow_it: boolean;
    detected_via: string;
    created_at: string;
}

export type AppUsageStats = Record<string, number>;

export const saasDiscoveryService = {
    triggerDiscovery: async () => {
        return fetchFromApi('/saas-discovery/discover', {
            method: 'POST',
        });
    },

    getAppUsage: async (days: number = 30): Promise<AppUsageStats> => {
        return fetchFromApi(`/saas-discovery/usage?days=${days}`, {
            method: 'GET',
        });
    },

    getShadowIT: async (): Promise<SaasApp[]> => {
        // Since shadow IT returns discovered apps that are shadow IT
        // The backend returns a list of objects similar to SaasApp
        return fetchFromApi('/saas-discovery/shadow-it', {
            method: 'GET',
        });
    },

    // Helper to get all discovered apps (assuming we might need a generic list endpoint later, or reusing discover response)
    // For now, triggerDiscovery returns the list of discovered apps
};
