import React from 'react';
import { classNames } from '@/utils/classNames';
import { Badge, Tooltip } from '@/components/common';
import { FileText, Image, Video, Link, StickyNote, Pin, Star, MoreHorizontal, ExternalLink } from 'lucide-react';
import type { Item } from '@/types/domain';

// Reuse helpers from ItemCard
const getTypeIcon = (item: Item) => {
  if (item.type === 'link') return Link;
  if (item.type === 'note') return StickyNote;
  if (item.mimeType?.startsWith('image/')) return Image;
  if (item.mimeType?.startsWith('video/')) return Video;
  return FileText;
};

const getTypeColor = (item: Item) => {
  if (item.type === 'link') return 'text-blue-500';
  if (item.type === 'note') return 'text-amber-500';
  if (item.mimeType?.startsWith('image/')) return 'text-purple-500';
  if (item.mimeType?.startsWith('video/')) return 'text-pink-500';
  return 'text-gray-500';
};

const formatSize = (bytes?: number) => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

interface ItemListRowProps {
  item: Item;
  onClick?: (item: Item) => void;
  onPin?: (item: Item) => void;
  onMenu?: (item: Item, e: React.MouseEvent) => void;
}

export const ItemListRow: React.FC<ItemListRowProps> = ({
  item,
  onClick,
  onPin,
  onMenu,
}) => {
  const TypeIcon = getTypeIcon(item);
  const typeColor = getTypeColor(item);

  return (
    <div
      onClick={() => onClick?.(item)}
      className={classNames(
        'group flex items-center gap-4 px-4 py-3',
        'bg-surface border-b border-border cursor-pointer',
        'hover:bg-gray-50 transition-colors'
      )}
    >
      {/* Type icon */}
      <div className={classNames('flex-shrink-0', typeColor)}>
        <TypeIcon className="w-5 h-5" />
      </div>

      {/* Title & Description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {item.isPinned && (
            <Pin className="w-3 h-3 text-primary fill-primary flex-shrink-0" />
          )}
          {item.importance === 'high' && (
            <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
          )}
          <h3 className="font-medium text-text truncate">
            {item.title}
          </h3>
          {item.type === 'link' && item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted hover:text-primary flex-shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-muted truncate mt-0.5">
            {item.description}
          </p>
        )}
      </div>

      {/* Tags */}
      <div className="hidden md:flex items-center gap-1 flex-shrink-0 max-w-[200px]">
        {item.tags.slice(0, 2).map(tag => (
          <Badge
            key={tag.id}
            variant="default"
            size="sm"
            style={{ 
              backgroundColor: `${tag.color}15`,
              color: tag.color,
            }}
          >
            {tag.name}
          </Badge>
        ))}
        {item.tags.length > 2 && (
          <span className="text-xs text-muted">+{item.tags.length - 2}</span>
        )}
      </div>

      {/* Category / Project */}
      <div className="hidden lg:block w-24 flex-shrink-0">
        <span className="text-sm text-muted truncate block">
          {item.category || item.project || '-'}
        </span>
      </div>

      {/* Size */}
      <div className="hidden sm:block w-20 text-right flex-shrink-0">
        <span className="text-sm text-muted">
          {item.type === 'file' ? formatSize(item.size) : '-'}
        </span>
      </div>

      {/* Date */}
      <div className="w-24 text-right flex-shrink-0">
        <span className="text-sm text-muted">
          {formatDate(item.updatedAt)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Tooltip content={item.isPinned ? 'Unpin' : 'Pin'}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin?.(item);
            }}
            className={classNames(
              'p-1.5 rounded-md transition-colors',
              item.isPinned 
                ? 'text-primary bg-primary/10' 
                : 'text-muted hover:text-text hover:bg-gray-100'
            )}
          >
            <Pin className="w-4 h-4" />
          </button>
        </Tooltip>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenu?.(item, e);
          }}
          className="p-1.5 rounded-md text-muted hover:text-text hover:bg-gray-100 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
