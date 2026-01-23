'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Plus, Search } from 'lucide-react';

interface AppsHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddApp: () => void;
  onExport: () => void;
  appCount: number;
}

export function AppsHeader({
  searchTerm,
  onSearchChange,
  onAddApp,
  onExport,
  appCount,
}: AppsHeaderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">SaaS Applications</h1>
        <p className="text-muted-foreground">
          Manage and monitor {appCount} applications across your organization
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search applications by name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-secondary border-border hover:border-border focus:border-accent"
          />
        </div>

        <Button onClick={onExport} variant="outline" className="border-border hover:bg-background gap-2 bg-transparent">
          <Download className="w-4 h-4" />
          Export
        </Button>

        <Button onClick={onAddApp} className="bg-accent hover:bg-accent/90 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add Application
        </Button>
      </div>
    </div>
  );
}
