'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Don't show sidebar on auth pages, admin pages, or tenant setup
    const shouldHideSidebar =
        !pathname ||
        pathname === '/' ||
        pathname.startsWith('/auth') ||
        pathname.startsWith('/admin') ||
        pathname === '/tenant-setup';

    if (shouldHideSidebar) {
        return <>{children}</>;
    }

    return (
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
                <div className="font-bold ml-4">Yusrflow</div>
            </div>

            {/* Sidebar with mobile drawer state */}
            <Sidebar 
                isOpen={isMobileOpen} 
                onClose={() => setIsMobileOpen(false)} 
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            {/* Backdrop for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <main className={cn(
                "flex-1 w-full mt-16 md:mt-0 relative overflow-x-hidden min-h-screen transition-all duration-300",
                isCollapsed ? "md:ml-20" : "md:ml-64"
            )}>
                {children}
            </main>
        </div>
    );
}
