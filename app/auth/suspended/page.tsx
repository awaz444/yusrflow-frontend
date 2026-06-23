'use client';

import { ShieldAlert, LogOut, Mail, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function SuspendedPage() {
  const router = useRouter();

  const handleReturnToLogin = () => {
    // Clear any residual session data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-destructive/5 rounded-full blur-3xl" />

      <Card className="max-w-md w-full border-destructive/20 bg-card/60 backdrop-blur-md shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-destructive to-rose-500" />
        <CardHeader className="text-center pt-8 pb-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-4 relative">
            <ShieldAlert className="h-7 w-7 animate-pulse" />
            <span className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" style={{ animationDuration: '3s' }} />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">
            Workspace Suspended
          </CardTitle>
          <CardDescription className="text-sm mt-1">
            Access to this Yusrflow organization has been deactivated.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/10 text-center space-y-2">
            <p className="text-sm text-foreground font-semibold leading-relaxed">
              Your company account has been temporarily suspended.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This suspension could be due to billing issues, administrative decisions, or policy updates. Please reach out to your administrator to restore access.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={handleReturnToLogin}
              className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-semibold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Return to Login
            </Button>

            <a
              href="mailto:support@yusrflow.com?subject=Suspended Workspace Support Request"
              className="w-full h-11 border border-border bg-transparent hover:bg-secondary/40 text-foreground font-semibold rounded-lg text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              Contact Yusrflow Support
            </a>
          </div>

          <div className="flex justify-center items-center gap-1.5 text-xs text-muted-foreground mt-4">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Need immediate help? support@yusrflow.com</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
