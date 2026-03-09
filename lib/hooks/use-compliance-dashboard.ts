import { useQuery } from '@tanstack/react-query';
import { fetchFromApi } from '@/lib/api';
import { tenantKeys } from '@/lib/query-keys';

export function useComplianceDashboard() {
  return useQuery({
    queryKey: tenantKeys.compliance(),
    queryFn: async () => {
      const response = await fetchFromApi('/tenants/compliance');
      return response.data || response;
    },
  });
}
