'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('Welcome back!');
      router.push('/dashboard/buyer');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8">
          <h1 className="text-2xl font-display font-bold text-white text-center">Welcome Back</h1>
          <p className="text-gray-500 text-center mt-2">Log in to your account</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input id="email" type="email" required className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input id="password" type="password" required className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-accent-cyan hover:underline font-medium">Sign up</Link>
            </p>
            <Link href="/auth/admin" className="text-xs text-gray-600 hover:text-gray-400">Admin Login</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
