'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserRole } from '@project-hub/shared';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.STUDENT as UserRole.STUDENT | UserRole.COLLEGE | UserRole.COMPANY,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('Account created!');
      router.push('/dashboard/buyer');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Signup failed');
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
          <h1 className="text-2xl font-display font-bold text-white text-center">Create Account</h1>
          <p className="text-gray-500 text-center mt-2">Join Project Hub today</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <input id="name" type="text" required minLength={2} className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input id="email" type="email" required className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input id="password" type="password" required minLength={8} className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-1">I am a...</label>
              <select id="role" className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as typeof form.role })}>
                <option value={UserRole.STUDENT}>Student</option>
                <option value={UserRole.COLLEGE}>College / University</option>
                <option value={UserRole.COMPANY}>Company / Organization</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-accent-cyan hover:underline font-medium">Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
