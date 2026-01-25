'use client';

import { Badge } from "@/components/ui/badge"
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/language-context';
import {
  BarChart3,
  ListChecks,
  ShieldCheck,
  FileText,
  Bot,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { t, language } = useLanguage();

  const navItems = [
    {
      href: '/',
      label: t('common.dashboard'),
      icon: BarChart3,
    },
    {
      href: '/apps',
      label: t('common.applications'),
      icon: ListChecks,
    },
    {
      href: '/compliance',
      label: t('common.compliance'),
      icon: ShieldCheck,
    },
    {
      href: '/reports',
      label: 'Reports',
      icon: FileText,
    },
    {
      href: '/ai-assistant',
      label: 'AI Assistant',
      icon: Bot,
    },
    {
      href: '/users',
      label: 'Users',
      icon: Users,
    },
    {
      href: '/admin/settings',
      label: t('common.settings'),
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">
              {language === 'ar' ? 'يسرفلو' : 'Yusrflow'}
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
          <div className="pt-2 border-t border-border">
            <LanguageSwitcher />
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-border sticky top-0 z-40">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-sm font-semibold text-muted-foreground">
                Acme Corporation
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="icon">
                <Users className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* This will be replaced by page content */}
        </main>
      </div>
    </div>
  );
}
