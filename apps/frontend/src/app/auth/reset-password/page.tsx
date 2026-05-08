'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    token: searchParams.get('token') || '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token: form.token,
        password: form.password,
      });
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-20">
      <div className="w-full max-w-md animate-fade-in">
        <div className="glass p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 mb-4">
              <Lock className="h-7 w-7 text-accent-cyan" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Reset Password</h1>
            <p className="text-gray-500 mt-2">Enter your new password below</p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Reset Token</label>
                <input
                  id="token"
                  type="text"
                  required
                  className="input-field font-mono text-xs"
                  placeholder="Paste your reset token here"
                  value={form.token}
                  onChange={(e) => setForm({ ...form, token: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">New Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  className="input-field"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  className="input-field"
                  placeholder="Repeat your new password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                  Password reset successfully! Redirecting to login...
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-accent-cyan hover:underline font-medium">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
