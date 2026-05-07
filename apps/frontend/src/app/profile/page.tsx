'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Package, DollarSign, Star, Heart, ShoppingCart, Clock, LogOut } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
  stats: {
    totalPurchases: number;
    totalSpent: number;
    reviewsWritten: number;
    wishlistCount: number;
  };
  recentActivity: Array<{
    type: 'purchase' | 'review';
    id: string;
    projectId: string;
    projectTitle: string;
    date: string;
    amount?: number;
    rating?: number;
  }>;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    async function load() {
      try {
        const { data } = await api.get('/profile');
        setProfile(data.data);
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="pt-20 max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-surface-200/50 rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-surface-200/50 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-surface-200/50 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const roleLabels: Record<string, string> = {
    STUDENT: 'Student',
    COLLEGE: 'College / University',
    COMPANY: 'Company / Organization',
    ADMIN: 'Administrator',
  };

  return (
    <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass p-6 md:p-8 mb-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white text-2xl font-display font-bold">
            {profile.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{profile.user.name}</h1>
            <p className="text-gray-500">{profile.user.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan text-xs font-medium border border-accent-cyan/20">
                {roleLabels[profile.user.role] || profile.user.role}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Member since {new Date(profile.user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-danger text-sm flex items-center gap-2 px-4 py-2">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="glass p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center mx-auto mb-2">
            <Package className="h-5 w-5 text-accent-blue" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile.stats.totalPurchases}</p>
          <p className="text-xs text-gray-400">Purchases</p>
        </div>
        <div className="glass p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-2">
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{profile.stats.totalSpent.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400">Total Spent</p>
        </div>
        <div className="glass p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-accent-gold/10 flex items-center justify-center mx-auto mb-2">
            <Star className="h-5 w-5 text-accent-gold" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile.stats.reviewsWritten}</p>
          <p className="text-xs text-gray-400">Reviews</p>
        </div>
        <div className="glass p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mx-auto mb-2">
            <Heart className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile.stats.wishlistCount}</p>
          <p className="text-xs text-gray-400">Wishlist</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass p-6"
      >
        <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        {profile.recentActivity.length > 0 ? (
          <div className="space-y-4">
            {profile.recentActivity.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-surface-300/20 last:border-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === 'purchase' ? 'bg-accent-cyan/10' : 'bg-accent-gold/10'
                }`}>
                  {activity.type === 'purchase' ? (
                    <ShoppingCart className="h-5 w-5 text-accent-cyan" />
                  ) : (
                    <Star className="h-5 w-5 text-accent-gold" />
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/projects/${activity.projectId}`}
                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-accent-cyan transition-colors"
                  >
                    {activity.type === 'purchase' ? 'Purchased' : 'Reviewed'}{' '}
                    <span className="font-semibold">{activity.projectTitle}</span>
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {activity.type === 'purchase' && activity.amount && `₹${activity.amount.toLocaleString('en-IN')} • `}
                    {activity.type === 'review' && activity.rating && `${activity.rating}/5 stars • `}
                    {timeAgo(activity.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No activity yet. Start exploring projects!</p>
            <Link href="/projects" className="btn-primary mt-4 inline-block text-sm">
              Browse Projects
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
