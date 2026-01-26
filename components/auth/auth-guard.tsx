'use client';

import React, { useEffect } from 'react';
import { SessionAuth, useSessionContext } from 'supertokens-auth-react/recipe/session';
import { useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <SessionAuth
            onSessionExpired={() => {
                router.push('/auth/login');
            }}
            overrideGlobalClaimValidators={() => []}
        >
            <AuthGuardContent>{children}</AuthGuardContent>
        </SessionAuth>
    );
}

function AuthGuardContent({ children }: { children: React.ReactNode }) {
    const session = useSessionContext();
    const router = useRouter();

    useEffect(() => {
        if (session.loading === false) {
            if (!session.doesSessionExist) {
                router.push('/auth/login');
            }
        }
    }, [session, router]);

    if (session.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (session.loading === false && !session.doesSessionExist) {
        return null;
    }

    return <>{children}</>;
}
