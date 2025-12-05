// Tags API
import type { Tag } from '@/types/domain';
import type { ListTagsParams } from '@/types/api';
import { mockTags, delay } from './mockData';

const API_DELAY = 200;

/**
 * GET /api/tags
 * List all tags
 */
export async function listTags(params: ListTagsParams = {}): Promise<Tag[]> {
  await delay(API_DELAY);

  let filtered = [...mockTags];

  // Search
  if (params.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter(tag =>
      tag.name.toLowerCase().includes(query)
    );
  }

  // Sort by usage count
  filtered.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));

  // Limit
  if (params.limit) {
    filtered = filtered.slice(0, params.limit);
  }

  return filtered;
}

/**
 * POST /api/tags
 * Create new tag
 */
export async function createTag(name: string, color?: string): Promise<Tag> {
  await delay(API_DELAY);

  return {
    id: `tag-${Date.now()}`,
    name,
    color: color || '#6366F1',
    usageCount: 0,
  };
}

/**
 * DELETE /api/tags/:id
 * Delete tag
 */
export async function deleteTag(id: string): Promise<boolean> {
  await delay(API_DELAY);
  return mockTags.some(tag => tag.id === id);
}

/**
 * Get popular tags (top N by usage)
 */
export async function getPopularTags(limit: number = 5): Promise<Tag[]> {
  await delay(API_DELAY);
  
  return [...mockTags]
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, limit);
}
