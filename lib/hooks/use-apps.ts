import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFromApi } from '@/lib/api';
import { appsKeys } from '@/lib/query-keys';
import type { App } from '@/lib/types';

function mapApp(app: any): App {
  return {
    id: app.id,
    name: app.name,
    category: app.category || 'Uncategorized',
    riskLevel: (app.riskLevel as 'low' | 'medium' | 'high' | 'critical') || 'medium',
    complianceScore: app.complianceScore || 0,
    users: app.users || 0,
    status: app.status || 'compliant',
    costPerUser: app.costPerUser,
    manualMonthlyCost: app.manualMonthlyCost,
    monthlySpend: app.monthlySpend,
    billingCycle: app.billingCycle,
    renewalDate: app.renewalDate,
    detailedScores: app.detailedScores,
  };
}

export function useApps() {
  return useQuery<App[]>({
    queryKey: appsKeys.list(),
    queryFn: async () => {
      const response = await fetchFromApi('/tenants/apps');
      const data = response.data || response;
      return (data as any[]).map(mapApp);
    },
  });
}

export function useAddApp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      fetchFromApi('/tenants/apps', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appsKeys.list() });
    },
  });
}

export function useDeleteApps() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appIds: string[]) =>
      fetchFromApi('/tenants/apps', {
        method: 'DELETE',
        body: JSON.stringify({ appIds }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appsKeys.list() });
    },
  });
}
