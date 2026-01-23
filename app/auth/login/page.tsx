'use client';

import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/auth-layout';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    // TODO: Replace with actual authentication logic
    console.log('Login attempt:', { email, password });

    // Simulate successful login
    if (email && password.length >= 6) {
      // Redirect to tenant setup or dashboard
      router.push('/tenant-setup');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  return (
    <AuthLayout
      title="Sign In to Yusrflow"
      subtitle="Enter your credentials to access your compliance dashboard"
    >
      <LoginForm onSubmit={handleLogin} />
    </AuthLayout>
  );
}
