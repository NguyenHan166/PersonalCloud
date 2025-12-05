import { useState } from 'react';
import { classNames } from '@/utils/classNames';
import { Button, IconButton, Input, Textarea } from '@/components/common';
import { X, StickyNote } from 'lucide-react';
import { mockTags } from '@/api/mockData';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: NoteFormData) => void;
}

interface NoteFormData {
  title: string;
  content: string;
  category: string;
  project: string;
  importance: 'low' | 'normal' | 'high';
  tags: string[];
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [project, setProject] = useState('');
  const [importance, setImportance] = useState<'low' | 'normal' | 'high'>('normal');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 500));

    onSubmit?.({
      title: title.trim(),
      content,
      category,
      project,
      importance,
      tags: selectedTags,
    });

    setIsLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setProject('');
    setImportance('normal');
    setSelectedTags([]);
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
      <div className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] md:top-[10%] md:bottom-auto z-50 bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <StickyNote className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-text">New Note</h2>
          </div>
          <IconButton
            aria-label="Close"
            icon={<X className="w-full h-full" />}
            onClick={handleClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              autoFocus
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-text mb-1">
              Content
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here... (Markdown supported)"
              rows={10}
              className="font-mono text-sm"
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
                placeholder="e.g., Work, Personal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Project
              </label>
              <Input
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="e.g., Cloud Platform"
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
            disabled={!title.trim()}
            loading={isLoading}
          >
            Create Note
          </Button>
        </div>
      </div>
    </>
  );
};
