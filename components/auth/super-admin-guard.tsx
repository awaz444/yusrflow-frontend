'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, loading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!loading && isAuthenticated) {
             if (!user?.is_super_admin) {
                 // Redirect regular users out of admin area
                 router.push('/');
             }
        } else if (!loading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [user, loading, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Verifying access...</p>
                </div>
            </div>
        );
    }

    if (!user?.is_super_admin) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}
