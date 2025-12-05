import React, { useState, useEffect, useRef } from 'react';
import { classNames } from '@/utils/classNames';
import { Button, IconButton, Badge, Input, Textarea, Tooltip } from '@/components/common';
import {
  X,
  FileText,
  Image,
  Video,
  Link as LinkIcon,
  StickyNote,
  ExternalLink,
  Download,
  Share2,
  Trash2,
  Star,
  Pin,
  Clock,
  Calendar,
  Sparkles,
  Tag,
  Folder,
  Briefcase,
} from 'lucide-react';
import type { Item, Tag as TagType, Importance } from '@/types/domain';

// Type icon helpers
const getTypeIcon = (item: Item) => {
  if (item.type === 'link') return LinkIcon;
  if (item.type === 'note') return StickyNote;
  if (item.mimeType?.startsWith('image/')) return Image;
  if (item.mimeType?.startsWith('video/')) return Video;
  return FileText;
};

const getTypeLabel = (item: Item) => {
  if (item.type === 'link') return 'Link';
  if (item.type === 'note') return 'Note';
  if (item.mimeType?.startsWith('image/')) return 'Image';
  if (item.mimeType?.startsWith('video/')) return 'Video';
  if (item.mimeType?.includes('pdf')) return 'PDF';
  return 'File';
};

const formatSize = (bytes?: number) => {
  if (!bytes) return '';
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

interface ItemDetailPanelProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (item: Item, updates: Partial<Item>) => void;
  onDelete?: (item: Item) => void;
  onShare?: (item: Item) => void;
  onDownload?: (item: Item) => void;
}

