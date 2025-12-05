import { useState, useCallback, useRef, useEffect } from 'react';
import { classNames } from '@/utils/classNames';
import { Button, IconButton, Input } from '@/components/common';
import {
  X,
  Upload,
  File,
  Image,
  Video,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { mockTags } from '@/api/mockData';

interface UploadFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  previewUrl?: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (files: UploadFile[]) => void;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return Video;
  if (type.includes('pdf')) return FileText;
  return File;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [project, setProject] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.previewUrl) {
          URL.revokeObjectURL(f.previewUrl);
        }
      });
    };
  }, []);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const uploadFiles: UploadFile[] = fileArray.map((file) => {
      // Create preview URL for images
      const previewUrl = file.type.startsWith('image/') 
        ? URL.createObjectURL(file) 
        : undefined;
      
      return {
        file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        status: 'pending' as const,
        progress: 0,
        previewUrl,
      };
    });
    setFiles((prev) => [...prev, ...uploadFiles]);
  }, []);

  const removeFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file?.previewUrl) {
      URL.revokeObjectURL(file.previewUrl);
    }
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  const simulateUpload = async () => {
    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.status !== 'pending') continue;

      // Update status to uploading
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: 'uploading' as const } : f
        )
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((r) => setTimeout(r, 100));
        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, progress } : f))
        );
      }

      // Success
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: 'success' as const, progress: 100 } : f
        )
      );
    }

    setIsUploading(false);
    onUploadComplete?.(files);
  };

  const handleClose = () => {
    if (!isUploading) {
      // Cleanup preview URLs
      files.forEach(f => {
        if (f.previewUrl) {
          URL.revokeObjectURL(f.previewUrl);
        }
      });
      setFiles([]);
      setSelectedTags([]);
      setCategory('');
      setProject('');
      onClose();
    }
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const successCount = files.filter((f) => f.status === 'success').length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 lg:inset-y-16 lg:inset-x-[20%] z-50 bg-surface rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-text">Upload Files</h2>
          <IconButton
            aria-label="Close"
            icon={<X className="w-full h-full" />}
            onClick={handleClose}
            disabled={isUploading}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={classNames(
              'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-gray-50'
            )}
          >
            <Upload className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-lg font-medium text-text mb-1">
              Drag and drop files here
            </p>
            <p className="text-sm text-muted mb-4">
              or click to browse from your computer
            </p>
            <Button variant="secondary" size="sm">
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-text mb-3">
                Selected Files ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map((uploadFile) => {
                  const FileIcon = getFileIcon(uploadFile.file.type);
                  const isImage = uploadFile.file.type.startsWith('image/');
                  
                  return (
                    <div
                      key={uploadFile.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      {/* Preview or Icon */}
                      {isImage && uploadFile.previewUrl ? (
                        <img 
                          src={uploadFile.previewUrl} 
                          alt={uploadFile.file.name}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <FileIcon className="w-10 h-10 text-muted flex-shrink-0" />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">
                          {uploadFile.file.name}
                        </p>
                        <p className="text-xs text-muted">
                          {formatSize(uploadFile.file.size)}
                        </p>
                        {uploadFile.status === 'uploading' && (
                          <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-200"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {uploadFile.status === 'pending' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(uploadFile.id);
                            }}
                            className="p-1 text-muted hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        {uploadFile.status === 'uploading' && (
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        )}
                        {uploadFile.status === 'success' && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {uploadFile.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Metadata (optional) */}
          {files.length > 0 && pendingCount > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-medium text-text mb-3">
                Optional Metadata (applies to all files)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1">Category</label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Work, Personal"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1">Project</label>
                  <Input
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder="e.g., Cloud Platform"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm text-muted mb-1">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {mockTags.slice(0, 6).map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => {
                        setSelectedTags((prev) =>
                          prev.includes(tag.id)
                            ? prev.filter((id) => id !== tag.id)
                            : [...prev, tag.id]
                        );
                      }}
                      className={classNames(
                        'px-3 py-1 text-sm rounded-full border transition-colors',
                        selectedTags.includes(tag.id)
                          ? 'bg-primary/10 text-primary border-primary/30'
                          : 'bg-white text-muted border-border hover:border-primary/30'
                      )}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gray-50">
          <div className="text-sm text-muted">
            {successCount > 0 && (
              <span className="text-green-600">
                {successCount} file{successCount > 1 ? 's' : ''} uploaded
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              onClick={simulateUpload}
              disabled={pendingCount === 0 || isUploading}
              loading={isUploading}
            >
              Upload {pendingCount > 0 ? `(${pendingCount})` : ''}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
