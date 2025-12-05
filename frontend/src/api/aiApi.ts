// AI API - AI-powered features
import type { Item } from '@/types/domain';
import type { AiSuggestTagsResponse, AiSummarizeResponse, AiSearchParams, AiSearchResult } from '@/types/api';
import { mockItems, mockTags, delay } from './mockData';

const API_DELAY = 500; // AI operations take longer

/**
 * POST /api/ai/suggest-tags
 * Get AI-suggested tags for content
 */
export async function suggestTags(content: string): Promise<AiSuggestTagsResponse> {
  await delay(API_DELAY);

  // Mock: return random subset of existing tags
  const shuffled = [...mockTags].sort(() => Math.random() - 0.5);
  const suggested = shuffled.slice(0, 3).map(t => t.name);

  return { tags: suggested };
}

/**
 * POST /api/ai/summarize
 * Get AI-generated summary
 */
export async function summarizeContent(content: string): Promise<AiSummarizeResponse> {
  await delay(API_DELAY);

  // Mock summary
  return {
    summary: 'This is an AI-generated summary of the content. It provides a brief overview of the main points and key takeaways from the document or article.',
  };
}

/**
 * POST /api/ai/search
 * AI semantic search
 */
export async function semanticSearch(params: AiSearchParams): Promise<AiSearchResult[]> {
  await delay(API_DELAY);

  const query = params.query.toLowerCase();
  const limit = params.limit || 10;

  // Mock: simple keyword matching with fake scores
  const results = mockItems
    .filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.content?.toLowerCase().includes(query) ||
      item.tags.some(t => t.name.toLowerCase().includes(query))
    )
    .slice(0, limit)
    .map((item, index) => ({
      item,
      score: 0.95 - (index * 0.05), // Fake similarity scores
      highlight: item.description?.substring(0, 100) || item.title,
    }));

  return results;
}

/**
 * POST /api/ai/embed/:itemId
 * Generate embeddings for an item (background job)
 */
export async function generateEmbedding(itemId: string): Promise<{ jobId: string }> {
  await delay(API_DELAY);
  return { jobId: `job-${Date.now()}` };
}
