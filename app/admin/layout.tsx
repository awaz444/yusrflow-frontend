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
      <div className="flex min-h-screen bg-background text-foreground transition-all duration-300">
        {/* Mobile Header (Hamburger Menu) with glassmorphism */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border/80 bg-card/80 backdrop-blur-md flex items-center px-6 z-30 justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="hover:bg-secondary/80 rounded-lg transition-colors"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent tracking-wide">
              Yusrflow Admin
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground bg-secondary/60 px-2 py-1 rounded-full border border-border/40">
            Superadmin
          </span>
        </div>

        <AdminSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

        {/* Backdrop for mobile with smooth fade in/out */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 w-full md:pl-64 pt-16 md:pt-0 relative overflow-x-hidden min-h-screen flex flex-col">
          <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            {children}
          </div>
        </main>
      </div>
    </SuperAdminGuard>
  );
}
