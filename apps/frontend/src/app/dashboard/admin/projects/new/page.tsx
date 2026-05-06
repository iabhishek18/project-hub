'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ProjectCategory } from '@project-hub/shared';
import toast from 'react-hot-toast';

const categories = Object.values(ProjectCategory);

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    price: '',
    category: ProjectCategory.WEB_DEVELOPMENT,
    techStack: '',
    features: '',
    fileUrl: '',
    fileKey: '',
    thumbnailUrl: '',
    isFeatured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/projects', {
        title: form.title,
        description: form.description,
        longDescription: form.longDescription || undefined,
        price: Number(form.price),
        category: form.category,
        techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean),
        features: form.features ? form.features.split('\n').map(s => s.trim()).filter(Boolean) : undefined,
        fileUrl: form.fileUrl,
        fileKey: form.fileKey,
        thumbnailUrl: form.thumbnailUrl || undefined,
        isFeatured: form.isFeatured,
      });
      toast.success('Project created!');
      router.push('/dashboard/admin/projects');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Project</h1>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input id="title" type="text" required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
            <textarea id="description" required rows={3} className="input-field resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div>
            <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
            <textarea id="longDescription" rows={5} className="input-field resize-none" value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (INR) *</label>
              <input id="price" type="number" required min={1} className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select id="category" className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProjectCategory })}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="techStack" className="block text-sm font-medium text-gray-700 mb-1">Tech Stack * (comma-separated)</label>
            <input id="techStack" type="text" required className="input-field" placeholder="React, Node.js, PostgreSQL" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} />
          </div>

          <div>
            <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
            <textarea id="features" rows={4} className="input-field resize-none" placeholder="User authentication&#10;Real-time updates&#10;Admin panel" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700 mb-1">File URL (S3) *</label>
              <input id="fileUrl" type="url" required className="input-field" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
            </div>
            <div>
              <label htmlFor="fileKey" className="block text-sm font-medium text-gray-700 mb-1">File Key (S3) *</label>
              <input id="fileKey" type="text" required className="input-field" placeholder="projects/my-project.zip" value={form.fileKey} onChange={(e) => setForm({ ...form, fileKey: e.target.value })} />
            </div>
          </div>

          <div>
            <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
            <input id="thumbnailUrl" type="url" className="input-field" value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} />
          </div>

          <div className="flex items-center gap-2">
            <input id="featured" type="checkbox" className="w-4 h-4 text-primary-600 rounded" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Project</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Creating...' : 'Create Project'}
            </button>
            <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
