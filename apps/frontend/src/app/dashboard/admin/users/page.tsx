'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/admin/users');
        setUsers(data.data);
      } catch {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="pt-20 max-w-7xl mx-auto px-4 py-8 animate-pulse"><div className="h-96 bg-surface-200/50 rounded-xl" /></div>;
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Users ({users.length})</h1>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-100/50 border-b border-surface-300/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-surface-100/50">
                <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{u.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-accent-cyan/10 text-accent-cyan text-xs rounded-full font-medium">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="px-6 py-12 text-center text-gray-400">No users yet</div>}
      </div>
    </div>
  );
}
