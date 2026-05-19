'use client';

import React from "react"
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/theme-toggle';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  const { t, language } = useLanguage();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* CSS-animated Background Blobs — no JS animation runtime */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full"
          style={{
            filter: 'blur(120px)',
            willChange: 'transform, opacity',
            animation: 'authBlob1 15s linear infinite',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full"
          style={{
            filter: 'blur(150px)',
            willChange: 'transform, opacity',
            animation: 'authBlob2 20s linear infinite',
          }}
        />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      </div>

      <style>{`
        @keyframes authBlob1 {
          0%,100% { transform:translate(0,0) scale(1);   opacity:0.3; }
          50%      { transform:translate(100px,-50px) scale(1.2); opacity:0.5; }
        }
        @keyframes authBlob2 {
          0%,100% { transform:translate(0,0) scale(1);    opacity:0.2; }
          50%      { transform:translate(-100px,100px) scale(1.3); opacity:0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          .auth-blob { animation: none !important; }
        }
        @keyframes authCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes authLogoIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes authFooterIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .auth-card-wrapper {
          animation: authCardIn 0.5s ease-out both;
        }
        .auth-logo {
          animation: authLogoIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
        }
        .auth-footer {
          animation: authFooterIn 0.4s ease-out 0.4s both;
        }
      `}</style>

      {/* Back to Landing */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
        aria-label="Back to home"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Language + Theme controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <div className="auth-card-wrapper w-full max-w-md space-y-6 z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="auth-logo flex items-center justify-center">
            <Logo width={220} height={60} priority />
          </div>
        </div>

        {/* Content Card with Glassmorphism */}
        <Card className="bg-card/60 backdrop-blur-xl border-white/10 dark:border-white/5 shadow-2xl p-8 rounded-2xl">
          <div className="mb-6 space-y-1 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'أدخل بيانات الاعتماد الخاصة بك للوصول' : 'Enter your credentials to access your account'}
            </p>
          </div>
          {children}
        </Card>

        {/* Footer */}
        <div className="auth-footer text-center text-xs text-muted-foreground space-y-2 mt-8">
          <p className="font-medium">
            {language === 'ar'
              ? 'إدارة الامتثال للمؤسسات في منطقة الخليج'
              : 'Enterprise compliance management for GCC organizations'}
          </p>
          <div className="flex items-center justify-center gap-2 text-accent/80 font-semibold tracking-wide">
            <span>{language === 'ar' ? 'آمن' : 'Secure'}</span>
            <span>•</span>
            <span>{language === 'ar' ? 'متوافق' : 'Compliant'}</span>
            <span>•</span>
            <span>{language === 'ar' ? 'قابل للتوسع' : 'Scalable'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
