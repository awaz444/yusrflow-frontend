'use client';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { SuperAdminGuard } from '@/components/auth/super-admin-guard';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <SuperAdminGuard>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Mobile Header (Hamburger Menu) */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-card flex items-center px-4 z-30">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
            <div className="font-bold ml-4 text-red-500">Admin Portal</div>
        </div>

        <AdminSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

        {/* Backdrop for mobile */}
        {isMobileOpen && (
            <div
                className="fixed inset-0 bg-black/50 z-30 md:hidden"
                onClick={() => setIsMobileOpen(false)}
            />
        )}

        <main className="flex-1 w-full md:ml-64 mt-16 md:mt-0 relative overflow-x-hidden min-h-screen">
          {children}
        </main>
      </div>
    </SuperAdminGuard>
  );
}
