'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
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
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import { LanguageSwitcher } from './language-switcher';

import { ThemeToggle } from '@/components/theme-toggle';

import { Logo } from './logo';

export function Sidebar({ 
    isOpen = false, 
    onClose,
    isCollapsed = false,
    onToggleCollapse
}: { 
    isOpen?: boolean; 
    onClose?: () => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}) {
    const pathname = usePathname();
    const { t } = useLanguage();
    const [isHovered, setIsHovered] = useState(false);

    const isExpanded = !isCollapsed || isHovered;

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
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "flex flex-col h-screen bg-card border-r border-border fixed left-0 top-0 z-40 transition-all duration-300 md:translate-x-0 overflow-hidden",
                isOpen ? "translate-x-0" : "-translate-x-full",
                isExpanded ? "w-64" : "w-20"
            )}
        >
            <div className={cn("border-b border-border flex items-center h-20 transition-all duration-300 shrink-0", !isExpanded ? "p-0 justify-center" : "px-6 justify-between")}>
                <Link href="/dashboard" className={cn("flex items-center overflow-hidden transition-all duration-300", !isExpanded ? "w-0 opacity-0" : "w-auto opacity-100")}>
                    <Logo width={120} height={30} />
                </Link>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                        if (onToggleCollapse) onToggleCollapse();
                        setIsHovered(false); // Force close hover state on click
                    }} 
                    className="shrink-0 hidden md:flex text-muted-foreground hover:text-foreground"
                    title={isCollapsed ? t('common.expandSidebar') || "Expand" : t('common.collapseSidebar') || "Collapse"}
                >
                    {isCollapsed ? <ChevronRight className={cn("w-5 h-5 transition-transform duration-300", isHovered ? "rotate-180" : "")} /> : <ChevronLeft className="w-5 h-5" />}
                </Button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => onClose && onClose()}
                            className={cn(
                                'flex items-center rounded-lg transition-all font-medium whitespace-nowrap overflow-hidden',
                                isActive
                                    ? 'bg-accent/20 text-accent'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                                !isExpanded ? "w-12 h-12 mx-auto justify-center p-0 gap-0" : "w-full justify-start px-4 py-3 gap-3"
                            )}
                            title={!isExpanded ? item.label : undefined}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            <span className={cn(
                                "transition-all duration-300",
                                !isExpanded ? "w-0 opacity-0" : "w-auto opacity-100"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border space-y-4 shrink-0">
                <div className={cn("flex items-center transition-all duration-300", !isExpanded ? "justify-center" : "justify-between")}>
                    <div className={cn("transition-all duration-300 overflow-hidden", !isExpanded ? "w-0 opacity-0 hidden" : "w-auto opacity-100 flex-1")}>
                        <LanguageSwitcher />
                    </div>
                    <div className={cn("flex items-center justify-center shrink-0", !isExpanded ? "w-12 h-12" : "")}>
                        <ThemeToggle />
                    </div>
                </div>

                <div className="pt-2 border-t border-border mt-2 flex flex-col gap-1">
                    <Button variant="ghost" className={cn(
                        "text-muted-foreground hover:text-foreground whitespace-nowrap overflow-hidden transition-all duration-300",
                        !isExpanded ? "w-12 h-12 mx-auto justify-center p-0 gap-0" : "w-full justify-start px-4 gap-3"
                    )} title={!isExpanded ? t('common.profile') : undefined}>
                        <User className="w-5 h-5 shrink-0" />
                        <span className={cn(!isExpanded ? "w-0 opacity-0" : "w-auto opacity-100")}>
                            {t('common.profile')}
                        </span>
                    </Button>
                    <Button
                        variant="ghost"
                        className={cn(
                            "text-muted-foreground hover:text-red-400 whitespace-nowrap overflow-hidden transition-all duration-300",
                            !isExpanded ? "w-12 h-12 mx-auto justify-center p-0 gap-0" : "w-full justify-start px-4 gap-3"
                        )}
                        title={!isExpanded ? t('common.logout') : undefined}
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className={cn(!isExpanded ? "w-0 opacity-0" : "w-auto opacity-100")}>
                            {t('common.logout')}
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
