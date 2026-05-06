'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/admin/login', form);
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('Admin access granted');
      router.push('/dashboard/admin');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-20">
      <div



        className="w-full max-w-md animate-fade-in"
      >
        <div className="glass p-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-accent-pink/10 flex items-center justify-center border border-accent-pink/20">
              <Shield className="h-7 w-7 text-accent-pink" />
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white text-center">Admin Access</h1>
          <p className="text-gray-500 text-center mt-2">Restricted area</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Admin Email</label>
              <input id="email" type="email" required className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Admin Password</label>
              <input id="password" type="password" required className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="btn-danger w-full">
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
