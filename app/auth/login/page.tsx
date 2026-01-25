'use client';

import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/auth-layout';
import { LoginForm } from '@/components/auth/login-form';
import { useLanguage } from '@/lib/i18n/language-context';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogin = async (email: string, password: string) => {
    // TODO: Replace with actual authentication logic
    console.log('Login attempt:', { email, password });

    // Simulate successful login
    if (email && password.length >= 6) {
      // Redirect to dashboard
      router.push('/');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  return (
    <AuthLayout
      title={t('auth.signIn')}
      subtitle={t('auth.startFreeUseCase')}
    >
      <LoginForm onSubmit={handleLogin} />
    </AuthLayout>
  );
}
