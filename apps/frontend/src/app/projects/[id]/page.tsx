'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
        theme: { color: '#2563eb' },
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
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-8" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Project not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{project.averageRating > 0 ? project.averageRating.toFixed(1) : 'New'}</span>
                <span className="text-gray-500">({project.reviewCount} reviews)</span>
              </div>
              <span className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full font-medium">
                {project.category.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{project.longDescription || project.description}</p>
          </div>

          {project.features.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Features</h2>
              <ul className="space-y-2">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{review.user.name}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="mt-1 text-gray-600 text-sm">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <div className="text-3xl font-bold text-gray-900 mb-4">
              &#8377;{Number(project.price).toLocaleString('en-IN')}
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

            <div className="mt-6 text-sm text-gray-500 space-y-2">
              <p>&#10003; Instant download after purchase</p>
              <p>&#10003; Complete source code included</p>
              <p>&#10003; Documentation included</p>
              <p>&#10003; Secure payment via Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
