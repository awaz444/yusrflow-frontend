'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    BarChart3,
    ListChecks as ListCheck,
    ShieldCheck,
    FileText,
    MessageCircle,
    Users,
    Plug,
    Settings,
    Shield,
    User,
    LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import { LanguageSwitcher } from './language-switcher';

import { ThemeToggle } from '@/components/theme-toggle';

import { Logo } from './logo';

export function Sidebar({ isOpen = false, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const { t } = useLanguage();

    const handleLogout = async () => {
        // Clear tokens from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = "/auth/login";
    };

    const navItems = [
        {
            href: '/dashboard',
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
            href: '/integrations',
            label: t('integrations.title'),
            icon: Plug,
        },
    ];

    return (
        <div className={cn(
            "flex flex-col h-screen w-64 bg-card border-r border-border fixed left-0 top-0 z-40 transition-transform duration-300 md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="p-6 border-b border-border flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center">
                    <Logo width={160} height={40} />
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => onClose && onClose()}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium',
                                isActive
                                    ? 'bg-accent/20 text-accent'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                    <LanguageSwitcher />
                    <ThemeToggle />
                </div>

                <div className="pt-2 border-t border-border mt-2">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground gap-3">
                        <User className="w-5 h-5" />
                        {t('common.profile')}
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-red-400 gap-3"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5" />
                        {t('common.logout')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
