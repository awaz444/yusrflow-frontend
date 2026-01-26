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
            websiteBasePath: '/auth/login', // Point to actual login page
        },
        recipeList: [
            EmailPassword.init({
                signInAndUpFeature: {
                    signInForm: {
                        style: `
                            [data-supertokens~=container] {
                                --palette-background: 9, 9, 11;
                                --palette-inputBackground: 24, 24, 27;
                                --palette-inputBorder: 39, 39, 42;
                                --palette-textTitle: 250, 250, 250;
                                --palette-textLabel: 161, 161, 170;
                                --palette-textPrimary: 250, 250, 250;
                                --palette-error: 220, 38, 38;
                                --palette-textInput: 250, 250, 250;
                                --palette-textLink: 109, 92, 255;
                            }
                        `
                    }
                }
            }),
            Session.init({
                tokenTransferMethod: "header" // or "cookie" if you prefer
            }),
        ],
    };
};


