'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Trash2, Star } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useWishlistStore } from '@/store/wishlist.store';
import toast from 'react-hot-toast';

interface WishlistItem {
  id: string;
  addedAt: string;
  project: {
    id: string;
    title: string;
    description: string;
    price: string;
    category: string;
    techStack: string[];
    thumbnailUrl: string | null;
    averageRating: number;
    reviewCount: number;
  };
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { removeFromWishlist } = useWishlistStore();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    async function load() {
      try {
        const { data } = await api.get('/wishlist');
        setItems(data.data);
      } catch {
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAuthenticated, router]);

  const handleRemove = async (projectId: string) => {
    try {
      await removeFromWishlist(projectId);
      setItems((prev) => prev.filter((item) => item.project.id !== projectId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove');
    }
  };

  if (loading) {
    return (
      <div className="pt-20 max-w-5xl mx-auto px-4 py-8">
        <div className="h-8 bg-surface-200/50 rounded w-1/3 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-36 bg-surface-200/50" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-surface-200/50 rounded w-3/4" />
                <div className="h-4 bg-surface-200/50 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-7 w-7 text-red-500 fill-red-500" />
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">My Wishlist</h1>
          <span className="text-sm text-gray-400">({items.length} items)</span>
        </div>
      </motion.div>

      {items.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {items.map((item) => (
            <motion.div key={item.id} variants={fadeUp}>
              <div className="card-glow group relative">
                <Link href={`/projects/${item.project.id}`}>
                  <div className="h-36 relative overflow-hidden">
                    {item.project.thumbnailUrl ? (
                      <img src={item.project.thumbnailUrl} alt={item.project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent-cyan to-accent-blue" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-gray-900 dark:text-white group-hover:text-accent-cyan transition-colors line-clamp-1">
                      {item.project.title}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold bg-gradient-to-r from-neon-green via-accent-cyan to-neon-blue bg-clip-text text-transparent">
                        ₹{Number(item.project.price).toLocaleString('en-IN')}
                      </span>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3.5 w-3.5 fill-accent-gold text-accent-gold" />
                        <span className="text-gray-400">{item.project.averageRating > 0 ? item.project.averageRating.toFixed(1) : 'New'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemove(item.project.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all border border-white/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Heart className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-6">Browse projects and click the heart icon to add them here.</p>
          <Link href="/projects" className="btn-primary inline-block">
            Browse Projects
          </Link>
        </motion.div>
      )}
    </div>
  );
}
