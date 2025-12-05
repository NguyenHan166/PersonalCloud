// API DTOs and request/response types
import type { Item, ItemType, Importance, Collection, SharedLink, Tag, SortField, SortOrder } from './domain';

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Items / Library
export interface ListItemsParams {
  page?: number;
  pageSize?: number;
  type?: ItemType;
  category?: string;
  project?: string;
  tags?: string[];
  importance?: Importance;
  search?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  isPinned?: boolean;
}

export interface CreateItemPayload {
  type: ItemType;
  title: string;
  description?: string;
  category?: string;
  project?: string;
  importance?: Importance;
  tags?: string[];
  // For link
  url?: string;
  // For note
  content?: string;
}

export interface UpdateItemPayload {
  title?: string;
  description?: string;
  category?: string;
  project?: string;
  importance?: Importance;
  tags?: string[];
  isPinned?: boolean;
  content?: string;
}

// Collections
export interface ListCollectionsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateCollectionPayload {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateCollectionPayload {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

// Shared Links
export interface CreateSharedLinkPayload {
  itemId: string;
  expiresIn: number; // hours
  password?: string;
}

// Files
export interface InitUploadResponse {
  uploadId: string;
  presignedUrl: string;
}

export interface ConfirmUploadPayload {
  uploadId: string;
  originalName: string;
  mimeType: string;
  size: number;
  title?: string;
  description?: string;
  category?: string;
  project?: string;
  tags?: string[];
}

// Tags
export interface ListTagsParams {
  search?: string;
  limit?: number;
}

// AI
export interface AiSuggestTagsResponse {
  tags: string[];
}

export interface AiSummarizeResponse {
  summary: string;
}

export interface AiSearchParams {
  query: string;
  limit?: number;
}

export interface AiSearchResult {
  item: Item;
  score: number;
  highlight?: string;
}
