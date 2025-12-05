import { useState, useMemo } from 'react';
import { Share2, Copy, Ban, ExternalLink, Lock, Clock, Eye, Check, FileText, Link as LinkIcon, Image, StickyNote } from 'lucide-react';
import { EmptyState, Badge, Tooltip } from '@/components/common';
import { mockSharedLinks } from '@/api/mockData';
import type { SharedLink, Item } from '@/types/domain';

type ShareStatus = 'all' | 'active' | 'expired' | 'revoked';

// Get status of shared link
const getShareStatus = (link: SharedLink): 'active' | 'expired' | 'revoked' => {
  if (link.isRevoked) return 'revoked';
  if (new Date(link.expiresAt) < new Date()) return 'expired';
  return 'active';
};

// Get icon for item type
const getItemIcon = (item?: Item) => {
  if (!item) return FileText;
  if (item.type === 'link') return LinkIcon;
  if (item.type === 'note') return StickyNote;
  if (item.mimeType?.startsWith('image/')) return Image;
  return FileText;
};

// Format relative time
const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return `${Math.abs(days)} days ago`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `in ${days} days`;
};

export const SharedLinksPage = () => {
  const [statusFilter, setStatusFilter] = useState<ShareStatus>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter shared links
  const filteredLinks = useMemo(() => {
    return mockSharedLinks.filter(link => {
      if (statusFilter === 'all') return true;
      return getShareStatus(link) === statusFilter;
    });
  }, [statusFilter]);

  // Copy share URL to clipboard
  const handleCopy = async (link: SharedLink) => {
    const url = `${window.location.origin}/s/${link.token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Revoke share link
  const handleRevoke = (link: SharedLink) => {
    console.log('Revoke link:', link.id);
    // TODO: Call API to revoke
  };

  const hasLinks = mockSharedLinks.length > 0;

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Shared Links</h1>
          <p className="text-muted mt-1">Manage your shared files and collections</p>
        </div>
      </div>

      {hasLinks ? (
        <>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ShareStatus)}
              className="w-40 px-3 py-2 rounded-lg border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
            </select>
            <span className="text-sm text-muted">
              {filteredLinks.length} of {mockSharedLinks.length} links
            </span>
          </div>

          {/* Table */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted">Item</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted">Share URL</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted">Expires</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted">Views</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map(link => {
                    const status = getShareStatus(link);
                    const ItemIcon = getItemIcon(link.item);
                    const shareUrl = `${window.location.origin}/s/${link.token}`;

                    return (
                      <tr key={link.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                        {/* Item */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <ItemIcon className="w-4 h-4 text-muted" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-text truncate max-w-[200px]">
                                {link.item?.title || 'Unknown Item'}
                              </p>
                              <p className="text-xs text-muted">{link.item?.type}</p>
                            </div>
                          </div>
                        </td>

                        {/* Share URL */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded truncate max-w-[180px]">
                              /s/{link.token}
                            </code>
                            {link.hasPassword && (
                              <Tooltip content="Password protected">
                                <Lock className="w-3.5 h-3.5 text-orange-500" />
                              </Tooltip>
                            )}
                          </div>
                        </td>

                        {/* Expiration */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Clock className="w-3.5 h-3.5 text-muted" />
                            <span className={status === 'expired' ? 'text-red-500' : 'text-muted'}>
                              {formatRelativeTime(link.expiresAt)}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              status === 'active' ? 'success' :
                              status === 'expired' ? 'warning' : 'error'
                            }
                            size="sm"
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </td>

                        {/* Views */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-sm text-muted">
                            <Eye className="w-3.5 h-3.5" />
                            {link.accessCount}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip content={copiedId === link.id ? 'Copied!' : 'Copy link'}>
                              <button
                                onClick={() => handleCopy(link)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-muted hover:text-text transition-colors"
                              >
                                {copiedId === link.id ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </Tooltip>
                            <Tooltip content="View public page">
                              <a
                                href={shareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg hover:bg-gray-100 text-muted hover:text-text transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Tooltip>
                            {status === 'active' && (
                              <Tooltip content="Revoke access">
                                <button
                                  onClick={() => handleRevoke(link)}
                                  className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors"
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {filteredLinks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted">No links match the selected filter.</p>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<Share2 className="w-full h-full" />}
          title="No shared links"
          description="When you share files or collections, they will appear here."
        />
      )}
    </div>
  );
};
