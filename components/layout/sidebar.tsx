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

export function Sidebar() {
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
            href: '/integrations',
            label: 'Integrations',
            icon: Plug,
        },
        {
            href: '/admin/settings',
            label: t('common.settings'),
            icon: Settings,
        },
    ];

    return (
        <div className="flex flex-col h-screen w-64 bg-card border-r border-border fixed left-0 top-0 z-40">
            <div className="p-6 border-b border-border">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
                    <Shield className="w-8 h-8 text-accent" />
                    <span>Yusrflow</span>
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
                </div>

                <div className="pt-2 border-t border-border mt-2">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground gap-3">
                        <User className="w-5 h-5" />
                        Profile
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-red-400 gap-3"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5" />
                        Sign out
                    </Button>
                </div>
            </div>
        </div>
    );
}
