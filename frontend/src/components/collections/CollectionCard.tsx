import React from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '@/utils/classNames';
import { Folder, Globe, Lock, MoreHorizontal, ExternalLink } from 'lucide-react';
import { Badge, Tooltip } from '@/components/common';
import type { Collection } from '@/types/domain';

interface CollectionCardProps {
  collection: Collection;
  onClick?: (collection: Collection) => void;
  onMenu?: (collection: Collection, e: React.MouseEvent) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onClick,
  onMenu,
}) => {
  return (
    <div
      onClick={() => onClick?.(collection)}
      className={classNames(
        'group relative bg-surface rounded-xl border border-border',
        'cursor-pointer overflow-hidden',
        'hover:shadow-md hover:border-primary/30',
        'transition-all duration-200'
      )}
    >
      {/* Cover image or gradient */}
      <div className="relative h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
        {collection.coverImage ? (
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Folder className="w-16 h-16 text-primary/40" />
        )}

        {/* Public/Private badge */}
        <div className="absolute top-3 right-3">
          <Tooltip content={collection.isPublic ? 'Public Collection' : 'Private Collection'}>
            <div
              className={classNames(
                'p-1.5 rounded-full',
                collection.isPublic
                  ? 'bg-green-100/90 text-green-600'
                  : 'bg-gray-100/90 text-gray-600'
              )}
            >
              {collection.isPublic ? (
                <Globe className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </div>
          </Tooltip>
        </div>

        {/* Menu button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenu?.(collection, e);
          }}
          className="absolute top-3 left-3 p-1.5 rounded-md bg-white/80 text-muted opacity-0 group-hover:opacity-100 hover:bg-white hover:text-text transition-all"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {/* View public link */}
        {collection.isPublic && collection.slugPublic && (
          <Link
            to={`/public/${collection.slugPublic}`}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 text-xs font-medium bg-white/90 text-primary rounded-md opacity-0 group-hover:opacity-100 hover:bg-white transition-all"
          >
            <ExternalLink className="w-3 h-3" />
            View Public
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-text truncate" title={collection.name}>
          {collection.name}
        </h3>
        {collection.description && (
          <p className="text-sm text-muted mt-1 line-clamp-2">
            {collection.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="default" size="sm">
            {collection.itemCount} item{collection.itemCount !== 1 ? 's' : ''}
          </Badge>
          {collection.isPublic && collection.slugPublic && (
            <Badge variant="success" size="sm">
              /{collection.slugPublic}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
