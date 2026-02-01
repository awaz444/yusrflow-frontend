'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Don't show sidebar on auth pages, admin pages, or tenant setup
    const shouldHideSidebar =
        pathname.startsWith('/auth') ||
        pathname.startsWith('/admin') ||
        pathname === '/tenant-setup';

    if (shouldHideSidebar) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
