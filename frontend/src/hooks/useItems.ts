import { useState, useEffect, useCallback } from 'react';
import type { Item, ItemType, SortField, SortOrder } from '@/types/domain';
import type { PaginatedResponse, ListItemsParams } from '@/types/api';
import { listItems } from '@/api/libraryApi';

export interface UseItemsFilters {
  search: string;
  type: ItemType | 'all';
  tags: string[];
  category: string;
  project: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

interface UseItemsState {
  items: Item[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

interface UseItemsReturn extends UseItemsState {
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

const defaultFilters: UseItemsFilters = {
  search: '',
  type: 'all',
  tags: [],
  category: '',
  project: '',
  sortBy: 'updatedAt',
  sortOrder: 'desc',
};

export function useItems(filters: UseItemsFilters = defaultFilters): UseItemsReturn {
  const [state, setState] = useState<UseItemsState>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
    isLoading: true,
    isError: false,
    errorMessage: null,
  });

  const fetchItems = useCallback(async (page: number = 1, append: boolean = false) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      isError: false, 
      errorMessage: null 
    }));

    try {
      const params: ListItemsParams = {
        page,
        pageSize: state.pageSize,
        search: filters.search || undefined,
        type: filters.type === 'all' ? undefined : filters.type,
        tags: filters.tags.length > 0 ? filters.tags : undefined,
        category: filters.category || undefined,
        project: filters.project || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      const response: PaginatedResponse<Item> = await listItems(params);

      setState(prev => ({
        ...prev,
        items: append ? [...prev.items, ...response.data] : response.data,
        total: response.total,
        page: response.page,
        totalPages: response.totalPages,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'Failed to load items',
      }));
    }
  }, [filters, state.pageSize]);

  // Fetch on filter change
  useEffect(() => {
    fetchItems(1, false);
  }, [filters.search, filters.type, filters.tags.join(','), filters.category, filters.project, filters.sortBy, filters.sortOrder]);

  const refetch = useCallback(() => {
    fetchItems(1, false);
  }, [fetchItems]);

  const loadMore = useCallback(() => {
    if (state.page < state.totalPages && !state.isLoading) {
      fetchItems(state.page + 1, true);
    }
  }, [fetchItems, state.page, state.totalPages, state.isLoading]);

  return {
    ...state,
    refetch,
    loadMore,
    hasMore: state.page < state.totalPages,
  };
}
