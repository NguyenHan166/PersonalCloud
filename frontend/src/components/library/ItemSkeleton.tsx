import React from 'react';
import { classNames } from '@/utils/classNames';

interface ItemCardSkeletonProps {
  count?: number;
}

export const ItemCardSkeleton: React.FC<ItemCardSkeletonProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface rounded-xl border border-border p-4 animate-pulse"
        >
          {/* Thumbnail skeleton */}
          <div className="h-20 rounded-lg bg-gray-100 mb-3" />
          
          {/* Title skeleton */}
          <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
          
          {/* Description skeleton */}
          <div className="space-y-1.5 mb-2">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
          
          {/* Meta skeleton */}
          <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
          
          {/* Tags skeleton */}
          <div className="flex gap-1">
            <div className="h-5 bg-gray-100 rounded-full w-16" />
            <div className="h-5 bg-gray-100 rounded-full w-14" />
          </div>
        </div>
      ))}
    </>
  );
};

export const ItemListRowSkeleton: React.FC<ItemCardSkeletonProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3 bg-surface border-b border-border animate-pulse"
        >
          {/* Icon skeleton */}
          <div className="w-5 h-5 bg-gray-100 rounded flex-shrink-0" />
          
          {/* Title skeleton */}
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-1" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
          
          {/* Tags skeleton */}
          <div className="hidden md:flex gap-1 flex-shrink-0">
            <div className="h-5 bg-gray-100 rounded-full w-14" />
            <div className="h-5 bg-gray-100 rounded-full w-12" />
          </div>
          
          {/* Category skeleton */}
          <div className="hidden lg:block w-24 flex-shrink-0">
            <div className="h-3 bg-gray-100 rounded w-16" />
          </div>
          
          {/* Size skeleton */}
          <div className="hidden sm:block w-20 flex-shrink-0">
            <div className="h-3 bg-gray-100 rounded w-12 ml-auto" />
          </div>
          
          {/* Date skeleton */}
          <div className="w-24 flex-shrink-0">
            <div className="h-3 bg-gray-100 rounded w-16 ml-auto" />
          </div>
        </div>
      ))}
    </>
  );
};
