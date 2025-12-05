import React from 'react';
import { ItemCard } from './ItemCard';
import { ItemListRow } from './ItemListRow';
import { ItemCardSkeleton, ItemListRowSkeleton } from './ItemSkeleton';
import { EmptyState } from '@/components/common';
import { FolderOpen, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import type { Item, ViewMode } from '@/types/domain';

interface ItemGridProps {
  items: Item[];
  viewMode: ViewMode;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onItemClick?: (item: Item) => void;
  onItemPin?: (item: Item) => void;
  onItemMenu?: (item: Item, e: React.MouseEvent) => void;
  onRetry?: () => void;
  onAddItem?: () => void;
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  viewMode,
  isLoading,
  isError,
  errorMessage,
  onItemClick,
  onItemPin,
  onItemMenu,
  onRetry,
  onAddItem,
}) => {
  // Loading state
  if (isLoading) {
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <ItemCardSkeleton count={8} />
        </div>
      );
    }
    return (
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <ItemListRowSkeleton count={8} />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-full h-full" />}
        title="Something went wrong"
        description={errorMessage || "Failed to load items. Please try again."}
        action={onRetry ? {
          label: 'Try Again',
          onClick: onRetry,
          icon: <RefreshCw className="w-4 h-4" />,
        } : undefined}
      />
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<FolderOpen className="w-full h-full" />}
        title="No items found"
        description="Start building your personal knowledge library by adding files, links, or notes."
        action={onAddItem ? {
          label: 'Add Your First Item',
          onClick: onAddItem,
          icon: <Plus className="w-4 h-4" />,
        } : undefined}
      />
    );
  }

  // Grid view
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={onItemClick}
            onPin={onItemPin}
            onMenu={onItemMenu}
          />
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      {/* Table header */}
      <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-gray-50 border-b border-border text-xs font-medium text-muted uppercase tracking-wider">
        <div className="w-5" /> {/* Icon */}
        <div className="flex-1">Title</div>
        <div className="hidden md:block w-[200px]">Tags</div>
        <div className="hidden lg:block w-24">Category</div>
        <div className="hidden sm:block w-20 text-right">Size</div>
        <div className="w-24 text-right">Modified</div>
        <div className="w-16" /> {/* Actions */}
      </div>
      {items.map(item => (
        <ItemListRow
          key={item.id}
          item={item}
          onClick={onItemClick}
          onPin={onItemPin}
          onMenu={onItemMenu}
        />
      ))}
    </div>
  );
};
