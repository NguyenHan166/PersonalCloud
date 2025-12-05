import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tag } from '@/types/domain';

// Default tags for new users
const defaultTags: Tag[] = [
  { id: 'tag-1', name: 'Work', color: '#6366F1', usageCount: 0 },
  { id: 'tag-2', name: 'Personal', color: '#22C55E', usageCount: 0 },
  { id: 'tag-3', name: 'Important', color: '#EF4444', usageCount: 0 },
];

interface TagsState {
  tags: Tag[];
  isLoading: boolean;
  
  // Actions
  loadTags: () => Promise<void>;
  addTag: (name: string, color: string) => Promise<Tag>;
  updateTag: (id: string, updates: Partial<Pick<Tag, 'name' | 'color'>>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  getTagById: (id: string) => Tag | undefined;
  getTagsByIds: (ids: string[]) => Tag[];
  incrementUsage: (tagId: string) => void;
  decrementUsage: (tagId: string) => void;
  
  // For BE integration
  setTags: (tags: Tag[]) => void;
  clearTags: () => void;
}

export const useTagsStore = create<TagsState>()(
  persist(
    (set, get) => ({
      tags: [],
      isLoading: false,

      loadTags: async () => {
        set({ isLoading: true });
        
        // TODO: Replace with API call
        // const response = await tagsApi.getMyTags();
        // set({ tags: response.data, isLoading: false });
        
        // For now, use default tags if empty
        const { tags } = get();
        if (tags.length === 0) {
          set({ tags: defaultTags });
        }
        
        set({ isLoading: false });
      },

      addTag: async (name: string, color: string) => {
        // TODO: Replace with API call
        // const response = await tagsApi.create({ name, color });
        // const newTag = response.data;
        
        const newTag: Tag = {
          id: `tag-${Date.now()}`,
          name,
          color,
          usageCount: 0,
        };

        set((state) => ({
          tags: [...state.tags, newTag],
        }));

        return newTag;
      },

      updateTag: async (id: string, updates: Partial<Pick<Tag, 'name' | 'color'>>) => {
        // TODO: Replace with API call
        // await tagsApi.update(id, updates);
        
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === id ? { ...tag, ...updates } : tag
          ),
        }));
      },

      deleteTag: async (id: string) => {
        // TODO: Replace with API call
        // await tagsApi.delete(id);
        
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
        }));
      },

      getTagById: (id: string) => {
        return get().tags.find((tag) => tag.id === id);
      },

      getTagsByIds: (ids: string[]) => {
        return get().tags.filter((tag) => ids.includes(tag.id));
      },

      incrementUsage: (tagId: string) => {
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === tagId
              ? { ...tag, usageCount: (tag.usageCount || 0) + 1 }
              : tag
          ),
        }));
      },

      decrementUsage: (tagId: string) => {
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === tagId
              ? { ...tag, usageCount: Math.max(0, (tag.usageCount || 0) - 1) }
              : tag
          ),
        }));
      },

      // For BE integration - set tags from API response
      setTags: (tags: Tag[]) => {
        set({ tags });
      },

      // Clear tags on logout
      clearTags: () => {
        set({ tags: [] });
      },
    }),
    {
      name: 'cloudhan-tags',
      // Persist only tags data
      partialize: (state) => ({
        tags: state.tags,
      }),
    }
  )
);

// Hook to initialize tags when user logs in
export const useInitializeTags = () => {
  const loadTags = useTagsStore((state) => state.loadTags);
  return loadTags;
};
