import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface RecentProject {
  id: string;
  title: string;
  price: number;
  category: string;
  thumbnailUrl?: string;
  viewedAt: number;
}

interface RecentlyViewedState {
  projects: RecentProject[];
  addView: (project: Omit<RecentProject, 'viewedAt'>) => void;
  getRecentlyViewed: (excludeId?: string) => RecentProject[];
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      projects: [],

      addView: (project) => {
        set((state) => {
          const filtered = state.projects.filter((p) => p.id !== project.id);
          const updated = [{ ...project, viewedAt: Date.now() }, ...filtered].slice(0, 10);
          return { projects: updated };
        });
      },

      getRecentlyViewed: (excludeId?: string) => {
        const { projects } = get();
        if (excludeId) {
          return projects.filter((p) => p.id !== excludeId);
        }
        return projects;
      },

      clear: () => set({ projects: [] }),
    }),
    {
      name: 'project-hub-recently-viewed',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
    }
  )
);
