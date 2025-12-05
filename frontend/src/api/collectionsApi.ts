// Collections API
import type { Collection, Item } from '@/types/domain';
import type { ListCollectionsParams, PaginatedResponse, CreateCollectionPayload, UpdateCollectionPayload } from '@/types/api';
import { mockCollections, mockItems, delay } from './mockData';

const API_DELAY = 300;

/**
 * GET /api/collections
 * List all collections
 */
export async function listCollections(params: ListCollectionsParams = {}): Promise<PaginatedResponse<Collection>> {
  await delay(API_DELAY);

  let filtered = [...mockCollections];

  // Search
  if (params.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter(col =>
      col.name.toLowerCase().includes(query) ||
      col.description?.toLowerCase().includes(query)
    );
  }

  // Sort by updated
  filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

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
 * GET /api/collections/:id
 * Get collection by ID
 */
export async function getCollection(id: string): Promise<Collection | null> {
  await delay(API_DELAY);
  return mockCollections.find(col => col.id === id) || null;
}

/**
 * GET /api/collections/:id/items
 * Get items in a collection
 */
export async function getCollectionItems(collectionId: string): Promise<Item[]> {
  await delay(API_DELAY);
  
  return mockItems.filter(item =>
    item.collections?.some(col => col.id === collectionId)
  );
}

/**
 * POST /api/collections
 * Create new collection
 */
export async function createCollection(payload: CreateCollectionPayload): Promise<Collection> {
  await delay(API_DELAY);

  const newCollection: Collection = {
    id: `col-${Date.now()}`,
    userId: 'user-1',
    name: payload.name,
    description: payload.description,
    isPublic: payload.isPublic || false,
    itemCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return newCollection;
}

/**
 * PATCH /api/collections/:id
 * Update collection
 */
export async function updateCollection(id: string, payload: UpdateCollectionPayload): Promise<Collection | null> {
  await delay(API_DELAY);

  const collection = mockCollections.find(col => col.id === id);
  if (!collection) return null;

  return {
    ...collection,
    ...payload,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * DELETE /api/collections/:id
 * Delete collection
 */
export async function deleteCollection(id: string): Promise<boolean> {
  await delay(API_DELAY);
  return mockCollections.some(col => col.id === id);
}

/**
 * POST /api/collections/:id/items
 * Add item to collection
 */
export async function addItemToCollection(collectionId: string, itemId: string): Promise<boolean> {
  await delay(API_DELAY);
  return true;
}

/**
 * DELETE /api/collections/:id/items/:itemId
 * Remove item from collection
 */
export async function removeItemFromCollection(collectionId: string, itemId: string): Promise<boolean> {
  await delay(API_DELAY);
  return true;
}
