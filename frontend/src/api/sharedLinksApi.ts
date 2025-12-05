// Shared Links API
import type { SharedLink } from '@/types/domain';
import type { CreateSharedLinkPayload } from '@/types/api';
import { mockSharedLinks, mockItems, delay } from './mockData';

const API_DELAY = 300;

/**
 * GET /api/shared-links
 * List all shared links for current user
 */
export async function listSharedLinks(): Promise<SharedLink[]> {
  await delay(API_DELAY);
  return mockSharedLinks;
}

/**
 * GET /api/shared-links/:id
 * Get shared link by ID
 */
export async function getSharedLink(id: string): Promise<SharedLink | null> {
  await delay(API_DELAY);
  return mockSharedLinks.find(link => link.id === id) || null;
}

/**
 * GET /s/:token
 * Access shared item by token (public endpoint)
 */
export async function accessSharedLink(token: string, password?: string): Promise<{
  success: boolean;
  item?: SharedLink['item'];
  error?: string;
}> {
  await delay(API_DELAY);

  const link = mockSharedLinks.find(l => l.token === token);
  
  if (!link) {
    return { success: false, error: 'Link not found' };
  }

  if (link.isRevoked) {
    return { success: false, error: 'This link has been revoked' };
  }

  if (new Date(link.expiresAt) < new Date()) {
    return { success: false, error: 'This link has expired' };
  }

  if (link.hasPassword && !password) {
    return { success: false, error: 'Password required' };
  }

  return { success: true, item: link.item };
}

/**
 * POST /api/shared-links
 * Create new shared link
 */
export async function createSharedLink(payload: CreateSharedLinkPayload): Promise<SharedLink> {
  await delay(API_DELAY);

  const item = mockItems.find(i => i.id === payload.itemId);
  const token = Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + payload.expiresIn);

  const newLink: SharedLink = {
    id: `share-${Date.now()}`,
    userId: 'user-1',
    itemId: payload.itemId,
    item,
    token,
    hasPassword: !!payload.password,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
    isRevoked: false,
    accessCount: 0,
  };

  return newLink;
}

/**
 * DELETE /api/shared-links/:id
 * Revoke shared link
 */
export async function revokeSharedLink(id: string): Promise<boolean> {
  await delay(API_DELAY);
  return mockSharedLinks.some(link => link.id === id);
}

/**
 * PATCH /api/shared-links/:id/extend
 * Extend shared link expiration
 */
export async function extendSharedLink(id: string, additionalHours: number = 168): Promise<SharedLink | null> {
  await delay(API_DELAY);
  const link = mockSharedLinks.find(l => l.id === id);
  if (!link) return null;
  
  // Calculate new expiration time
  const currentExpiry = new Date(link.expiresAt);
  const now = new Date();
  // If expired, extend from now; otherwise extend from current expiry
  const baseTime = currentExpiry < now ? now : currentExpiry;
  baseTime.setHours(baseTime.getHours() + additionalHours);
  
  // Return updated link (in real implementation, this would update the backend)
  return {
    ...link,
    expiresAt: baseTime.toISOString(),
    isRevoked: false, // Re-activate if it was revoked
  };
}

/**
 * DELETE /api/shared-links/:id (permanent delete)
 * Permanently delete a shared link
 */
export async function deleteSharedLink(id: string): Promise<boolean> {
  await delay(API_DELAY);
  // In real implementation, this would permanently remove from database
  return mockSharedLinks.some(link => link.id === id);
}

/**
 * Get share URL for a token
 */
export function getShareUrl(token: string): string {
  return `${window.location.origin}/s/${token}`;
}

/**
 * Check if a shared link is expired
 */
export function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

/**
 * Get status of shared link
 */
export function getShareStatus(link: SharedLink): 'active' | 'expired' | 'revoked' {
  if (link.isRevoked) return 'revoked';
  if (isExpired(link.expiresAt)) return 'expired';
  return 'active';
}
