'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart3, Building2, Users, Settings, LogOut, Search, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { Logo } from './logo';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const platformItems = [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: BarChart3,
    },
    {
      href: '/admin/companies',
      label: 'Companies',
      icon: Building2,
    },
    {
      href: '/admin/users',
      label: 'Users',
      icon: Users,
    },
    {
      href: '/admin/saas-discovery',
      label: 'SaaS Discovery',
      icon: Search,
    },
  ];

  const settingItems = [
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className={cn(
      "flex flex-col h-screen w-64 bg-card/95 backdrop-blur-md border-r border-border/80 fixed left-0 top-0 z-40 transition-transform duration-300 md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-border/60 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center hover:opacity-90 transition-opacity">
          <Logo width={140} height={35} />
        </Link>
        <span className="text-[9px] font-bold text-accent uppercase bg-accent/15 px-2 py-0.5 rounded-full border border-accent/20 tracking-wider">
          v1.0
        </span>
      </div>

      {/* Sidebar Nav */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Platform Section */}
        <div>
          <p className="px-4 text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">
            Platform Management
          </p>
          <nav className="space-y-1">
            {platformItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href) || false;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm relative group overflow-hidden',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md" />
                  )}
                  <Icon className={cn("w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-110", isActive ? "text-primary" : "")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Configuration Section */}
        <div>
          <p className="px-4 text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2">
            System Config
          </p>
          <nav className="space-y-1">
            {settingItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href) || false;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm relative group overflow-hidden',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md" />
                  )}
                  <Icon className={cn("w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-110", isActive ? "text-primary" : "")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer with profile card */}
      <div className="p-4 border-t border-border/60 bg-secondary/20 space-y-3">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-violet-400 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
            {user?.first_name ? user.first_name[0].toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate">
              {[user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Super Admin'}
            </p>
            <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-accent shrink-0" />
              {user?.email || 'admin@yusrflow.com'}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-xs text-muted-foreground hover:text-red-400 hover:bg-red-500/10 gap-2.5 rounded-lg h-9 px-3 transition-colors"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
