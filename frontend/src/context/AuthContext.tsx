import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import authService, { AuthResponse, AuthUser, RegisterPayload } from '@/services/auth/authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (body: RegisterPayload) => Promise<void>;
  googleAuth: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const payload = await response.json();
      setUser(payload.data?.user ?? null);
    } catch (_error) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!active) return;
        if (!response.ok) {
          setUser(null);
          return;
        }

        const payload = await response.json();
        setUser(payload.data?.user ?? null);
      } catch (_error) {
        if (active) setUser(null);
      } finally {
        if (active) {
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    initialize();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    const result = await authService.login(credentials);
    setUser(result.user);
  }, []);

  const register = useCallback(async (body: RegisterPayload) => {
    await authService.register(body);
  }, []);

  const googleAuth = useCallback(async (idToken: string) => {
    const result = await authService.googleAuth({ idToken });
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (_error) {
      // ignore logout network failures and clear local state
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      initialized,
      login,
      register,
      googleAuth,
      logout,
      refreshUser
    }),
    [user, loading, initialized, login, register, googleAuth, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
