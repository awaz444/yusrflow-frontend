import { fetchFromApi } from '../api';

// ── Admin Dashboard ───────────────────────────────────────────────────────────

export interface SubscriptionBreakdown {
  tier: string;
  count: number;
}

export interface RecentCompany {
  id: string;
  name: string;
  industry: string | null;
  country: string | null;
  subscriptionTier: string | null;
  isActive: boolean | null;
  onboardingStatus: string | null;
  contactEmail: string | null;
  userCount: number;
  createdAt: string | null;
}

export interface AdminDashboardStats {
  totalCompanies: number;
  activeCompanies: number;
  totalUsers: number;
  totalSaasApps: number;
  recentCompanies: RecentCompany[];
  subscriptionBreakdown: SubscriptionBreakdown[];
}

export function fetchAdminDashboard(): Promise<AdminDashboardStats> {
  return fetchFromApi('/admin/dashboard');
}

// ── Tenants ───────────────────────────────────────────────────────────────────

export interface Tenant {
  id: string;
  name: string;
  industry: string | null;
  country: string | null;
  employeeCount: string | null;
  subscriptionTier: string | null;
  isActive: boolean | null;
  onboardingStatus: 'pending' | 'active' | 'suspended' | 'cancelled';
  contactEmail: string | null;
  contactPhone: string | null;
  userCount: number;
  createdAt: string;
}

export interface TenantsResponse {
  tenants: Tenant[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export function fetchAdminTenants(filters?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<TenantsResponse> {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.page) params.set('page', String(filters.page));
  if (filters?.limit) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return fetchFromApi(`/admin/tenants${qs ? `?${qs}` : ''}`);
}

export function fetchAdminTenantById(id: string): Promise<Tenant & { users: any[]; integrations: any[] }> {
  return fetchFromApi(`/admin/tenants/${id}`);
}

export function updateAdminTenantStatus(id: string, status: Tenant['onboardingStatus']): Promise<{ message: string; tenant: any }> {
  return fetchFromApi(`/admin/tenants/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ── Users ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  department: string | null;
  job_title: string | null;
  is_active: boolean | null;
  last_login_at: string | null;
  created_at: string;
  tenant_id: string | null;
  tenant?: { name: string } | null;
}

export interface AdminUsersResponse {
  data: AdminUser[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export function fetchAdminUsers(filters?: {
  tenantId?: string;
  role?: string;
  page?: number;
  limit?: number;
}): Promise<AdminUsersResponse> {
  const params = new URLSearchParams();
  if (filters?.tenantId) params.set('tenantId', filters.tenantId);
  if (filters?.role) params.set('role', filters.role);
  if (filters?.page) params.set('page', String(filters.page));
  if (filters?.limit) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return fetchFromApi(`/admin/users${qs ? `?${qs}` : ''}`);
}

// ── SaaS Discovery ────────────────────────────────────────────────────────────

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

export function triggerSaasDiscovery(): Promise<SaasApp[]> {
  return fetchFromApi('/saas-discovery/discover', { method: 'POST' });
}

export function fetchSaasApps(): Promise<SaasApp[]> {
  return fetchFromApi('/saas-discovery/discover', { method: 'POST' });
}

export function fetchShadowIT(): Promise<SaasApp[]> {
  return fetchFromApi('/saas-discovery/shadow-it');
}

export function fetchAppUsageStats(days = 30): Promise<AppUsageStats> {
  return fetchFromApi(`/saas-discovery/usage?days=${days}`);
}
