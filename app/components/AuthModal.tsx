'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

type Tab = 'login' | 'signup';

export default function AuthModal({
  isOpen,
  onClose,
  initialTab = 'login',
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: Tab;
  onSuccess?: () => void;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    setTab(initialTab);
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      handleClose();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !password) {
      setError('Please enter name, email, and password.');
      return;
    }
    setLoading(true);
    try {
      await signup({ name: name.trim(), email: email.trim(), password, phone: phone.trim() || undefined });
      handleClose();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-6 py-6 text-white"
          style={{ background: 'linear-gradient(135deg, #003a91 0%, #9c0303 100%)' }}
        >
          <div className="flex items-center justify-between">
            <h2 id="auth-modal-title" className="text-xl font-bold tracking-tight">
              My Account
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(null); }}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${tab === 'login' ? 'border-white' : 'border-transparent text-white/80 hover:text-white'}`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setError(null); }}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${tab === 'signup' ? 'border-white' : 'border-transparent text-white/80 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="p-6">
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1658a1]/40 focus:border-[#1658a1]"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1658a1]/40 focus:border-[#1658a1]"
                  disabled={loading}
                />
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-semibold text-white transition-colors disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #003a91 0%, #9c0303 100%)' }}
              >
                {loading ? 'Signing in…' : 'Log In'}
              </button>
              <p className="text-center text-sm text-gray-600">
                New user?{' '}
                <button type="button" onClick={() => setTab('signup')} className="text-[#1658a1] font-medium hover:underline">
                  Sign Up
                </button>
              </p>
              <p className="text-center text-sm">
                <Link href="/admin/login" className="text-[#1658a1] hover:underline">Admin Login</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="auth-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1658a1]/40 focus:border-[#1658a1]"
                  placeholder="Your name"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="auth-signup-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="auth-signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1658a1]/40 focus:border-[#1658a1]"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="auth-signup-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="auth-signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1658a1]/40 focus:border-[#1658a1]"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="auth-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-gray-400">(optional)</span></label>
                <input
                  id="auth-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1658a1]/40 focus:border-[#1658a1]"
                  placeholder="+1 234 567 8900"
                  disabled={loading}
                />
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-semibold text-white transition-colors disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #003a91 0%, #9c0303 100%)' }}
              >
                {loading ? 'Creating account…' : 'Sign Up'}
              </button>
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button type="button" onClick={() => setTab('login')} className="text-[#1658a1] font-medium hover:underline">
                  Log In
                </button>
              </p>
              <p className="text-center text-sm">
                <Link href="/admin/login" className="text-[#1658a1] hover:underline">Admin Login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
