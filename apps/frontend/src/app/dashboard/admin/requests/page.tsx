'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RequestStatus } from '@project-hub/shared';
import toast from 'react-hot-toast';

interface ProjectRequest {
  id: string;
  requirementDetails: string;
  budget: string | null;
  deadline: string | null;
  status: RequestStatus;
  adminNotes: string | null;
  createdAt: string;
  user: { name: string; email: string; role: string };
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/admin/requests');
        setRequests(data.data);
      } catch {
        toast.error('Failed to load requests');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updateStatus = async (id: string, status: RequestStatus) => {
    try {
      await api.put(`/admin/requests/${id}`, { status });
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse"><div className="h-96 bg-gray-200 rounded-xl" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Custom Requests ({requests.length})</h1>

      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium text-gray-900">{req.user.name}</span>
                  <span className="text-xs text-gray-500">{req.user.email}</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{req.user.role}</span>
                </div>
                <p className="text-gray-600 text-sm">{req.requirementDetails}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  {req.budget && <span>Budget: ₹{Number(req.budget).toLocaleString('en-IN')}</span>}
                  {req.deadline && <span>Deadline: {new Date(req.deadline).toLocaleDateString()}</span>}
                  <span>Submitted: {new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <select
                value={req.status}
                onChange={(e) => updateStatus(req.id, e.target.value as RequestStatus)}
                className="input-field text-sm w-auto"
              >
                {Object.values(RequestStatus).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {requests.length === 0 && <div className="text-center py-12 text-gray-500">No custom requests yet</div>}
      </div>
    </div>
  );
}
