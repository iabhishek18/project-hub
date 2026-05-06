'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

export default function RequestPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    requirementDetails: '',
    budget: '',
    deadline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    try {
      await api.post('/requests', {
        requirementDetails: form.requirementDetails,
        budget: form.budget ? Number(form.budget) : undefined,
        deadline: form.deadline || undefined,
      });
      toast.success('Request submitted successfully!');
      setForm({ requirementDetails: '', budget: '', deadline: '' });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Custom Project</h1>
      <p className="text-gray-500 mb-8">
        Need something specific? Describe your requirements and we&apos;ll build it for you.
      </p>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
              Project Requirements *
            </label>
            <textarea
              id="requirements"
              required
              rows={6}
              minLength={20}
              className="input-field resize-none"
              placeholder="Describe your project requirements in detail: tech stack, features, timeline..."
              value={form.requirementDetails}
              onChange={(e) => setForm({ ...form, requirementDetails: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                Budget (INR)
              </label>
              <input
                id="budget"
                type="number"
                min={0}
                className="input-field"
                placeholder="e.g., 5000"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Deadline
              </label>
              <input
                id="deadline"
                type="date"
                className="input-field"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
