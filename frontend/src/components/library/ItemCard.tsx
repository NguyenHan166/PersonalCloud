import React from 'react';
import { classNames } from '@/utils/classNames';
import { Badge, Tooltip } from '@/components/common';
import { FileText, Image, Video, Link, StickyNote, Pin, Star, MoreHorizontal } from 'lucide-react';
import type { Item } from '@/types/domain';

// File type icon mapping
const getTypeIcon = (item: Item) => {
  if (item.type === 'link') return Link;
  if (item.type === 'note') return StickyNote;
  // File type
  if (item.mimeType?.startsWith('image/')) return Image;
  if (item.mimeType?.startsWith('video/')) return Video;
  return FileText;
};

// File type color mapping
const getTypeColor = (item: Item) => {
  if (item.type === 'link') return 'text-blue-500 bg-blue-50';
  if (item.type === 'note') return 'text-amber-500 bg-amber-50';
  if (item.mimeType?.startsWith('image/')) return 'text-purple-500 bg-purple-50';
  if (item.mimeType?.startsWith('video/')) return 'text-pink-500 bg-pink-50';
  return 'text-gray-500 bg-gray-50';
};

// Format file size
const formatSize = (bytes?: number) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

// Format relative time
const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

interface ItemCardProps {
  item: Item;
  onClick?: (item: Item) => void;
  onPin?: (item: Item) => void;
  onMenu?: (item: Item, e: React.MouseEvent) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
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
        'group relative bg-surface rounded-xl border border-border',
        'p-4 cursor-pointer',
        'hover:shadow-md hover:border-primary/30',
        'transition-all duration-200'
      )}
    >
      {/* Pin indicator */}
      {item.isPinned && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
          <Pin className="w-3 h-3 text-white fill-white" />
        </div>
      )}

      {/* Thumbnail or type icon */}
      <div className="mb-3">
        {item.thumbnailUrl ? (
          <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className={classNames(
              'absolute bottom-2 left-2 p-1.5 rounded-md',
              typeColor
            )}>
              <TypeIcon className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <div className={classNames(
            'h-20 rounded-lg flex items-center justify-center',
            typeColor
          )}>
            <TypeIcon className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-medium text-text line-clamp-2 mb-1">
        {item.title}
      </h3>

      {/* Description */}
      {item.description && (
        <p className="text-sm text-muted line-clamp-2 mb-2">
          {item.description}
        </p>
      )}

      {/* Meta info */}
      <div className="flex items-center gap-2 text-xs text-muted mb-2">
        {item.domain && (
          <span className="truncate max-w-[120px]">{item.domain}</span>
        )}
        {item.size && (
          <span>{formatSize(item.size)}</span>
        )}
        <span>{formatRelativeTime(item.updatedAt)}</span>
      </div>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map(tag => (
            <Badge
              key={tag.id}
              variant="default"
              size="sm"
              style={{ 
                backgroundColor: `${tag.color}15`,
                color: tag.color,
                borderColor: `${tag.color}30`
              }}
            >
              {tag.name}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge variant="default" size="sm">
              +{item.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Importance indicator */}
      {item.importance === 'high' && (
        <div className="absolute top-3 left-3">
          <Tooltip content="High importance">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </Tooltip>
        </div>
      )}

      {/* Action buttons (visible on hover) */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPin?.(item);
          }}
          className={classNames(
            'p-1.5 rounded-md transition-colors',
            item.isPinned 
              ? 'bg-primary/10 text-primary' 
              : 'bg-white/90 text-muted hover:text-text hover:bg-white'
          )}
        >
          <Pin className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenu?.(item, e);
          }}
          className="p-1.5 rounded-md bg-white/90 text-muted hover:text-text hover:bg-white transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
