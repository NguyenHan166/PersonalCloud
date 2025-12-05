import React, { useState } from 'react';
import { classNames } from '@/utils/classNames';
import { Button, Input, Badge, Dropdown, Tooltip, IconButton } from '@/components/common';
import { 
  Search, 
  LayoutGrid, 
  List, 
  SlidersHorizontal,
  X,
  FileText,
  Link,
  StickyNote,
  ArrowUpDown,
  Clock,
  SortAsc,
  SortDesc,
  Calendar,
} from 'lucide-react';
import type { Tag, ItemType, ViewMode, SortField, SortOrder } from '@/types/domain';

// Sort options with icons
const sortOptions = [
  { value: 'updatedAt-desc', label: 'Mới cập nhật', icon: <Clock className="w-4 h-4" />, description: 'Sắp xếp theo thời gian cập nhật' },
  { value: 'updatedAt-asc', label: 'Cũ nhất', icon: <Clock className="w-4 h-4" />, description: 'Cập nhật cũ nhất trước' },
  { value: 'createdAt-desc', label: 'Mới tạo', icon: <Calendar className="w-4 h-4" />, description: 'Tạo mới nhất trước' },
  { value: 'title-asc', label: 'Tên A-Z', icon: <SortAsc className="w-4 h-4" />, description: 'Sắp xếp theo alphabet' },
  { value: 'title-desc', label: 'Tên Z-A', icon: <SortDesc className="w-4 h-4" />, description: 'Sắp xếp ngược alphabet' },
];

// Type filter options
const typeOptions: { value: ItemType | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All Types', icon: null },
  { value: 'file', label: 'Files', icon: <FileText className="w-4 h-4" /> },
  { value: 'link', label: 'Links', icon: <Link className="w-4 h-4" /> },
  { value: 'note', label: 'Notes', icon: <StickyNote className="w-4 h-4" /> },
];

export interface LibraryFilters {
  search: string;
  type: ItemType | 'all';
  tags: string[];
  category: string;
  project: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

interface LibraryToolbarProps {
  filters: LibraryFilters;
  onFiltersChange: (filters: LibraryFilters) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  availableTags?: Tag[];
  availableCategories?: string[];
  availableProjects?: string[];
  totalItems?: number;
}

export const LibraryToolbar: React.FC<LibraryToolbarProps> = ({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  availableTags = [],
  availableCategories = [],
  availableProjects = [],
  totalItems,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = <K extends keyof LibraryFilters>(key: K, value: LibraryFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [SortField, SortOrder];
    onFiltersChange({ ...filters, sortBy, sortOrder });
  };

  const toggleTag = (tagId: string) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter(t => t !== tagId)
      : [...filters.tags, tagId];
    updateFilter('tags', newTags);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      type: 'all',
      tags: [],
      category: '',
      project: '',
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = 
    filters.type !== 'all' || 
    filters.tags.length > 0 || 
    filters.category || 
    filters.project;

  return (
    <div className="space-y-3 mb-6">
      {/* Main toolbar row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[200px] max-w-md">
          <Input
            placeholder="Search by title, tags, content..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={filters.search ? (
              <button onClick={() => updateFilter('search', '')} className="text-muted hover:text-text">
                <X className="w-4 h-4" />
              </button>
            ) : undefined}
          />
        </div>

        {/* Type filter chips */}
        <div className="hidden sm:flex items-center gap-1">
          {typeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => updateFilter('type', option.value)}
              className={classNames(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                filters.type === option.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              )}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>

        {/* Mobile type select */}
        <div className="sm:hidden">
          <Dropdown
            value={filters.type}
            onChange={(v) => updateFilter('type', v as ItemType | 'all')}
            options={typeOptions.map(o => ({ value: o.value, label: o.label, icon: o.icon }))}
            buttonClassName="min-w-[110px]"
          />
        </div>

        {/* Filter toggle */}
        <Tooltip content="Bộ lọc">
          <IconButton
            aria-label="Toggle filters"
            icon={<SlidersHorizontal className="w-full h-full" />}
            onClick={() => setShowFilters(!showFilters)}
            variant={hasActiveFilters ? 'default' : 'ghost'}
            className={hasActiveFilters ? 'text-primary' : ''}
          />
        </Tooltip>

        {/* Sort dropdown - shown on all screen sizes */}
        <Dropdown
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={handleSortChange}
          options={sortOptions}
          leftIcon={<ArrowUpDown className="w-4 h-4" />}
          buttonClassName="min-w-[140px] md:min-w-[160px]"
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
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-xl animate-fade-in">
          {/* Tags */}
          {availableTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted">Tags:</span>
              {availableTags.slice(0, 6).map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={classNames(
                    'px-2 py-0.5 rounded-full text-xs font-medium border transition-colors',
                    filters.tags.includes(tag.id)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-white text-text-secondary hover:border-gray-300'
                  )}
                  style={filters.tags.includes(tag.id) ? {
                    borderColor: tag.color,
                    backgroundColor: `${tag.color}15`,
                    color: tag.color,
                  } : undefined}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}

          {/* Category select */}
          {availableCategories.length > 0 && (
            <Dropdown
              value={filters.category}
              onChange={(v) => updateFilter('category', v)}
              options={[
                { value: '', label: 'Tất cả danh mục' },
                ...availableCategories.map(c => ({ value: c, label: c })),
              ]}
              buttonClassName="min-w-[140px]"
            />
          )}

          {/* Project select */}
          {availableProjects.length > 0 && (
            <Dropdown
              value={filters.project}
              onChange={(v) => updateFilter('project', v)}
              options={[
                { value: '', label: 'Tất cả dự án' },
                ...availableProjects.map(p => ({ value: p, label: p })),
              ]}
              buttonClassName="min-w-[140px]"
            />
          )}

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-3 h-3 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Active filters & item count */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {filters.tags.map(tagId => {
            const tag = availableTags.find(t => t.id === tagId);
            if (!tag) return null;
            return (
              <Badge
                key={tagId}
                variant="default"
                size="sm"
                removable
                onRemove={() => toggleTag(tagId)}
                style={{
                  backgroundColor: `${tag.color}15`,
                  color: tag.color,
                  borderColor: `${tag.color}30`,
                }}
              >
                {tag.name}
              </Badge>
            );
          })}
          {filters.category && (
            <Badge variant="default" size="sm" removable onRemove={() => updateFilter('category', '')}>
              {filters.category}
            </Badge>
          )}
          {filters.project && (
            <Badge variant="default" size="sm" removable onRemove={() => updateFilter('project', '')}>
              {filters.project}
            </Badge>
          )}
        </div>

        {totalItems !== undefined && (
          <span className="text-sm text-muted">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};
