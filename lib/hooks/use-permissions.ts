import { useAuth } from '@/lib/auth-context';

type Role = 'admin' | 'manager' | 'auditor' | 'viewer';

const ROLE_HIERARCHY: Record<Role, number> = {
  admin: 4,
  manager: 3,
  auditor: 2,
  viewer: 1,
};

/**
 * Returns a set of permission helpers based on the current user's role.
 *
 * Usage:
 *   const { can } = usePermissions();
 *   if (can('deleteApps')) { ... }
 */
export function usePermissions() {
  const { user } = useAuth();
  const role = (user?.role ?? 'viewer') as Role;
  const level = ROLE_HIERARCHY[role] ?? 0;

  /**
   * Granular capability checks — keeps permission logic in one place
   * rather than scattered if/else comparisons across components.
   */
  const can = (action: PermissionAction): boolean => {
    switch (action) {
      // ── App management ───────────────────────────────────────────
      case 'addApp':
        return level >= ROLE_HIERARCHY.manager;
      case 'deleteApps':
        return level >= ROLE_HIERARCHY.admin;
      case 'importApps':
        return level >= ROLE_HIERARCHY.manager;
      case 'exportApps':
        return level >= ROLE_HIERARCHY.auditor;

      // ── Compliance ───────────────────────────────────────────────
      case 'runComplianceScan':
        return level >= ROLE_HIERARCHY.manager;
      case 'acknowledgeIssue':
        return level >= ROLE_HIERARCHY.auditor;
      case 'downloadReport':
        return level >= ROLE_HIERARCHY.auditor;

      // ── Users ────────────────────────────────────────────────────
      case 'inviteUser':
        return level >= ROLE_HIERARCHY.admin;
      case 'deactivateUser':
        return level >= ROLE_HIERARCHY.admin;

      // ── Integrations ─────────────────────────────────────────────
      case 'manageIntegrations':
        return level >= ROLE_HIERARCHY.admin;

      default:
        return false;
    }
  };

  return { can, role, isSuperAdmin: user?.is_super_admin ?? false };
}

export type PermissionAction =
  | 'addApp'
  | 'deleteApps'
  | 'importApps'
  | 'exportApps'
  | 'runComplianceScan'
  | 'acknowledgeIssue'
  | 'downloadReport'
  | 'inviteUser'
  | 'deactivateUser'
  | 'manageIntegrations';
