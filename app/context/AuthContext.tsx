'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
};

type AuthContextType = {
  customer: Customer | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'cse_customer_auth';

function loadStored(): { customer: Customer; token: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.customer && data?.token) return data;
  } catch {
    // ignore
  }
  return null;
}

function saveStored(customer: Customer, token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ customer, token }));
}

function clearStored() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from cookie (backend uses same cookie for session)
    fetch('/api/customer/auth/session', { credentials: 'include' })
      .then((res) => res.json())
      .then((json) => {
        const c = json?.customer ?? json?.data?.customer;
        if (json?.success && c) {
          setCustomer(c);
          setToken('session');
          saveStored(c, 'session');
        } else {
          const stored = loadStored();
          if (stored) {
            setCustomer(stored.customer);
            setToken(stored.token);
          }
        }
      })
      .catch(() => {
        const stored = loadStored();
        if (stored) {
          setCustomer(stored.customer);
          setToken(stored.token);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/customer/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.message || json?.error || 'Login failed');
    }
    // Backend returns { success, message, customer } (no token)
    const c = json.customer ?? json.data?.customer;
    if (!json?.success || !c) {
      throw new Error(json?.message || 'Invalid response');
    }
    const t = json.token ?? json.data?.token ?? 'session';
    saveStored(c, t);
    setCustomer(c);
    setToken(t);
  }, []);

  const signup = useCallback(
    async (data: { name: string; email: string; password: string; phone?: string }) => {
      const res = await fetch('/api/customer/auth/signup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || json?.error || 'Signup failed');
      }
      // Backend may return { success, customer } or { success, data: { customer, token } }
      const c = json.customer ?? json.data?.customer;
      if (!json?.success || !c) {
        throw new Error(json?.message || 'Invalid response');
      }
      const t = json.token ?? json.data?.token ?? 'session';
      saveStored(c, t);
      setCustomer(c);
      setToken(t);
    },
    []
  );

  const logout = useCallback(() => {
    clearStored();
    setCustomer(null);
    setToken(null);
  }, []);

  const value: AuthContextType = {
    customer,
    token,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!customer && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