export const ItemDetailPanel: React.FC<ItemDetailPanelProps> = ({
  item,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onShare,
  onDownload,
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Keep the current item in state to allow close animation
  const [displayItem, setDisplayItem] = useState<Item | null>(null);

  // Update display item when opening (not when closing, to allow animation)
  useEffect(() => {
    if (item && isOpen) {
      setDisplayItem(currentItem);
    }
  }, [item, isOpen]);

  // Clear display item after close animation completes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setDisplayItem(null);
        setSuggestedTags([]);
        setAiSummary(null);
      }, 500); // Same as animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset edit state when item changes
  useEffect(() => {
    setEditingField(null);
  }, [item?.id]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Use displayItem for rendering (keeps content during close animation)
  const currentItem = displayItem || item;
  
  // Don't render if no item at all
  if (!currentItem) return null;

  const TypeIcon = getTypeIcon(currentItem);

  // Inline edit handlers
  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const saveEdit = () => {
    if (!editingField || !currentItem) return;
    onUpdate?.(currentItem, { [editingField]: editValue });
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  // AI actions
  const handleGenerateTags = async () => {
    if (!currentItem) return;
    setIsGeneratingTags(true);
    // Mock AI tag generation
    await new Promise(r => setTimeout(r, 1500));
    const suggestions = ['AI-generated', 'Suggested', 'Auto-tag'].filter(
      t => !currentItem.tags.some(tag => tag.name === t)
    );
    setSuggestedTags(suggestions);
    setIsGeneratingTags(false);
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    // Mock AI summarization
    await new Promise(r => setTimeout(r, 2000));
    setAiSummary(
      'This is an AI-generated summary of the content. It provides a brief overview of the main topics and key points discussed in this currentItem.'
    );
    setIsSummarizing(false);
  };

  const handleImportanceChange = (importance: Importance) => {
    if (!currentItem) return;
    onUpdate?.(currentItem, { importance });
  };

  const handleTogglePin = () => {
    if (!currentItem) return;
    onUpdate?.(currentItem, { isPinned: !currentItem.isPinned });
  };

  const addSuggestedTag = (tagName: string) => {
    if (!currentItem) return;
    // Create new tag-like object
    const newTag: TagType = {
      id: `tag-new-${Date.now()}`,
      name: tagName,
      color: '#6366F1',
    };
    onUpdate?.(currentItem, { tags: [...currentItem.tags, newTag] });
    setSuggestedTags(prev => prev.filter(t => t !== tagName));
  };

  const removeTag = (tagId: string) => {
    if (!currentItem) return;
    onUpdate?.(currentItem, { tags: currentItem.tags.filter(t => t.id !== tagId) });
  };

  return (
    <>
      {/* Backdrop - smooth fade */}
      <div
        className={classNames(
          'fixed inset-0 bg-black/30 z-40',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{
          transitionProperty: 'opacity',
          transitionDuration: '500ms',
          transitionTimingFunction: 'ease-in-out',
        }}
        onClick={onClose}
      />

      {/* Panel - smooth slide */}
      <div
        ref={panelRef}
        className={classNames(
          'fixed top-0 right-0 h-full w-full sm:w-[480px] bg-surface z-50',
          'border-l border-border shadow-2xl',
          'flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          transitionProperty: 'transform',
          transitionDuration: '500ms',
          transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Smooth ease
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <TypeIcon className="w-5 h-5 text-muted" />
            <span className="text-sm text-muted">{getTypeLabel(currentItem)}</span>
            {currentItem.size && (
              <span className="text-sm text-muted">• {formatSize(currentItem.size)}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Tooltip content={currentItem.isPinned ? 'Unpin' : 'Pin'}>
              <IconButton
                aria-label="Toggle pin"
                icon={<Pin className={classNames('w-full h-full', currentItem.isPinned && 'fill-current')} />}
                onClick={handleTogglePin}
                variant={currentItem.isPinned ? 'default' : 'ghost'}
                className={currentItem.isPinned ? 'text-primary' : ''}
              />
            </Tooltip>
            <Tooltip content="Close">
              <IconButton
                aria-label="Close panel"
                icon={<X className="w-full h-full" />}
                onClick={onClose}
              />
            </Tooltip>
          </div>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Preview section */}
          <div className="p-4 border-b border-border">
            {currentItem.thumbnailUrl ? (
              <div className="relative rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={currentItem.thumbnailUrl}
                  alt={currentItem.title}
                  className="w-full h-48 object-cover"
                />
              </div>
            ) : currentItem.type === 'link' && currentItem.url ? (
              <a
                href={currentItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LinkIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-blue-600 truncate">{currentItem.url}</span>
                <ExternalLink className="w-4 h-4 text-muted flex-shrink-0" />
              </a>
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                <TypeIcon className="w-12 h-12 text-muted" />
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="p-4 border-b border-border">
            {/* Title */}
            {editingField === 'title' ? (
              <div className="mb-3">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={saveEdit}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                </div>
              </div>
            ) : (
              <h2
                className="text-xl font-semibold text-text cursor-pointer hover:text-primary transition-colors mb-2"
                onClick={() => startEdit('title', currentItem.title)}
                title="Click to edit"
              >
                {currentItem.title}
              </h2>
            )}

            {/* Description */}
            {editingField === 'description' ? (
              <div>
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={saveEdit}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                </div>
              </div>
            ) : (
              <p
                className="text-sm text-muted cursor-pointer hover:text-text transition-colors"
                onClick={() => startEdit('description', currentItem.description || '')}
                title="Click to edit"
              >
                {currentItem.description || 'Click to add description...'}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="p-4 border-b border-border space-y-4">
            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-muted" />
                <span className="text-sm font-medium text-text">Tags</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentItem.tags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant="default"
                    size="sm"
                    removable
                    onRemove={() => removeTag(tag.id)}
                    style={{
                      backgroundColor: `${tag.color}15`,
                      color: tag.color,
                      borderColor: `${tag.color}30`,
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {currentItem.tags.length === 0 && (
                  <span className="text-sm text-muted">No tags</span>
                )}
              </div>
              {/* Suggested tags */}
              {suggestedTags.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border">
                  <span className="text-xs text-muted">Suggested:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {suggestedTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => addSuggestedTag(tag)}
                        className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full hover:bg-primary/20 transition-colors"
                      >
                        <span>+ {tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Folder className="w-4 h-4 text-muted" />
                <span className="text-sm font-medium text-text">Category</span>
              </div>
              <span className="text-sm text-muted">{currentItem.category || 'Uncategorized'}</span>
            </div>

            {/* Project */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-muted" />
                <span className="text-sm font-medium text-text">Project</span>
              </div>
              <span className="text-sm text-muted">{currentItem.project || 'None'}</span>
            </div>

            {/* Importance */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-muted" />
                <span className="text-sm font-medium text-text">Importance</span>
              </div>
              <div className="flex gap-2">
                {(['low', 'normal', 'high'] as Importance[]).map(level => (
                  <button
                    key={level}
                    onClick={() => handleImportanceChange(level)}
                    className={classNames(
                      'px-3 py-1 text-sm rounded-full border transition-colors capitalize',
                      currentItem.importance === level
                        ? level === 'high'
                          ? 'bg-amber-100 text-amber-700 border-amber-300'
                          : level === 'low'
                          ? 'bg-gray-100 text-gray-600 border-gray-300'
                          : 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-white text-muted border-border hover:border-gray-300'
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Timestamps */}
            <div className="flex gap-6 text-sm text-muted pt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(currentItem.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Updated {formatDate(currentItem.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* AI Section */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-text">AI Assist</span>
            </div>

            <div className="flex gap-2 mb-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleGenerateTags}
                loading={isGeneratingTags}
                disabled={isGeneratingTags}
              >
                <Tag className="w-4 h-4 mr-1" />
                Generate Tags
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleSummarize}
                loading={isSummarizing}
                disabled={isSummarizing}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Summarize
              </Button>
            </div>

            {/* AI Summary */}
            {(isSummarizing || aiSummary) && (
              <div className="p-3 bg-purple-50 rounded-lg">
                {isSummarizing ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-3 bg-purple-100 rounded w-full" />
                    <div className="h-3 bg-purple-100 rounded w-4/5" />
                    <div className="h-3 bg-purple-100 rounded w-3/5" />
                  </div>
                ) : (
                  <p className="text-sm text-purple-800">{aiSummary}</p>
                )}
              </div>
            )}
          </div>

          {/* Note content */}
          {currentItem.type === 'note' && currentItem.content && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <StickyNote className="w-4 h-4 text-muted" />
                <span className="text-sm font-medium text-text">Content</span>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-text bg-gray-50 p-3 rounded-lg">
                  {currentItem.content}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-border flex gap-2">
          {currentItem.type === 'file' && (
            <Button
              variant="secondary"
              className="flex-1"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => onDownload?.(currentItem)}
            >
              Download
            </Button>
          )}
          {currentItem.type === 'link' && currentItem.url && (
            <Button
              variant="secondary"
              className="flex-1"
              leftIcon={<ExternalLink className="w-4 h-4" />}
              onClick={() => window.open(currentItem.url, '_blank')}
            >
              Open Link
            </Button>
          )}
          <Button
            variant="secondary"
            className="flex-1"
            leftIcon={<Share2 className="w-4 h-4" />}
            onClick={() => onShare?.(currentItem)}
          >
            Share
          </Button>
          <Tooltip content="Delete">
            <IconButton
              aria-label="Delete item"
              icon={<Trash2 className="w-full h-full" />}
              variant="ghost"
              className="text-red-500 hover:bg-red-50"
              onClick={() => onDelete?.(currentItem)}
            />
          </Tooltip>
        </div>
      </div>
    </>
  );
};
