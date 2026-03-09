import { useQuery } from '@tanstack/react-query';
import { fetchFromApi } from '@/lib/api';
import { tenantKeys } from '@/lib/query-keys';

export function useTenantDashboard() {
  return useQuery({
    queryKey: tenantKeys.dashboard(),
    queryFn: async () => {
      const res = await fetchFromApi('/tenants/dashboard');
      return res.data || res;
    },
  });
}
