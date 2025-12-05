import React from 'react';
import { classNames } from '@/utils/classNames';
import { HardDrive } from 'lucide-react';

interface StorageBarProps {
  usedBytes: number;
  quotaBytes: number;
  className?: string;
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const StorageBar: React.FC<StorageBarProps> = ({
  usedBytes,
  quotaBytes,
  className,
}) => {
  const percentage = Math.min((usedBytes / quotaBytes) * 100, 100);
  const isWarning = percentage >= 80;
  const isCritical = percentage >= 95;

  return (
    <div className={classNames('p-4 bg-surface rounded-xl border border-border', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-muted" />
          <span className="text-sm font-medium text-text">Storage</span>
        </div>
        <span className="text-sm text-muted">
          {formatBytes(usedBytes)} of {formatBytes(quotaBytes)} used
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={classNames(
            'h-full rounded-full transition-all duration-500',
            isCritical
              ? 'bg-red-500'
              : isWarning
              ? 'bg-amber-500'
              : 'bg-primary'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Breakdown by type (optional) */}
      <div className="flex items-center gap-4 mt-3 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span>Images</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-pink-500" />
          <span>Videos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Documents</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-400" />
          <span>Others</span>
        </div>
      </div>
    </div>
  );
};
