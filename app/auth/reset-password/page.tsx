import { AuthLayout } from '@/components/auth/auth-layout';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export default function ResetPasswordPage() {
    return (
        <AuthLayout
            title="Set Your Password"
            subtitle="Create a secure password for your account"
        >
            <ResetPasswordForm />
        </AuthLayout>
    );
}
