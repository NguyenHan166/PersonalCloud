import React from 'react';
import { classNames } from '@/utils/classNames';
import { IconButton, Badge, Tooltip } from '@/components/common';
import { File, FileText, Image, Video, Music, Archive, FileSpreadsheet, Download, Eye, Pin, Edit3, Trash2 } from 'lucide-react';
import type { FileMeta } from '@/types/domain';

// Get file icon based on mime type
const getFileIcon = (mimeType?: string) => {
  if (!mimeType) return File;
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return Video;
  if (mimeType.startsWith('audio/')) return Music;
  if (mimeType.includes('pdf')) return FileText;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return FileSpreadsheet;
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return Archive;
  return File;
};

// Get file type badge
const getFileTypeBadge = (mimeType?: string): { label: string; color: string } => {
  if (!mimeType) return { label: 'File', color: '#6B7280' };
  if (mimeType.startsWith('image/')) return { label: 'Image', color: '#8B5CF6' };
  if (mimeType.startsWith('video/')) return { label: 'Video', color: '#EC4899' };
  if (mimeType.startsWith('audio/')) return { label: 'Audio', color: '#10B981' };
  if (mimeType.includes('pdf')) return { label: 'PDF', color: '#EF4444' };
  if (mimeType.includes('word') || mimeType.includes('document')) return { label: 'DOC', color: '#3B82F6' };
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return { label: 'XLS', color: '#22C55E' };
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return { label: 'PPT', color: '#F97316' };
  return { label: 'File', color: '#6B7280' };
};

// Format file size
const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

// Format date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

interface FileListItemProps {
  file: FileMeta;
  isPinned?: boolean;
  onClick?: (file: FileMeta) => void;
  onDownload?: (file: FileMeta) => void;
  onPin?: (file: FileMeta) => void;
  onEdit?: (file: FileMeta) => void;
  onDelete?: (file: FileMeta) => void;
}

export const FileListItem: React.FC<FileListItemProps> = ({
  file,
  isPinned = false,
  onClick,
  onDownload,
  onPin,
  onEdit,
  onDelete,
}) => {
  const FileIcon = getFileIcon(file.mimeType);
  const typeBadge = getFileTypeBadge(file.mimeType);
  const isImage = file.mimeType?.startsWith('image/');

  return (
    <div
      onClick={() => onClick?.(file)}
      className={classNames(
        'group flex items-center gap-4 bg-surface rounded-lg border border-border p-4',
        'cursor-pointer hover:shadow-sm hover:border-primary/30',
        'transition-all duration-200',
        isPinned && 'ring-2 ring-primary/20'
      )}
    >
      {/* Thumbnail / Icon */}
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
        {isImage && file.url ? (
          <img
            src={file.url}
            alt={file.filename}
            className="w-full h-full object-cover"
          />
        ) : (
          <FileIcon className="w-6 h-6" style={{ color: typeBadge.color }} />
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-text truncate">{file.filename}</h3>
          {isPinned && <Pin className="w-3.5 h-3.5 text-primary fill-primary flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge
            variant="default"
            size="sm"
            style={{
              backgroundColor: `${typeBadge.color}15`,
              color: typeBadge.color,
              borderColor: `${typeBadge.color}30`,
            }}
          >
            {typeBadge.label}
          </Badge>
          <span className="text-xs text-muted">{formatSize(file.size)}</span>
        </div>
      </div>

      {/* Date - hidden on mobile */}
      <span className="text-sm text-muted hidden md:block">
        {formatDate(file.uploadedAt)}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Tooltip content="Preview">
          <IconButton
            aria-label="Preview"
            icon={<Eye className="w-full h-full" />}
            size="sm"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); onClick?.(file); }}
          />
        </Tooltip>
        <Tooltip content="Download">
          <IconButton
            aria-label="Download"
            icon={<Download className="w-full h-full" />}
            size="sm"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); onDownload?.(file); }}
          />
        </Tooltip>
        <Tooltip content={isPinned ? 'Unpin' : 'Pin'}>
          <IconButton
            aria-label={isPinned ? 'Unpin' : 'Pin'}
            icon={<Pin className={classNames('w-full h-full', isPinned && 'fill-current text-primary')} />}
            size="sm"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); onPin?.(file); }}
          />
        </Tooltip>
        <IconButton
          aria-label="Edit"
          icon={<Edit3 className="w-full h-full" />}
          size="sm"
          variant="ghost"
          onClick={(e) => { e.stopPropagation(); onEdit?.(file); }}
        />
        <IconButton
          aria-label="Delete"
          icon={<Trash2 className="w-full h-full" />}
          size="sm"
          variant="ghost"
          className="text-red-500 hover:bg-red-50"
          onClick={(e) => { e.stopPropagation(); onDelete?.(file); }}
        />
      </div>
    </div>
  );
};
