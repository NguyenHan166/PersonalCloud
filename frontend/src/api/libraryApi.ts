// Library API - Items CRUD operations
import type { Item } from '@/types/domain';
import type { ListItemsParams, PaginatedResponse, CreateItemPayload, UpdateItemPayload } from '@/types/api';
import { mockItems, delay } from './mockData';

const API_DELAY = 300;

/**
 * GET /api/items
 * List items with filtering, sorting, and pagination
 */
export async function listItems(params: ListItemsParams = {}): Promise<PaginatedResponse<Item>> {
  await delay(API_DELAY);

  let filtered = [...mockItems];

  // Filter by type
  if (params.type) {
    filtered = filtered.filter(item => item.type === params.type);
  }

  // Filter by category
  if (params.category) {
    filtered = filtered.filter(item => item.category === params.category);
  }

  // Filter by project
  if (params.project) {
    filtered = filtered.filter(item => item.project === params.project);
  }

  // Filter by importance
  if (params.importance) {
    filtered = filtered.filter(item => item.importance === params.importance);
  }

  // Filter by tags
  if (params.tags && params.tags.length > 0) {
    filtered = filtered.filter(item =>
      params.tags!.some(tagId => item.tags.some(t => t.id === tagId))
    );
  }

  // Filter by pinned
  if (params.isPinned !== undefined) {
    filtered = filtered.filter(item => item.isPinned === params.isPinned);
  }

  // Search
  if (params.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.tags.some(t => t.name.toLowerCase().includes(query))
    );
  }

  // Sort
  const sortBy = params.sortBy || 'updatedAt';
  const sortOrder = params.sortOrder || 'desc';
  filtered.sort((a, b) => {
    let aVal: string | number = '';
    let bVal: string | number = '';
    
    switch (sortBy) {
      case 'title':
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
        break;
      case 'size':
        aVal = a.size || 0;
        bVal = b.size || 0;
        break;
      case 'createdAt':
        aVal = a.createdAt;
        bVal = b.createdAt;
        break;
      case 'updatedAt':
      default:
        aVal = a.updatedAt;
        bVal = b.updatedAt;
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pinned items first
  filtered.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  // Pagination
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = filtered.slice(start, end);

  return {
    data: paginated,
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}

/**
 * GET /api/items/:id
 * Get single item by ID
 */
export async function getItem(id: string): Promise<Item | null> {
  await delay(API_DELAY);
  return mockItems.find(item => item.id === id) || null;
}

/**
 * POST /api/items
 * Create new item
 */
export async function createItem(payload: CreateItemPayload): Promise<Item> {
  await delay(API_DELAY);
  
  const newItem: Item = {
    id: `item-${Date.now()}`,
    userId: 'user-1',
    type: payload.type,
    title: payload.title,
    description: payload.description,
    category: payload.category,
    project: payload.project,
    importance: payload.importance || 'normal',
    tags: [],
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    url: payload.url,
    content: payload.content,
  };

  // In real app, add to mockItems
  return newItem;
}

/**
 * PATCH /api/items/:id
 * Update item
 */
export async function updateItem(id: string, payload: UpdateItemPayload): Promise<Item | null> {
  await delay(API_DELAY);
  
  const item = mockItems.find(i => i.id === id);
  if (!item) return null;

  // Destructure tags from payload to handle separately (payload.tags is string[], Item.tags is Tag[])
  const { tags: _tagIds, ...restPayload } = payload;

  const updated: Item = {
    ...item,
    ...restPayload,
    // Keep existing tags - in real API, backend would resolve tag IDs to Tag objects
    updatedAt: new Date().toISOString(),
  };

  return updated;
}

/**
 * DELETE /api/items/:id
 * Delete item (move to trash)
 */
export async function deleteItem(id: string): Promise<boolean> {
  await delay(API_DELAY);
  return mockItems.some(item => item.id === id);
}

/**
 * POST /api/items/:id/pin
 * Toggle pin status
 */
export async function togglePinItem(id: string): Promise<Item | null> {
  await delay(API_DELAY);
  
  const item = mockItems.find(i => i.id === id);
  if (!item) return null;

  return {
    ...item,
    isPinned: !item.isPinned,
    updatedAt: new Date().toISOString(),
  };
}
