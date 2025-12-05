import React from 'react';
import { classNames } from '@/utils/classNames';
import { Button, IconButton } from '@/components/common';
import { X, Download, FileText, Image, Video, Music, File } from 'lucide-react';
import type { FileMeta } from '@/types/domain';

interface FilePreviewModalProps {
  file: FileMeta | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (file: FileMeta) => void;
}

const formatSize = (bytes: number) => {
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
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  isOpen,
  onClose,
  onDownload,
}) => {
  if (!file) return null;

  const isImage = file.mimeType?.startsWith('image/');
  const isVideo = file.mimeType?.startsWith('video/');
  const isAudio = file.mimeType?.startsWith('audio/');
  const isPdf = file.mimeType?.includes('pdf');

  // Get icon for other file types
  const getFileIcon = () => {
    if (isImage) return Image;
    if (isVideo) return Video;
    if (isAudio) return Music;
    if (isPdf) return FileText;
    return File;
  };

  const FileIcon = getFileIcon();

  return (
    <>
      {/* Backdrop */}
      <div
        className={classNames(
          'fixed inset-0 bg-black/80 z-50',
          'transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={classNames(
          'fixed inset-4 md:inset-8 lg:inset-16 z-50',
          'bg-surface rounded-2xl shadow-2xl overflow-hidden',
          'flex flex-col',
          'transition-all duration-300',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <FileIcon className="w-5 h-5 text-muted flex-shrink-0" />
            <h2 className="font-medium text-text truncate">{file.filename}</h2>
            <span className="text-sm text-muted flex-shrink-0">
              {formatSize(file.size)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => onDownload?.(file)}
            >
              Download
            </Button>
            <IconButton
              aria-label="Close"
              icon={<X className="w-full h-full" />}
              onClick={onClose}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-gray-900">
          {isImage && file.url ? (
            <img
              src={file.url}
              alt={file.filename}
              className="max-w-full max-h-full object-contain rounded"
            />
          ) : isVideo && file.url ? (
            <video
              src={file.url}
              controls
              autoPlay
              className="max-w-full max-h-full rounded"
            />
          ) : isAudio && file.url ? (
            <div className="flex flex-col items-center gap-6 p-8 bg-surface rounded-xl">
              <Music className="w-24 h-24 text-primary" />
              <audio src={file.url} controls autoPlay className="w-full max-w-md" />
            </div>
          ) : isPdf && file.url ? (
            <iframe
              src={file.url}
              title={file.filename}
              className="w-full h-full rounded bg-white"
            />
          ) : (
            // Generic file info
            <div className="flex flex-col items-center gap-6 p-8 bg-surface rounded-xl max-w-md text-center">
              <File className="w-24 h-24 text-muted" />
              <div>
                <h3 className="text-xl font-semibold text-text mb-2">{file.filename}</h3>
                <p className="text-muted mb-4">
                  This file type cannot be previewed in the browser.
                </p>
                <div className="text-sm text-muted space-y-1">
                  <p>Size: {formatSize(file.size)}</p>
                  <p>Type: {file.mimeType || 'Unknown'}</p>
                  <p>Uploaded: {formatDate(file.uploadedAt)}</p>
                </div>
              </div>
              <Button
                variant="primary"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() => onDownload?.(file)}
              >
                Download File
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
