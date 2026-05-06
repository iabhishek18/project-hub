'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@project-hub/shared';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  category: string;
  price: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== UserRole.ADMIN) {
      router.push('/auth/admin');
      return;
    }
    fetchProjects();
  }, [isAuthenticated, user, router]);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects?limit=50');
      setProjects(data.data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      setProjects(projects.filter(p => p.id !== id));
    } catch {
      toast.error('Failed to delete project');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse"><div className="h-96 bg-gray-200 rounded-xl" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Projects</h1>
        <Link href="/dashboard/admin/projects/new" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" /> Add Project
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{project.title}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {project.category.replace('_', ' ')}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  ₹{Number(project.price).toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {project.isFeatured && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">Featured</span>
                    )}
                    <span className={`px-2 py-0.5 text-xs rounded-full ${project.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {project.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/admin/projects/${project.id}/edit`} className="p-1.5 text-gray-400 hover:text-primary-600">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleDelete(project.id)} className="p-1.5 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">No projects yet</div>
        )}
      </div>
    </div>
  );
}
