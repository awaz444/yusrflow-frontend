'use client';

import React from "react"

import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { LanguageSwitcher } from '@/components/layout/language-switcher';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">{t('auth.title')}</h1>
          </div>
        </div>

        {/* Content Card */}
        <Card className="bg-card border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-4">{title}</h2>
          {children}
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>
            {language === 'ar'
              ? 'إدارة الامتثال للمؤسسات في منطقة الخليج'
              : 'Enterprise compliance management for GCC organizations'}
          </p>
          <p className="text-accent">
            {language === 'ar' ? 'آمن • متوافق • قابل للتوسع' : 'Secure • Compliant • Scalable'}
          </p>
        </div>
      </div>
    </div>
  );
}
