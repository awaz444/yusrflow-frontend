'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Shield, BarChart3, ListChecks as ListCheck, ShieldCheck, User, LogOut, Settings, FileText, MessageCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/language-context';
import { LanguageSwitcher } from './language-switcher';

import { signOut } from 'supertokens-auth-react/recipe/session';

export function MainNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Don't show nav on auth pages
  if (pathname.startsWith('/auth') || pathname === '/tenant-setup') {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/auth/login";
  };

  const navItems = [
    {
      href: '/',
      label: t('common.dashboard'),
      icon: BarChart3,
    },
    {
      href: '/apps',
      label: t('common.applications'),
      icon: ListCheck,
    },
    {
      href: '/compliance',
      label: t('common.compliance'),
      icon: ShieldCheck,
    },
    {
      href: '/reports',
      label: t('reports.title'),
      icon: FileText,
    },
    {
      href: '/ai-assistant',
      label: t('aiAssistant.title'),
      icon: MessageCircle,
    },
    {
      href: '/users',
      label: t('users.title'),
      icon: Users,
    },
    {
      href: '/admin/settings',
      label: t('common.settings'),
      icon: Settings,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Shield className="w-6 h-6 text-accent" />
            <span>Yusrflow</span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm',
                    isActive
                      ? 'bg-accent/20 text-accent'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <User className="w-4 h-4" />
              <span className="sr-only">Profile</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-red-400"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
