'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { useRecentlyViewedStore } from '@/store/recently-viewed.store';
import { Star, Download, ShoppingCart, CheckCircle, Heart, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Canvas3DErrorBoundary } from '@/components/ui/Canvas3DErrorBoundary';

const ProjectDetailScene3D = dynamic(() => import('@/components/ui/ProjectDetailScene3D').then(m => ({ default: m.ProjectDetailScene3D })), { ssr: false });

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  price: string;
  category: string;
  techStack: string[];
  features: string[];
  thumbnailUrl?: string;
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

interface SimilarProject {
  id: string;
  title: string;
  price: string;
  category: string;
  thumbnailUrl?: string;
  techStack: string[];
  averageRating: number;
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

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  return new Date(dateStr).toLocaleDateString();
}

const roleLabels: Record<string, string> = {
  STUDENT: 'Student',
  COLLEGE: 'College',
  COMPANY: 'Company',
  ADMIN: 'Admin',
};

const roleColors: Record<string, string> = {
  STUDENT: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  COLLEGE: 'bg-accent-violet/10 text-accent-violet border-accent-violet/20',
  COMPANY: 'bg-green-500/10 text-green-400 border-green-500/20',
  ADMIN: 'bg-accent-gold/10 text-accent-gold border-accent-gold/20',
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { addView, getRecentlyViewed } = useRecentlyViewedStore();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similar, setSimilar] = useState<SimilarProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const wishlisted = project ? isWishlisted(project.id) : false;
  const recentlyViewed = getRecentlyViewed(params.id as string).slice(0, 4);

  useEffect(() => {
    async function load() {
      try {
        const [projectRes, reviewsRes] = await Promise.all([
          api.get(`/projects/${params.id}`),
          api.get(`/reviews/project/${params.id}`),
        ]);
        const projectData = projectRes.data.data;
        setProject(projectData);
        setReviews(reviewsRes.data.data.reviews || reviewsRes.data.data);

        // Add to recently viewed
        addView({
          id: projectData.id,
          title: projectData.title,
          price: Number(projectData.price),
          category: projectData.category,
          thumbnailUrl: projectData.thumbnailUrl,
        });

        // Fetch similar projects
        try {
          const { data } = await api.get(`/projects?category=${projectData.category}&limit=5`);
          const filtered = (data.data || []).filter((p: SimilarProject) => p.id !== projectData.id).slice(0, 4);
          setSimilar(filtered);
        } catch { /* ignore */ }
      } catch {
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id, addView]);

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

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (!project) return;

    try {
      if (wishlisted) {
        await removeFromWishlist(project.id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(project.id);
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        projectId: params.id,
        rating: reviewRating,
        comment: reviewComment || undefined,
      });
      toast.success('Review submitted!');
      setReviewRating(0);
      setReviewComment('');

      // Refresh reviews
      const { data } = await api.get(`/reviews/project/${params.id}`);
      setReviews(data.data.reviews || data.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

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
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Project not found</h1>
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
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">{project.title}</h1>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-accent-gold text-accent-gold" />
                <span className="font-medium text-gray-900 dark:text-white">{project.averageRating > 0 ? project.averageRating.toFixed(1) : 'New'}</span>
                <span className="text-gray-500">({project.reviewCount} reviews)</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan text-sm border border-accent-cyan/20 font-medium">
                {project.category.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <div className="glass p-6">
            <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">{project.longDescription || project.description}</p>
          </div>

          {project.features.length > 0 && (
            <div className="glass p-6">
              <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-3">Features</h2>
              <ul className="space-y-2.5">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="h-5 w-5 text-accent-cyan shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="glass p-6">
            <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-3">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-lg bg-accent-cyan/10 text-accent-cyan text-sm border border-accent-cyan/20 font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews Section with Rating Distribution */}
          <div className="glass p-6">
            <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4">Reviews & Ratings</h2>

            {reviews.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-surface-300/20">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-display font-bold text-gray-900 dark:text-white">{project.averageRating.toFixed(1)}</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.round(project.averageRating) ? 'fill-accent-gold text-accent-gold' : 'text-surface-300'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {ratingDistribution.map(({ star, count, percentage }) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-3">{star}</span>
                        <Star className="h-3 w-3 fill-accent-gold text-accent-gold" />
                        <div className="flex-1 h-2 bg-surface-200/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-accent-gold to-accent-cyan rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-6">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Write Review Form */}
            {isAuthenticated && project.isPurchased && (
              <motion.form
                onSubmit={handleReviewSubmit}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-accent-cyan/20"
              >
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Write a Review</h3>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReviewRating(i + 1)}
                      onMouseEnter={() => setReviewHover(i + 1)}
                      onMouseLeave={() => setReviewHover(0)}
                      className="p-0.5"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          i < (reviewHover || reviewRating)
                            ? 'fill-accent-gold text-accent-gold'
                            : 'text-surface-300 hover:text-accent-gold/50'
                        }`}
                      />
                    </button>
                  ))}
                  {reviewRating > 0 && <span className="text-sm text-gray-400 ml-2">{reviewRating}/5</span>}
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this project..."
                  className="input-field text-sm h-20 resize-none"
                />
                <button
                  type="submit"
                  disabled={submittingReview || reviewRating === 0}
                  className="btn-primary text-sm mt-3 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </motion.form>
            )}

            {/* Review List */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-surface-300/20 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white text-xs font-bold">
                        {review.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">{review.user.name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${roleColors[review.user.role] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                            {roleLabels[review.user.role] || review.user.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-accent-gold text-accent-gold' : 'text-surface-300'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeAgo(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.comment && <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm ml-11">{review.comment}</p>}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="glass p-6 sticky top-24">
            <Canvas3DErrorBoundary>
              <ProjectDetailScene3D />
            </Canvas3DErrorBoundary>
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

            <button
              onClick={handleWishlistToggle}
              className={`w-full mt-3 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 border ${
                wishlisted
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                  : 'bg-transparent border-gray-200 dark:border-surface-300/30 text-gray-600 dark:text-gray-400 hover:border-red-400/50 hover:text-red-400'
              }`}
            >
              <Heart className={`h-5 w-5 ${wishlisted ? 'fill-red-500' : ''}`} />
              {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>

            <div className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent-cyan" /> Instant download after purchase</p>
              <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent-cyan" /> Complete source code included</p>
              <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent-cyan" /> Documentation included</p>
              <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent-cyan" /> Secure payment via Razorpay</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
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
                  <p className="text-xs font-bold bg-gradient-to-r from-neon-green to-accent-cyan bg-clip-text text-transparent mt-1">
                    ₹{item.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {similar.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-4">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map((item) => (
              <Link key={item.id} href={`/projects/${item.id}`} className="card-glow group p-0">
                <div className="h-28 relative overflow-hidden rounded-t-2xl">
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent-violet to-accent-pink" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-accent-cyan transition-colors">{item.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold bg-gradient-to-r from-neon-green to-accent-cyan bg-clip-text text-transparent">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-accent-gold text-accent-gold" />
                      <span className="text-xs text-gray-400">{item.averageRating > 0 ? item.averageRating.toFixed(1) : 'New'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
