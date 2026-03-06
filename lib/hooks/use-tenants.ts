import { useQuery } from '@tanstack/react-query';
import { fetchAdminTenants, fetchAdminTenantById } from '../services/admin.service';
import { adminKeys } from '../query-keys';

export function useTenants(filters?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: adminKeys.tenants(filters),
    queryFn: () => fetchAdminTenants(filters),
  });
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: adminKeys.tenant(id),
    queryFn: () => fetchAdminTenantById(id),
    enabled: Boolean(id),
  });
}
