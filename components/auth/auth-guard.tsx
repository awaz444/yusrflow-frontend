'use client';

import React from 'react';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';
import { useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <SessionAuth
            onSessionExpired={() => {
                router.push('/auth/login');
            }}
        >
            {children}
        </SessionAuth>
    );
}
