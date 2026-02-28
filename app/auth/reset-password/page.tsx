import { Suspense } from 'react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
    return (
        <AuthLayout
            title="Set Your Password"
            subtitle="Create a secure password for your account"
        >
            <Suspense fallback={<div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}>
                <ResetPasswordForm />
            </Suspense>
        </AuthLayout>
    );
}
