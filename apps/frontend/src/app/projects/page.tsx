'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ProjectCategory } from '@project-hub/shared';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Search, SlidersHorizontal } from 'lucide-react';

const ParticleField3D = dynamic(() => import('@/components/ui/ParticleField3D').then(m => ({ default: m.ParticleField3D })), { ssr: false });

interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ProjectCategory;
  techStack: string[];
  thumbnailUrl?: string;
  averageRating: number;
  reviewCount: number;
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'WEB_DEVELOPMENT', label: 'Web Development' },
  { value: 'MOBILE_APP', label: 'Mobile Apps' },
  { value: 'MACHINE_LEARNING', label: 'Machine Learning' },
  { value: 'DATA_SCIENCE', label: 'Data Science' },
  { value: 'BLOCKCHAIN', label: 'Blockchain' },
  { value: 'IOT', label: 'IoT' },
  { value: 'CLOUD_COMPUTING', label: 'Cloud Computing' },
  { value: 'CYBERSECURITY', label: 'Cybersecurity' },
  { value: 'GAME_DEVELOPMENT', label: 'Game Dev' },
  { value: 'DEVOPS', label: 'DevOps' },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="pt-20 min-h-screen" />}>
      <ProjectsContent />
    </Suspense>
  );
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('createdAt');
  const [showFilters, setShowFilters] = useState(false);

  const fetchProjects = useCallback(async (overrides?: { page?: number; category?: string; sortBy?: string; search?: string }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const s = overrides?.search ?? search;
      const c = overrides?.category ?? category;
      const sort = overrides?.sortBy ?? sortBy;
      const p = overrides?.page ?? page;

      if (s) params.set('search', s);
      if (c) params.set('category', c);
      if (sort === 'price_asc') {
        params.set('sortBy', 'price');
        params.set('sortOrder', 'asc');
      } else if (sort === 'price_desc') {
        params.set('sortBy', 'price');
        params.set('sortOrder', 'desc');
      } else {
        params.set('sortBy', 'createdAt');
        params.set('sortOrder', 'desc');
      }
      params.set('page', p.toString());
      params.set('limit', '12');

      const { data } = await api.get(`/projects?${params.toString()}`);
      setProjects(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, sortBy, page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProjects({ page: 1, search });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
    fetchProjects({ page: 1, category: newCategory });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setPage(1);
    fetchProjects({ page: 1, sortBy: newSort });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-20 min-h-screen">
      <ParticleField3D count={500} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10"
        >
          <h1 className="text-4xl font-display font-bold">
            Explore <span className="gradient-text">Projects</span>
          </h1>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search projects..."
                className="input-field pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary">Search</button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary md:hidden"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </form>
        </motion.div>

        <div className="flex gap-6">
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0`}>
            <div className="glass p-5 space-y-5 sticky top-20">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  className="input-field text-sm"
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Sort By</label>
                <select
                  className="input-field text-sm"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="createdAt">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-36 bg-surface-200/50" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-surface-200/50 rounded w-3/4" />
                      <div className="h-4 bg-surface-200/50 rounded w-full" />
                      <div className="h-4 bg-surface-200/50 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length > 0 ? (
              <>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                >
                  {projects.map((project) => (
                    <motion.div key={project.id} variants={fadeUp}>
                      <ProjectCard {...project} price={Number(project.price)} />
                    </motion.div>
                  ))}
                </motion.div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl font-medium text-sm transition-all border border-gray-200 dark:border-surface-300 text-gray-600 dark:text-gray-400 hover:border-accent-blue dark:hover:border-accent-cyan/30 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                          p === page
                            ? 'bg-accent-blue dark:bg-accent-cyan text-white dark:text-surface shadow-md'
                            : 'bg-gray-100 dark:bg-surface-100 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-surface-300 hover:border-accent-blue dark:hover:border-accent-cyan/30'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-xl font-medium text-sm transition-all border border-gray-200 dark:border-surface-300 text-gray-600 dark:text-gray-400 hover:border-accent-blue dark:hover:border-accent-cyan/30 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
