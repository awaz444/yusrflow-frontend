'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const router = useRouter();

    React.useEffect(() => {
        // Redirect /auth to /auth/login
        router.replace('/auth/login');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Redirecting...</p>
            </div>
        </div>
    );
}
