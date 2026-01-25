'use client';

import React from 'react';
import { SuperTokensWrapper } from 'supertokens-auth-react';
import { frontendConfig } from '@/lib/supertokens';
import SuperTokens from 'supertokens-auth-react';

if (typeof window !== 'undefined') {
    SuperTokens.init(frontendConfig());
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SuperTokensWrapper>
            {children}
        </SuperTokensWrapper>
    );
}
