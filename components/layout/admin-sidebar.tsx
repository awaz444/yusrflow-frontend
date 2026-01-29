'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart3, Building2, Users, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
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
      href: '/admin/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-card border-r border-border fixed left-0 top-0">
      <div className="p-6 border-b border-border">
         <Link href="/admin/dashboard" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Shield className="w-8 h-8 text-red-500" />
            <span>Admin Portal</span>
         </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-red-400 gap-3"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
