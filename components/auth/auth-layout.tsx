'use client';

import React from "react"
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';
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
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -100, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px]"
        />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      </div>

      {/* Back to Landing */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
        aria-label="Back to home"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Language + Theme controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md space-y-6 z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center"
          >
            <Logo width={220} height={60} priority />
          </motion.div>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-muted-foreground space-y-2 mt-8"
        >
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
        </motion.div>
      </motion.div>
    </div>
  );
}
