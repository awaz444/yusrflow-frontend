'use client';

import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SignupForm } from '@/components/auth/signup-form';

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (data: SignupData) => {
    // TODO: Replace with actual sign-up logic
    console.log('Signup attempt:', data);

    // Simulate successful signup
    if (data.email && data.password === data.confirmPassword && data.agreeToTerms) {
      // Redirect to tenant setup
      router.push('/tenant-setup');
    } else {
      throw new Error('Signup failed');
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join Yusrflow to start managing compliance"
    >
      <SignupForm onSubmit={handleSignup} />
    </AuthLayout>
  );
}
