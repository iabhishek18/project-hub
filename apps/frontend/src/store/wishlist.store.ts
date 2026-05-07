import { create } from 'zustand';
import { api } from '@/lib/api';
import { useAuthStore } from './auth.store';

interface WishlistState {
  items: string[];
  isLoaded: boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (projectId: string) => Promise<void>;
  removeFromWishlist: (projectId: string) => Promise<void>;
  isWishlisted: (projectId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoaded: false,

  fetchWishlist: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;

    try {
      const { data } = await api.get('/wishlist');
      const ids = data.data.map((item: { project: { id: string } }) => item.project.id);
      set({ items: ids, isLoaded: true });
    } catch {
      set({ isLoaded: true });
    }
  },

  addToWishlist: async (projectId: string) => {
    set((state) => ({ items: [...state.items, projectId] }));
    try {
      await api.post('/wishlist', { projectId });
    } catch {
      set((state) => ({ items: state.items.filter((id) => id !== projectId) }));
      throw new Error('Failed to add to wishlist');
    }
  },

  removeFromWishlist: async (projectId: string) => {
    const prev = get().items;
    set((state) => ({ items: state.items.filter((id) => id !== projectId) }));
    try {
      await api.delete(`/wishlist/${projectId}`);
    } catch {
      set({ items: prev });
      throw new Error('Failed to remove from wishlist');
    }
  },

  isWishlisted: (projectId: string) => {
    return get().items.includes(projectId);
  },

  clear: () => set({ items: [], isLoaded: false }),
}));
