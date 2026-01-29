'use client';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { SuperAdminGuard } from '@/components/auth/super-admin-guard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SuperAdminGuard>
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </SuperAdminGuard>
  );
}
