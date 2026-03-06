import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSaasApps,
  fetchShadowIT,
  fetchAppUsageStats,
  triggerSaasDiscovery,
} from '../services/admin.service';
import { adminKeys } from '../query-keys';

export function useSaasApps() {
  return useQuery({
    queryKey: adminKeys.saasApps(),
    queryFn: fetchSaasApps,
    // Discovery endpoint is a POST — treat result as cached data
    staleTime: 10 * 60 * 1000,
  });
}

export function useShadowIT() {
  return useQuery({
    queryKey: adminKeys.shadowIT(),
    queryFn: fetchShadowIT,
  });
}

export function useUsageStats(days = 30) {
  return useQuery({
    queryKey: adminKeys.usageStats(days),
    queryFn: () => fetchAppUsageStats(days),
  });
}

export function useTriggerDiscovery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: triggerSaasDiscovery,
    onSuccess: (data) => {
      // Directly update the cached saas apps with fresh data
      queryClient.setQueryData(adminKeys.saasApps(), data);
      // Invalidate shadow IT and usage since a new scan may change them
      queryClient.invalidateQueries({ queryKey: adminKeys.shadowIT() });
      queryClient.invalidateQueries({ queryKey: adminKeys.usageStats(30) });
    },
  });
}
