'use client';

import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/auth-layout';
import { ContactForm, type ContactFormData } from '@/components/auth/contact-form';
import { useLanguage } from '@/lib/i18n/language-context';

export default function ContactPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (data: ContactFormData) => {
    // TODO: Replace with actual API call to send contact form
    console.log('Contact form submitted:', data);

    // Simulate successful submission
    // In production, this would call an API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined);
      }, 1500);
    });
  };

  return (
    <AuthLayout
      title={t('contact.title')}
      subtitle={t('contact.description')}
    >
      <ContactForm onSubmit={handleSubmit} />
    </AuthLayout>
  );
}
