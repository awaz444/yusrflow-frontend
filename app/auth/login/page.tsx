'use client';

import { AuthLayout } from '@/components/auth/auth-layout';
import { LoginForm } from '@/components/auth/login-form';
import { useLanguage } from '@/lib/i18n/language-context';

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <AuthLayout
      title={t('auth.signIn')}
    >
      <LoginForm />
    </AuthLayout>
  );
}
