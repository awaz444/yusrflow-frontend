'use client';

import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/auth-layout';
import { TenantSetupForm } from '@/components/auth/tenant-setup-form';

interface TenantData {
  tenantName: string;
  industry: string;
  employeeCount: string;
  country: string;
}

export default function TenantSetupPage() {
  const router = useRouter();

  const handleTenantSetup = async (data: TenantData) => {
    // TODO: Replace with actual tenant creation logic
    console.log('Tenant setup:', data);

    // Simulate successful tenant creation
    if (data.tenantName && data.industry && data.employeeCount) {
      // Redirect to dashboard
      router.push('/');
    } else {
      throw new Error('Tenant setup failed');
    }
  };

  return (
    <AuthLayout
      title="Complete Your Organization Setup"
      subtitle="Tell us about your organization to customize your experience"
    >
      <TenantSetupForm onSubmit={handleTenantSetup} />
    </AuthLayout>
  );
}
