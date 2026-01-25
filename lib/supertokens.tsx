'use client';

import SuperTokens from 'supertokens-auth-react';
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword';
import Session from 'supertokens-auth-react/recipe/session';

export const frontendConfig = () => {
    return {
        appInfo: {
            appName: 'Yusrflow',
            apiDomain: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
            websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000',
            apiBasePath: '/auth',
            websiteBasePath: '/auth',
        },
        recipeList: [
            EmailPassword.init(),
            Session.init({
                tokenTransferMethod: "header" // or "cookie" if you prefer
            }),
        ],
    };
};


