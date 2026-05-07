'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ subject: '', content: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    setLoading(true);
    try {
      await api.post('/messages', form);
      toast.success('Message sent!');
      setForm({ subject: '', content: '' });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 mb-4">
            <MessageSquare className="h-7 w-7 text-accent-cyan" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Have a question? We&apos;d love to hear from you.</p>
        </div>

        <div className="glass p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Subject</label>
              <input id="subject" type="text" required minLength={3} className="input-field" placeholder="What's this about?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Message</label>
              <textarea id="content" required rows={5} minLength={10} className="input-field resize-none" placeholder="Write your message here..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <Send className="h-5 w-5" />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {!isAuthenticated && (
          <p className="text-center text-sm text-gray-600 mt-4">You&apos;ll need to log in before sending a message.</p>
        )}
      </div>
    </div>
  );
}
