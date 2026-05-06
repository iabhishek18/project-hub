'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProjectCategory } from '@project-hub/shared';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Search, SlidersHorizontal } from 'lucide-react';

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

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      params.set('sortBy', sortBy);
      params.set('page', page.toString());
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
    fetchProjects();
  };

  return (
    <div className="pt-20 min-h-screen">
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
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
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
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                >
                  <option value="createdAt">Newest First</option>
                  <option value="price">Price: Low to High</option>
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
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                          p === page
                            ? 'bg-accent-cyan text-surface'
                            : 'bg-surface-100 text-gray-400 border border-surface-300 hover:border-accent-cyan/30'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
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
