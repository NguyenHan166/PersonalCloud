// Domain types - matches BE schema

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  usageCount?: number;
}

export type ItemType = 'file' | 'link' | 'note';
export type Importance = 'low' | 'normal' | 'high';

export interface FileMeta {
  id: string;
  userId: string;
  storageKey: string;
  originalName: string;
  filename: string; // display name
  mimeType: string;
  size: number;
  url?: string; // access URL
  thumbnailUrl?: string;
  checksum?: string;
  createdAt: string;
  uploadedAt: string;
}

export interface CollectionSummary {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  userId: string;
  type: ItemType;
  title: string;
  description?: string;
  category?: string;
  project?: string;
  importance: Importance;
  tags: Tag[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  // For file type
  fileId?: string;
  file?: FileMeta;
  mimeType?: string;
  size?: number;
  thumbnailUrl?: string;
  // For link type
  url?: string;
  domain?: string;
  // For note type
  content?: string;
  // Relations
  collections?: CollectionSummary[];
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  slugPublic?: string;
  itemCount: number;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SharedLink {
  id: string;
  userId: string;
  itemId: string;
  item?: Item;
  token: string;
  hasPassword: boolean;
  expiresAt: string;
  createdAt: string;
  isRevoked: boolean;
  accessCount: number;
}

export interface EmbeddingMeta {
  id: string;
  itemId: string;
  createdAt: string;
}

// View mode types
export type ViewMode = 'grid' | 'list';
export type SortField = 'createdAt' | 'updatedAt' | 'title' | 'size';
export type SortOrder = 'asc' | 'desc';
