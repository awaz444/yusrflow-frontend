'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/auth-context';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        await login(data.accessToken, data.refreshToken);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err: any) {
      console.error(err);
      setError(err instanceof Error ? err.message : t('auth.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm text-foreground font-medium">
          {t('auth.email')}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={t('auth.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm text-foreground font-medium">
            {t('auth.password')}
          </Label>
          <Link href="/auth/forgot-password" className="text-xs text-accent hover:text-accent/80">
            {t('auth.forgotPassword')}
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder={t('auth.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          disabled={loading}
        />
        <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
          {t('auth.rememberMe')}
        </Label>
      </div>

      <Button
        type="submit"
        disabled={loading || !email || !password}
        className="w-full bg-accent hover:bg-accent/90 text-white font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t('auth.signingIn')}
          </>
        ) : (
          t('auth.signIn')
        )}
      </Button>

      {/* Public signup removed - only admin can create accounts */}
      {/*
      <p className="text-center text-sm text-muted-foreground">
        {t('auth.noAccount')}{' '}
        <Link href="/auth/signup" className="text-accent hover:text-accent/80 font-medium">
          Sign up
        </Link>
      </p>
      */}
    </form>
  );
}
