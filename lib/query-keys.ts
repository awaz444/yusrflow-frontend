export const adminKeys = {
  all: ['admin'] as const,

  dashboard: () => [...adminKeys.all, 'dashboard'] as const,

  tenants: (filters?: { status?: string; page?: number; limit?: number }) =>
    filters ? ([...adminKeys.all, 'tenants', filters] as const) : ([...adminKeys.all, 'tenants'] as const),

  tenant: (id: string) => [...adminKeys.all, 'tenants', id] as const,

  users: (filters?: { tenantId?: string; role?: string; page?: number }) =>
    filters ? ([...adminKeys.all, 'users', filters] as const) : ([...adminKeys.all, 'users'] as const),

  saasApps: () => [...adminKeys.all, 'saas-apps'] as const,
  shadowIT: () => [...adminKeys.all, 'shadow-it'] as const,
  usageStats: (days: number) => [...adminKeys.all, 'usage-stats', days] as const,
};
