import { useQuery } from '@tanstack/react-query';
import { fetchAdminDashboard } from '../services/admin.service';
import { adminKeys } from '../query-keys';

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: fetchAdminDashboard,
  });
}
