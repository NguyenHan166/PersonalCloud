import { useState, useEffect } from 'react';
import { classNames } from '@/utils/classNames';
import { Button, IconButton, Input, Textarea } from '@/components/common';
import { X, Link as LinkIcon, Globe, AlertCircle } from 'lucide-react';
import { mockTags } from '@/api/mockData';
import type { Item } from '@/types/domain';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: LinkFormData) => void;
  link?: Item | null; // For edit mode
}

interface LinkFormData {
  url: string;
  title: string;
  description: string;
  category: string;
  project: string;
  importance: 'low' | 'normal' | 'high';
  tags: string[];
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const getDomainFromUrl = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
};

export const AddLinkModal: React.FC<AddLinkModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  link,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [project, setProject] = useState('');
  const [importance, setImportance] = useState<'low' | 'normal' | 'high'>('normal');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [urlError, setUrlError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!link;

  // Pre-fill form when editing
  useEffect(() => {
    if (link && isOpen) {
      setUrl(link.url || '');
      setTitle(link.title || '');
      setDescription(link.description || '');
      setCategory(link.category || '');
      setProject(link.project || '');
      setImportance(link.importance || 'normal');
      setSelectedTags(link.tags?.map(t => t.id) || []);
    } else if (!isOpen) {
      // Reset form when closed
      setUrl('');
      setTitle('');
      setDescription('');
      setCategory('');
      setProject('');
      setImportance('normal');
      setSelectedTags([]);
      setUrlError('');
    }
  }, [link, isOpen]);

  // URL validation
  useEffect(() => {
    if (url && !isValidUrl(url)) {
      setUrlError('Please enter a valid URL');
    } else {
      setUrlError('');
    }
  }, [url]);

  // Auto-fill title from domain when URL changes (only for new links)
  useEffect(() => {
    if (!isEditMode && url && isValidUrl(url) && !title) {
      const domain = getDomainFromUrl(url);
      if (domain) {
        setTitle(domain.replace('www.', ''));
      }
    }
  }, [url, title, isEditMode]);

  const handleSubmit = async () => {
    if (!url || urlError) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 500));

    onSubmit?.({
      url,
      title: title || getDomainFromUrl(url),
      description,
      category,
      project,
      importance,
      tags: selectedTags,
    });

    setIsLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setUrl('');
    setTitle('');
    setDescription('');
    setCategory('');
    setProject('');
    setImportance('normal');
    setSelectedTags([]);
    setUrlError('');
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
      <div className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[500px] z-50 bg-surface rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LinkIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-text">
              {isEditMode ? 'Edit Link' : 'Add Link'}
            </h2>
          </div>
          <IconButton
            aria-label="Close"
            icon={<X className="w-full h-full" />}
            onClick={handleClose}
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              URL <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="pl-10"
                autoFocus
              />
            </div>
            {urlError && (
              <p className="flex items-center gap-1 text-sm text-red-500 mt-1">
                <AlertCircle className="w-4 h-4" />
                {urlError}
              </p>
            )}
            {url && isValidUrl(url) && (
              <p className="text-sm text-muted mt-1">
                Domain: {getDomainFromUrl(url)}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title (optional - auto-filled from URL)"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
            />
          </div>

          {/* Category & Project */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Category
              </label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Study, Work"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Project
              </label>
              <Input
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="e.g., Learning React"
              />
            </div>
          </div>

          {/* Importance */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Importance
            </label>
            <div className="flex gap-2">
              {(['low', 'normal', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setImportance(level)}
                  className={classNames(
                    'px-4 py-2 text-sm rounded-lg border transition-colors capitalize flex-1',
                    importance === level
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

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {mockTags.slice(0, 8).map((tag) => (
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

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-gray-50">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!url || !!urlError}
            loading={isLoading}
          >
            {isEditMode ? 'Save Changes' : 'Add Link'}
          </Button>
        </div>
      </div>
    </>
  );
};
