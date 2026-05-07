'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useRecentlyViewedStore } from '@/store/recently-viewed.store';
import { UserRole } from '@project-hub/shared';
import { Download, Package, DollarSign, Clock, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Purchase {
  id: string;
  amount: string;
  createdAt: string;
  project: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    category: string;
  };
}

export default function BuyerDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { getRecentlyViewed } = useRecentlyViewedStore();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  const recentlyViewed = getRecentlyViewed().slice(0, 4);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role === UserRole.ADMIN) {
      router.push('/dashboard/admin');
      return;
    }

    async function load() {
      try {
        const { data } = await api.get('/purchases/my-purchases');
        setPurchases(data.data);
      } catch {
        toast.error('Failed to load purchases');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAuthenticated, user, router]);

  const handleDownload = async (projectId: string) => {
    try {
      const { data } = await api.get(`/purchases/download/${projectId}`);
      window.open(data.data.downloadUrl, '_blank');
    } catch {
      toast.error('Failed to get download link');
    }
  };

  const totalSpent = purchases.reduce((sum, p) => sum + Number(p.amount), 0);

  if (loading) {
    return (
      <div className="pt-20 max-w-5xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-surface-200/50 rounded w-1/3 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-surface-200/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Welcome back, {user?.name}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
      >
        <div className="glass p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-accent-blue" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Projects Purchased</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{purchases.length}</p>
          </div>
        </div>
        <div className="glass p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-accent-cyan" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">₹{totalSpent.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass mb-8"
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-surface-300/30">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Purchases</h2>
        </div>

        {purchases.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-surface-300/20">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-cyan/10 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-accent-cyan" />
                  </div>
                  <div>
                    <Link href={`/projects/${purchase.project.id}`} className="font-medium text-gray-900 dark:text-white hover:text-accent-cyan transition-colors">
                      {purchase.project.title}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Purchased on {new Date(purchase.createdAt).toLocaleDateString()} &bull; ₹{Number(purchase.amount).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(purchase.project.id)}
                  className="btn-primary text-sm flex items-center gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Package className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No purchases yet</p>
            <Link href="/projects" className="btn-primary mt-4 inline-block">
              Browse Projects
            </Link>
          </div>
        )}
      </motion.div>

      {recentlyViewed.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" /> Recently Viewed
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentlyViewed.map((item) => (
              <Link key={item.id} href={`/projects/${item.id}`} className="card-glow group p-0">
                <div className="h-24 relative overflow-hidden rounded-t-2xl">
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent-cyan to-accent-blue" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-xs text-gray-900 dark:text-white line-clamp-1 group-hover:text-accent-cyan transition-colors">{item.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs font-bold bg-gradient-to-r from-neon-green to-accent-cyan bg-clip-text text-transparent">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                    <Star className="h-3 w-3 text-accent-gold" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
