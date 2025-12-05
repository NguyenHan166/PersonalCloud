// Files API - File upload and management
import type { FileMeta, Item } from '@/types/domain';
import type { InitUploadResponse, ConfirmUploadPayload } from '@/types/api';
import { mockFiles, mockItems, delay } from './mockData';

const API_DELAY = 300;

/**
 * POST /api/upload/init
 * Initialize file upload - get presigned URL
 */
export async function initUpload(fileName: string, mimeType: string): Promise<InitUploadResponse> {
  await delay(API_DELAY);
  
  return {
    uploadId: `upload-${Date.now()}`,
    presignedUrl: `https://storage.example.com/upload?token=${Date.now()}`,
  };
}

/**
 * POST /api/files/confirm
 * Confirm upload and create file record
 */
export async function confirmUpload(payload: ConfirmUploadPayload): Promise<Item> {
  await delay(API_DELAY);
  
  const file: FileMeta = {
    id: `file-${Date.now()}`,
    userId: 'user-1',
    storageKey: `uploads/${new Date().getFullYear()}/${payload.originalName}`,
    originalName: payload.originalName,
    filename: payload.originalName, // display name
    mimeType: payload.mimeType,
    size: payload.size,
    createdAt: new Date().toISOString(),
    uploadedAt: new Date().toISOString(),
  };

  const item: Item = {
    id: `item-${Date.now()}`,
    userId: 'user-1',
    type: 'file',
    title: payload.title || payload.originalName,
    description: payload.description,
    category: payload.category,
    project: payload.project,
    importance: 'normal',
    tags: [],
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fileId: file.id,
    file,
    mimeType: payload.mimeType,
    size: payload.size,
  };

  return item;
}

/**
 * GET /api/files
 * List all files
 */
export async function listFiles(): Promise<FileMeta[]> {
  await delay(API_DELAY);
  return mockFiles;
}

/**
 * GET /api/files/:id/download
 * Get download URL for file
 */
export async function getDownloadUrl(fileId: string): Promise<string> {
  await delay(API_DELAY);
  return `https://storage.example.com/download/${fileId}?token=${Date.now()}`;
}

/**
 * DELETE /api/files/:id
 * Delete file permanently
 */
export async function deleteFile(fileId: string): Promise<boolean> {
  await delay(API_DELAY);
  return mockFiles.some(f => f.id === fileId);
}

/**
 * Get storage usage statistics
 */
export interface StorageStats {
  used: number;
  total: number;
  byType: {
    images: number;
    videos: number;
    documents: number;
    others: number;
  };
}

export async function getStorageStats(): Promise<StorageStats> {
  await delay(API_DELAY);

  const fileItems = mockItems.filter(item => item.type === 'file' && item.size);
  const totalUsed = fileItems.reduce((sum, item) => sum + (item.size || 0), 0);

  return {
    used: totalUsed,
    total: 5 * 1024 * 1024 * 1024, // 5GB
    byType: {
      images: fileItems
        .filter(item => item.mimeType?.startsWith('image/'))
        .reduce((sum, item) => sum + (item.size || 0), 0),
      videos: fileItems
        .filter(item => item.mimeType?.startsWith('video/'))
        .reduce((sum, item) => sum + (item.size || 0), 0),
      documents: fileItems
        .filter(item => 
          item.mimeType?.includes('pdf') || 
          item.mimeType?.includes('document') ||
          item.mimeType?.includes('word')
        )
        .reduce((sum, item) => sum + (item.size || 0), 0),
      others: 0,
    },
  };
}
