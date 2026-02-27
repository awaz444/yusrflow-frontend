'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/auth/login');
            } else if (user?.is_super_admin && !pathname?.startsWith('/admin')) {
                // Optional: Redirect super admin to admin dashboard if they try to access tenant dashboard
                if (!pathname?.startsWith('/settings')) { // Allow settings access
                    router.push('/admin/dashboard');
                }
            } else if (!user?.is_super_admin && pathname?.startsWith('/admin')) {
                // Prevent regular users from accessing admin
                router.push('/');
            }
        }
    }, [user, loading, isAuthenticated, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
