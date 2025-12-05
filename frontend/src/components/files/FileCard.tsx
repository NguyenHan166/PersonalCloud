import React from 'react';
import { classNames } from '@/utils/classNames';
import { Badge, Tooltip } from '@/components/common';
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

interface FileCardProps {
  file: FileMeta;
  isPinned?: boolean;
  onClick?: (file: FileMeta) => void;
  onDownload?: (file: FileMeta) => void;
  onPin?: (file: FileMeta) => void;
  onEdit?: (file: FileMeta) => void;
  onDelete?: (file: FileMeta) => void;
}

export const FileCard: React.FC<FileCardProps> = ({
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
  const isVideo = file.mimeType?.startsWith('video/');

  return (
    <div
      onClick={() => onClick?.(file)}
      className={classNames(
        'group relative bg-surface rounded-xl border border-border',
        'cursor-pointer overflow-hidden',
        'hover:shadow-md hover:border-primary/30',
        'transition-all duration-200',
        isPinned && 'ring-2 ring-primary/20'
      )}
    >
      {/* Thumbnail / Icon area */}
      <div className="relative h-36 bg-gray-50 flex items-center justify-center overflow-hidden">
        {isImage && file.url ? (
          <img
            src={file.url}
            alt={file.filename}
            className="w-full h-full object-cover"
          />
        ) : isVideo && file.url ? (
          <div className="relative w-full h-full">
            <video
              src={file.url}
              className="w-full h-full object-cover"
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-gray-800 ml-1" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <FileIcon className="w-12 h-12 text-muted" />
          </div>
        )}

        {/* Type badge */}
        <Badge
          variant="default"
          size="sm"
          className="absolute top-2 left-2"
          style={{
            backgroundColor: `${typeBadge.color}15`,
            color: typeBadge.color,
            borderColor: `${typeBadge.color}30`,
          }}
        >
          {typeBadge.label}
        </Badge>

        {/* Pin indicator */}
        {isPinned && (
          <div className="absolute top-2 right-2">
            <Pin className="w-4 h-4 text-primary fill-primary" />
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Tooltip content="Preview">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(file);
              }}
              className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-colors"
            >
              <Eye className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip content="Download">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.(file);
              }}
              className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* File info */}
      <div className="p-3">
        <h3 className="font-medium text-sm text-text truncate" title={file.filename}>
          {file.filename}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted">
            {formatSize(file.size)}
          </p>
          {/* Actions */}
          <div className="flex items-center gap-1">
            <Tooltip content={isPinned ? 'Unpin' : 'Pin'}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPin?.(file);
                }}
                className="p-1 rounded hover:bg-gray-100"
              >
                <Pin className={classNames('w-3.5 h-3.5', isPinned && 'fill-current text-primary')} />
              </button>
            </Tooltip>
            <Tooltip content="Edit">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(file);
                }}
                className="p-1 rounded hover:bg-gray-100"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
            <Tooltip content="Delete">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(file);
                }}
                className="p-1 rounded hover:bg-red-50 text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
