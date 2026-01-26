'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout } from 'lucide-react';
import { submitNewPassword } from 'supertokens-auth-react/recipe/emailpassword';
import { AlertCircle, Loader2 } from 'lucide-react';

export function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    // SuperTokens automatically reads the token from the URL query param 'token'
    // But for custom UI with submitNewPassword, we don't strictly need to extract it manually 
    // if the library handles it. However, the library 'submitNewPassword' function 
    // usually requires form fields.
    // Actually, 'submitNewPassword' might need custom logic if we are "consuming" the token.
    // Let's check documentation pattern.
    // Generally: capture new password, call submitNewPassword({ formFields: [...] })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await submitNewPassword({
                formFields: [
                    {
                        id: 'password',
                        value: password,
                    },
                ],
            });

            if (response.status === 'OK') {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            } else {
                setError(response.status === 'RESET_PASSWORD_INVALID_TOKEN_ERROR'
                    ? 'Invalid or expired reset link.'
                    : 'Something went wrong. Please try again.');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-4">
                <h3 className="text-lg font-medium text-green-400">Password Set Successfully!</h3>
                <p className="text-muted-foreground">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                />
            </div>

            <Button type="submit" className="w-full bg-accent text-white" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Set Password'}
            </Button>
        </form>
    );
}
