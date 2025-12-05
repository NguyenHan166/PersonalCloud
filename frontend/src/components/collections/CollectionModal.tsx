import { useState, useEffect } from 'react';
import { classNames } from '@/utils/classNames';
import { Button, IconButton, Input, Textarea } from '@/components/common';
import { X, Folder, Globe, Lock } from 'lucide-react';
import type { Collection } from '@/types/domain';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CollectionFormData) => void;
  collection?: Collection | null; // For edit mode
}

interface CollectionFormData {
  name: string;
  description: string;
  isPublic: boolean;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  collection,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!collection;

  // Populate form when editing
  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setDescription(collection.description || '');
      setIsPublic(collection.isPublic);
    } else {
      setName('');
      setDescription('');
      setIsPublic(false);
    }
  }, [collection]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 500));

    onSubmit?.({
      name: name.trim(),
      description,
      isPublic,
    });

    setIsLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setIsPublic(false);
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
      <div className="fixed inset-x-4 top-[15%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[480px] z-50 bg-surface rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Folder className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-text">
              {isEditMode ? 'Edit Collection' : 'New Collection'}
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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Frontend Resources"
              autoFocus
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
              placeholder="What's this collection about?"
              rows={3}
            />
          </div>

          {/* Visibility toggle */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Visibility
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setIsPublic(false)}
                className={classNames(
                  'flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                  !isPublic
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-gray-300'
                )}
              >
                <Lock className={classNames('w-5 h-5', !isPublic ? 'text-primary' : 'text-muted')} />
                <div className="text-left">
                  <p className={classNames('font-medium', !isPublic ? 'text-primary' : 'text-text')}>
                    Private
                  </p>
                  <p className="text-xs text-muted">Only you can see</p>
                </div>
              </button>
              <button
                onClick={() => setIsPublic(true)}
                className={classNames(
                  'flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                  isPublic
                    ? 'border-green-500 bg-green-50'
                    : 'border-border hover:border-gray-300'
                )}
              >
                <Globe className={classNames('w-5 h-5', isPublic ? 'text-green-600' : 'text-muted')} />
                <div className="text-left">
                  <p className={classNames('font-medium', isPublic ? 'text-green-600' : 'text-text')}>
                    Public
                  </p>
                  <p className="text-xs text-muted">Anyone with link</p>
                </div>
              </button>
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
            disabled={!name.trim()}
            loading={isLoading}
          >
            {isEditMode ? 'Save Changes' : 'Create Collection'}
          </Button>
        </div>
      </div>
    </>
  );
};
