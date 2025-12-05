import React from 'react';
import { classNames } from '@/utils/classNames';
import { Select, Tooltip } from '@/components/common';
import { 
  ChevronRight, 
  Home, 
  Image, 
  Video, 
  FileText, 
  File,
  LayoutGrid,
  List,
  ArrowUpDown,
  Upload,
} from 'lucide-react';
import type { ViewMode } from '@/types/domain';

export type FileType = 'all' | 'image' | 'video' | 'document' | 'other';

const fileTypeOptions: { value: FileType; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All Files', icon: <File className="w-4 h-4" /> },
  { value: 'image', label: 'Images', icon: <Image className="w-4 h-4" /> },
  { value: 'video', label: 'Videos', icon: <Video className="w-4 h-4" /> },
  { value: 'document', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
  { value: 'other', label: 'Others', icon: <File className="w-4 h-4" /> },
];

const sortOptions = [
  { value: 'created_desc', label: 'Newest First' },
  { value: 'created_asc', label: 'Oldest First' },
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
  { value: 'size_desc', label: 'Largest First' },
  { value: 'size_asc', label: 'Smallest First' },
];

interface FilesToolbarProps {
  currentType: FileType;
  onTypeChange: (type: FileType) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onUpload?: () => void;
  totalFiles?: number;
}

export const FilesToolbar: React.FC<FilesToolbarProps> = ({
  currentType,
  onTypeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onUpload,
  totalFiles,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm">
        <button className="flex items-center gap-1 text-muted hover:text-primary transition-colors">
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-4 h-4 text-muted" />
        <span className="text-text font-medium">Files</span>
        {currentType !== 'all' && (
          <>
            <ChevronRight className="w-4 h-4 text-muted" />
            <span className="text-text font-medium capitalize">{currentType}s</span>
          </>
        )}
      </div>

      {/* Toolbar row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* File type tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          {fileTypeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onTypeChange(option.value)}
              className={classNames(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                currentType === option.value
                  ? 'bg-white shadow-sm text-primary'
                  : 'text-muted hover:text-text'
              )}
            >
              {option.icon}
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Sort dropdown */}
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          options={sortOptions}
          leftIcon={<ArrowUpDown className="w-4 h-4" />}
          className="min-w-[140px]"
        />

        {/* View mode toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
          <Tooltip content="Grid view">
            <button
              onClick={() => onViewModeChange('grid')}
              className={classNames(
                'p-1.5 rounded-md transition-colors',
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-primary'
                  : 'text-muted hover:text-text'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="List view">
            <button
              onClick={() => onViewModeChange('list')}
              className={classNames(
                'p-1.5 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-primary'
                  : 'text-muted hover:text-text'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Upload button */}
        {onUpload && (
          <button
            onClick={onUpload}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
        )}
      </div>

      {/* File count */}
      {totalFiles !== undefined && (
        <p className="text-sm text-muted">
          {totalFiles} file{totalFiles !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};
