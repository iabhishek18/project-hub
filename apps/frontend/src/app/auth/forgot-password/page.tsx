'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSent(true);
      if (data.data.resetToken) {
        setResetToken(data.data.resetToken);
      }
      toast.success('Reset link generated!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Something went wrong');
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
              <Mail className="h-7 w-7 text-accent-cyan" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Forgot Password</h1>
            <p className="text-gray-500 mt-2">Enter your email to reset your password</p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Reset link generated successfully!</p>
              </div>

              {resetToken && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Use this token to reset your password:</p>
                  <div className="p-3 bg-gray-100 dark:bg-surface-100 rounded-lg border border-gray-200 dark:border-surface-300">
                    <code className="text-xs text-gray-800 dark:text-gray-200 break-all select-all">{resetToken}</code>
                  </div>
                  <Link
                    href={`/auth/reset-password?token=${resetToken}`}
                    className="btn-primary w-full mt-4 inline-block text-center"
                  >
                    Reset Password Now
                  </Link>
                </div>
              )}
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
