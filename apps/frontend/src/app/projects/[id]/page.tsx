'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Star, Download, ShoppingCart, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  price: string;
  category: string;
  techStack: string[];
  features: string[];
  averageRating: number;
  reviewCount: number;
  isPurchased: boolean;
  createdAt: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string; role: string };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  prefill: { email: string; name: string };
  theme: { color: string };
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [projectRes, reviewsRes] = await Promise.all([
          api.get(`/projects/${params.id}`),
          api.get(`/reviews/project/${params.id}`),
        ]);
        setProject(projectRes.data.data);
        setReviews(reviewsRes.data.data);
      } catch {
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setPurchasing(true);
    try {
      const { data } = await api.post('/purchases/create-order', { projectId: params.id });
      const order = data.data;

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Project Hub',
        description: order.projectTitle,
        handler: async (response) => {
          try {
            await api.post('/purchases/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Purchase successful!');
            setProject((prev) => prev ? { ...prev, isPurchased: true } : null);
          } catch {
            toast.error('Payment verification failed');
          }
        },
        prefill: { email: user?.email || '', name: user?.name || '' },
        theme: { color: '#00f5d4' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed to initiate purchase');
    } finally {
      setPurchasing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const { data } = await api.get(`/purchases/download/${params.id}`);
      window.open(data.data.downloadUrl, '_blank');
    } catch {
      toast.error('Failed to get download link');
    }
  };

  if (loading) {
    return (
      <div className="pt-20 max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-surface-200/50 rounded w-2/3" />
          <div className="h-6 bg-surface-200/50 rounded w-1/3" />
          <div className="h-64 bg-surface-200/50 rounded-2xl mt-8" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-20 max-w-5xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-display font-bold text-white">Project not found</h1>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white">{project.title}</h1>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-accent-gold text-accent-gold" />
                <span className="font-medium text-white">{project.averageRating > 0 ? project.averageRating.toFixed(1) : 'New'}</span>
                <span className="text-gray-500">({project.reviewCount} reviews)</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan text-sm border border-accent-cyan/20 font-medium">
                {project.category.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <div className="glass p-6">
            <h2 className="text-lg font-display font-semibold text-white mb-3">Description</h2>
            <p className="text-gray-400 whitespace-pre-line leading-relaxed">{project.longDescription || project.description}</p>
          </div>

          {project.features.length > 0 && (
            <div className="glass p-6">
              <h2 className="text-lg font-display font-semibold text-white mb-3">Features</h2>
              <ul className="space-y-2.5">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="h-5 w-5 text-accent-cyan shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="glass p-6">
            <h2 className="text-lg font-display font-semibold text-white mb-3">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-lg bg-accent-cyan/10 text-accent-cyan text-sm border border-accent-cyan/20 font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="glass p-6">
              <h2 className="text-lg font-display font-semibold text-white mb-4">Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-surface-300/30 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{review.user.name}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-accent-gold text-accent-gold' : 'text-surface-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="mt-1.5 text-gray-400 text-sm">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="glass p-6 sticky top-24">
            <div className="text-4xl font-display font-bold bg-gradient-to-r from-neon-green via-accent-cyan to-neon-blue bg-clip-text text-transparent mb-6">
              ₹{Number(project.price).toLocaleString('en-IN')}
            </div>

            {project.isPurchased ? (
              <button onClick={handleDownload} className="btn-primary w-full flex items-center justify-center gap-2">
                <Download className="h-5 w-5" />
                Download Project
              </button>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {purchasing ? 'Processing...' : 'Buy Now'}
              </button>
            )}

            <div className="mt-6 space-y-3 text-sm text-gray-400">
              <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent-cyan" /> Instant download after purchase</p>
              <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent-cyan" /> Complete source code included</p>
              <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent-cyan" /> Documentation included</p>
              <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent-cyan" /> Secure payment via Razorpay</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
