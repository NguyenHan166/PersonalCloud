import React, { useState, useMemo } from 'react';
import { X, Search, FileText, Link, StickyNote, Image, Video, Check } from 'lucide-react';
import { Button, IconButton, Input, Badge } from '@/components/common';
import { mockItems } from '@/api/mockData';
import type { Item } from '@/types/domain';
import { classNames } from '@/utils/classNames';

interface ItemPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (itemIds: string[]) => void;
  excludeItemIds?: string[]; // Items already in collection
  title?: string;
}

// File type icon mapping
const getTypeIcon = (item: Item) => {
  if (item.type === 'link') return Link;
  if (item.type === 'note') return StickyNote;
  if (item.mimeType?.startsWith('image/')) return Image;
  if (item.mimeType?.startsWith('video/')) return Video;
  return FileText;
};

// File type color mapping
const getTypeColor = (item: Item) => {
  if (item.type === 'link') return 'text-blue-500 bg-blue-50';
  if (item.type === 'note') return 'text-amber-500 bg-amber-50';
  if (item.mimeType?.startsWith('image/')) return 'text-purple-500 bg-purple-50';
  if (item.mimeType?.startsWith('video/')) return 'text-pink-500 bg-pink-50';
  return 'text-gray-500 bg-gray-50';
};

export const ItemPickerModal: React.FC<ItemPickerModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  excludeItemIds = [],
  title = 'Add Items to Collection',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<'all' | 'file' | 'link' | 'note'>('all');

  // Filter available items
  const filteredItems = useMemo(() => {
    return mockItems
      .filter(item => !excludeItemIds.includes(item.id))
      .filter(item => {
        if (typeFilter !== 'all' && item.type !== typeFilter) return false;
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.tags.some(t => t.name.toLowerCase().includes(query))
        );
      });
  }, [searchQuery, typeFilter, excludeItemIds]);

  const toggleSelect = (itemId: string) => {
    setSelectedIds(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAdd = () => {
    if (selectedIds.length > 0) {
      onAdd(selectedIds);
      setSelectedIds([]);
      setSearchQuery('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedIds([]);
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-x-auto md:inset-y-8 md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-50 bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-text">{title}</h2>
          <IconButton
            aria-label="Close"
            icon={<X className="w-full h-full" />}
            onClick={handleClose}
          />
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-border space-y-3">
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <div className="flex gap-2">
            {(['all', 'file', 'link', 'note'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={classNames(
                  'px-3 py-1 text-sm rounded-full border transition-colors capitalize',
                  typeFilter === type
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-muted border-border hover:border-gray-300'
                )}
              >
                {type === 'all' ? 'All' : `${type}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted">
                {searchQuery ? 'No items match your search' : 'No items available to add'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map(item => {
                const TypeIcon = getTypeIcon(item);
                const typeColor = getTypeColor(item);
                const isSelected = selectedIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={classNames(
                      'w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    {/* Type Icon */}
                    <div className={classNames('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', typeColor)}>
                      <TypeIcon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-text truncate">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-muted truncate">{item.description}</p>
                      )}
                      {item.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {item.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag.id}
                              className="px-1.5 py-0.5 text-xs rounded"
                              style={{
                                backgroundColor: `${tag.color}15`,
                                color: tag.color,
                              }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Checkbox */}
                    <div className={classNames(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300'
                    )}>
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gray-50">
          <span className="text-sm text-muted">
            {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={selectedIds.length === 0}
            >
              Add to Collection
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
