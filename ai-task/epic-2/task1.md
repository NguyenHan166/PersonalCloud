EPIC 2 – Types & Client Models (rất quan trọng cho nối BE)
Task 2.1 – Định nghĩa TypeScript models map với schema DB

Mục tiêu: FE & BE nói cùng một “ngôn ngữ”.

Việc cần làm:

Tạo file src/types/domain.ts:

export type ItemType = 'file' | 'link' | 'note';
export type Importance = 'low' | 'normal' | 'high';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface FileMeta {
  id: string;
  userId: string;
  storageKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  checksum?: string;
  createdAt: string;
}

export interface Item {
  id: string;
  userId: string;
  type: ItemType;
  fileId?: string;
  url?: string;
  title: string;
  description?: string;
  category?: string;
  project?: string;
  importance: Importance;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
  // extra field hữu ích cho FE:
  file?: FileMeta;
  domain?: string;
  isPinned?: boolean;
  collections?: CollectionSummary[];
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  slugPublic?: string;
  createdAt: string;
}

export interface SharedLink {
  id: string;
  userId: string;
  itemId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  revoked: boolean;
  passwordProtected: boolean;
  item?: Item;
}

export interface EmbeddingMeta {
  id: string;
  itemId: string;
  createdAt: string;
}


BE-friendly:

BE sau này chỉ cần trả JSON match các interface này; FE không phải refactor nhiều.

Có thể share file type này sang BE nếu cùng monorepo.