import { useQuery } from '@tanstack/react-query';
import { fetchAdminUsers } from '../services/admin.service';
import { adminKeys } from '../query-keys';

export function useAdminUsers(filters?: {
  tenantId?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: adminKeys.users(filters),
    queryFn: () => fetchAdminUsers(filters),
  });
}
