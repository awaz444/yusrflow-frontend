'use client';

import { AuthLayout } from '@/components/auth/auth-layout';
import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join Yusrflow to start managing compliance"
    >
      <SignupForm />
    </AuthLayout>
  );
}
