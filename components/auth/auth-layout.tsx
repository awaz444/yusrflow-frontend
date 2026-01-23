'use client';

import React from "react"

import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">Yusrflow</h1>
          </div>
          <p className="text-sm text-muted-foreground">Compliance & SaaS Management Platform</p>
        </div>

        {/* Content Card */}
        <Card className="bg-card border-border p-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>}
          {children}
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>Enterprise compliance management for GCC organizations</p>
          <p className="text-purple-400">Secure • Compliant • Scalable</p>
        </div>
      </div>
    </div>
  );
}
