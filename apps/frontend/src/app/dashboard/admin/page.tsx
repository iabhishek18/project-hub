'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@project-hub/shared';
import { DollarSign, Package, Users, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalRevenue: number;
  totalSales: number;
  totalUsers: number;
  totalProjects: number;
  recentTransactions: Array<{
    id: string;
    buyerName: string;
    projectTitle: string;
    amount: number;
    date: string;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== UserRole.ADMIN) {
      router.push('/auth/admin');
      return;
    }

    async function load() {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data.data);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAuthenticated, user, router]);

  if (loading || !stats) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-surface-200/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <Link href="/dashboard/admin/projects/new" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" /> Add Project
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<DollarSign />} label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} color="green" />
        <StatCard icon={<TrendingUp />} label="Total Sales" value={stats.totalSales.toString()} color="blue" />
        <StatCard icon={<Users />} label="Total Users" value={stats.totalUsers.toString()} color="purple" />
        <StatCard icon={<Package />} label="Active Projects" value={stats.totalProjects.toString()} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>
          {stats.recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {stats.recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-surface-300/30 last:border-0">
                  <div>
                    <p className="font-medium text-white text-sm">{t.projectTitle}</p>
                    <p className="text-gray-400 text-xs">{t.buyerName} &bull; {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <span className="font-semibold text-accent-cyan">₹{t.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No transactions yet</p>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/admin/projects" className="p-4 bg-surface-100/50 rounded-lg hover:bg-surface-100 transition-colors text-center">
              <Package className="h-6 w-6 mx-auto text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-300">Manage Projects</span>
            </Link>
            <Link href="/dashboard/admin/users" className="p-4 bg-surface-100/50 rounded-lg hover:bg-surface-100 transition-colors text-center">
              <Users className="h-6 w-6 mx-auto text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-300">View Users</span>
            </Link>
            <Link href="/dashboard/admin/messages" className="p-4 bg-surface-100/50 rounded-lg hover:bg-surface-100 transition-colors text-center">
              <span className="text-2xl">💬</span>
              <span className="text-sm font-medium text-gray-300 block mt-1">Messages</span>
            </Link>
            <Link href="/dashboard/admin/requests" className="p-4 bg-surface-100/50 rounded-lg hover:bg-surface-100 transition-colors text-center">
              <span className="text-2xl">📋</span>
              <span className="text-sm font-medium text-gray-300 block mt-1">Requests</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    green: 'bg-green-500/10 text-accent-cyan',
    blue: 'bg-accent-blue/10 text-accent-blue',
    purple: 'bg-accent-violet/10 text-accent-violet',
    orange: 'bg-accent-gold/10 text-accent-gold',
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
