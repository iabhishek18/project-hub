'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Mail, MailOpen } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  subject: string;
  content: string;
  isRead: boolean;
  reply: string | null;
  createdAt: string;
  user: { name: string; email: string; role: string };
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/admin/messages');
        setMessages(data.data);
      } catch {
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      await api.put(`/admin/messages/${id}/reply`, { reply: replyText });
      setMessages(messages.map(m => m.id === id ? { ...m, reply: replyText, isRead: true } : m));
      setReplyingTo(null);
      setReplyText('');
      toast.success('Reply sent');
    } catch {
      toast.error('Failed to send reply');
    }
  };

  if (loading) {
    return <div className="pt-20 max-w-5xl mx-auto px-4 py-8 animate-pulse"><div className="h-96 bg-surface-200/50 rounded-xl" /></div>;
  }

  return (
    <div className="pt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messages ({messages.length})</h1>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`card p-5 ${!msg.isRead ? 'border-l-4 border-l-primary-500' : ''}`}>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {msg.isRead ? <MailOpen className="h-5 w-5 text-gray-400" /> : <Mail className="h-5 w-5 text-primary-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">{msg.user.name}</span>
                  <span className="text-xs text-gray-400">{msg.user.email}</span>
                  <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">{msg.subject}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{msg.content}</p>

                {msg.reply && (
                  <div className="mt-3 p-3 bg-green-500/10 rounded-lg">
                    <p className="text-sm text-green-800"><span className="font-medium">Your reply:</span> {msg.reply}</p>
                  </div>
                )}

                {!msg.reply && (
                  <>
                    {replyingTo === msg.id ? (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          className="input-field text-sm flex-1"
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleReply(msg.id)}
                        />
                        <button onClick={() => handleReply(msg.id)} className="btn-primary text-sm">Send</button>
                        <button onClick={() => { setReplyingTo(null); setReplyText(''); }} className="btn-secondary text-sm">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setReplyingTo(msg.id)} className="text-accent-cyan text-sm font-medium mt-2 hover:underline">
                        Reply
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && <div className="text-center py-12 text-gray-400">No messages yet</div>}
      </div>
    </div>
  );
}
