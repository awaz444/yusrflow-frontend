'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'manager' | 'auditor' | 'viewer';
  is_super_admin: boolean;
  tenant_id?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, refreshToken?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUserProfile = async (token: string): Promise<User | null> => {
    try {
      console.log('Fetching user profile for token:', token.substring(0, 10) + '...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('auth/me response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('auth/me data received successfully');
        return data.user || data; // Handle both { user: {...} } and flat response shapes
      } else {
        const text = await response.text();
        console.error('auth/me failed. Status:', response.status, 'Body:', text);
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const login = async (token: string, refreshToken?: string) => {
    localStorage.setItem('accessToken', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

    const userData = await fetchUserProfile(token);

    if (userData) {
      setUser(userData);

      // Redirect logic based on role
      if (userData.is_super_admin) {
        if (pathname === '/auth/login' || pathname === '/') {
          router.push('/admin/dashboard');
        }
      } else {
        if (pathname === '/auth/login' || pathname === '/') {
          router.push('/dashboard');
        }
      }
    } else {
      console.warn('Token saved but user profile failed to load on login. Waiting for next checkAuth cycle.');
      // Fallback redirect even if the user profile fetch timed out, 
      // the `checkAuth` guard will re-verify it later without breaking the loop.
      if (pathname === '/auth/login') {
        router.push('/dashboard');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    router.push('/auth/login');
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user || data); // Store robust user profile
      } else if (response.status === 401 || response.status === 403) {
        // Token strictly invalid or expired
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
    } catch (error) {
      console.error('Network error during auth check, preserving token.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
