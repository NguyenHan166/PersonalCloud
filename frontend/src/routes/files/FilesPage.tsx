import { useState, useMemo } from 'react';
import { FileCard, FileListItem, FilePreviewModal, StorageBar, FilesToolbar, FileType } from '@/components/files';
import { EmptyState } from '@/components/common';
import { FileText } from 'lucide-react';
import { mockFiles } from '@/api/mockData';
import type { FileMeta, ViewMode } from '@/types/domain';

export const FilesPage = () => {
  const [fileType, setFileType] = useState<FileType>('all');
  const [sortBy, setSortBy] = useState('created_desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [previewFile, setPreviewFile] = useState<FileMeta | null>(null);

  // Filter files by type
  const filteredFiles = useMemo(() => {
    let files = [...mockFiles];

    // Filter by type
    if (fileType !== 'all') {
      files = files.filter(file => {
        const mime = file.mimeType?.toLowerCase() || '';
        switch (fileType) {
          case 'image':
            return mime.startsWith('image/');
          case 'video':
            return mime.startsWith('video/');
          case 'document':
            return mime.includes('pdf') || mime.includes('word') || mime.includes('document') || 
                   mime.includes('spreadsheet') || mime.includes('text');
          case 'other':
            return !mime.startsWith('image/') && !mime.startsWith('video/') && 
                   !mime.includes('pdf') && !mime.includes('document');
          default:
            return true;
        }
      });
    }

    // Sort
    files.sort((a, b) => {
      switch (sortBy) {
        case 'created_desc':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'created_asc':
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        case 'name_asc':
          return a.filename.localeCompare(b.filename);
        case 'name_desc':
          return b.filename.localeCompare(a.filename);
        case 'size_desc':
          return b.size - a.size;
        case 'size_asc':
          return a.size - b.size;
        default:
          return 0;
      }
    });

    return files;
  }, [fileType, sortBy]);

  // Calculate storage usage
  const totalUsed = mockFiles.reduce((sum, f) => sum + f.size, 0);
  const quota = 5 * 1024 * 1024 * 1024; // 5 GB

  const handleFileClick = (file: FileMeta) => {
    setPreviewFile(file);
  };

  const handleDownload = (file: FileMeta) => {
    console.log('Download:', file.filename);
    // In real app: window.open(file.url, '_blank');
  };

  const handleUpload = () => {
    console.log('Open upload dialog');
    // TODO: Open file upload modal
  };

  const handlePin = (file: FileMeta) => {
    console.log('Toggle pin:', file.filename);
  };

  const handleEdit = (file: FileMeta) => {
    console.log('Edit:', file.filename);
  };

  const handleDelete = (file: FileMeta) => {
    console.log('Delete:', file.filename);
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Files</h1>
        <p className="text-muted mt-1">Your personal cloud storage</p>
      </div>

      {/* Storage bar */}
      <StorageBar 
        usedBytes={totalUsed} 
        quotaBytes={quota} 
        className="mb-6"
      />

      {/* Toolbar */}
      <FilesToolbar
        currentType={fileType}
        onTypeChange={setFileType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onUpload={handleUpload}
        totalFiles={filteredFiles.length}
      />

      {/* File grid/list */}
      {filteredFiles.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-full h-full" />}
          title="No files found"
          description={fileType === 'all' 
            ? "Upload files to store them securely in your personal cloud."
            : `No ${fileType}s found. Try a different filter.`}
          action={{
            label: 'Upload File',
            onClick: handleUpload,
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFiles.map(file => (
            <FileCard
              key={file.id}
              file={file}
              onClick={handleFileClick}
              onDownload={handleDownload}
              onPin={handlePin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map(file => (
            <FileListItem
              key={file.id}
              file={file}
              onClick={handleFileClick}
              onDownload={handleDownload}
              onPin={handlePin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Preview modal */}
      <FilePreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={handleDownload}
      />
    </div>
  );
};
