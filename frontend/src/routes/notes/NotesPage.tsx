import { useState, useMemo } from 'react';
import { 
  StickyNote, 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Pin,
  Calendar,
  Tag
} from 'lucide-react';
import { EmptyState, Button, Input, IconButton, Badge, Tooltip } from '@/components/common';
import { AddNoteModal } from '@/components/modals';
import { mockItems, mockTags } from '@/api/mockData';
import type { Item, ViewMode } from '@/types/domain';
import { classNames } from '@/utils/classNames';

export const NotesPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Item | null>(null);
  const [selectedNote, setSelectedNote] = useState<Item | null>(null);

  // Filter only notes
  const notes = useMemo(() => {
    return mockItems
      .filter(item => item.type === 'note')
      .filter(item => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.content?.toLowerCase().includes(query) ||
          item.tags.some(t => t.name.toLowerCase().includes(query))
        );
      });
  }, [searchQuery]);

  const handleAddNote = (data: unknown) => {
    console.log('Add note:', data);
    setIsAddModalOpen(false);
  };

  const handleEditNote = (note: Item) => {
    setEditingNote(note);
    setIsAddModalOpen(true);
  };

  const handleDeleteNote = (note: Item) => {
    console.log('Delete note:', note);
  };

  const handlePinNote = (note: Item) => {
    console.log('Toggle pin:', note);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const hasNotes = notes.length > 0;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Notes</h1>
          <p className="text-muted mt-1">Quick notes and ideas</p>
        </div>
        <Button 
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditingNote(null);
            setIsAddModalOpen(true);
          }}
        >
          New Note
        </Button>
      </div>

      {hasNotes ? (
        <>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Tooltip content="Grid view">
                <button
                  onClick={() => setViewMode('grid')}
                  className={classNames(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'grid' 
                      ? 'bg-white shadow text-primary' 
                      : 'text-muted hover:text-text'
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </Tooltip>
              <Tooltip content="List view">
                <button
                  onClick={() => setViewMode('list')}
                  className={classNames(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'list' 
                      ? 'bg-white shadow text-primary' 
                      : 'text-muted hover:text-text'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Notes Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => setSelectedNote(note)}
                  onEdit={() => handleEditNote(note)}
                  onDelete={() => handleDeleteNote(note)}
                  onPin={() => handlePinNote(note)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map(note => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  onClick={() => setSelectedNote(note)}
                  onEdit={() => handleEditNote(note)}
                  onDelete={() => handleDeleteNote(note)}
                  onPin={() => handlePinNote(note)}
                />
              ))}
            </div>
          )}

          {/* No results */}
          {notes.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted">No notes match "{searchQuery}"</p>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<StickyNote className="w-full h-full" />}
          title="No notes yet"
          description="Create notes to capture quick ideas, snippets, or reminders."
          action={{
            label: 'Create Your First Note',
            onClick: () => setIsAddModalOpen(true),
          }}
        />
      )}

      {/* Add/Edit Modal */}
      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingNote(null);
        }}
        onSubmit={handleAddNote}
      />

      {/* Note Preview Modal */}
      {selectedNote && (
        <NotePreviewModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onEdit={() => {
            handleEditNote(selectedNote);
            setSelectedNote(null);
          }}
        />
      )}
    </div>
  );
};

// Note Card Component
interface NoteCardProps {
  note: Item;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPin: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onEdit, onDelete, onPin }) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'group relative bg-surface rounded-xl border border-border p-4',
        'cursor-pointer hover:shadow-md hover:border-primary/30',
        'transition-all duration-200',
        note.isPinned && 'ring-2 ring-primary/20'
      )}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute -top-1 -right-1">
          <Pin className="w-4 h-4 text-primary fill-primary" />
        </div>
      )}

      {/* Title */}
      <h3 className="font-semibold text-text mb-2 line-clamp-1">{note.title}</h3>

      {/* Content preview */}
      <p className="text-sm text-muted line-clamp-4 mb-3">
        {note.content || note.description || 'No content'}
      </p>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map(tag => (
            <span
              key={tag.id}
              className="px-2 py-0.5 text-xs rounded-full"
              style={{ 
                backgroundColor: `${tag.color}20`,
                color: tag.color 
              }}
            >
              {tag.name}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-muted">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
        
        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onPin(); }}
            className="p-1 rounded hover:bg-gray-100"
          >
            <Pin className={classNames('w-3.5 h-3.5', note.isPinned && 'fill-current text-primary')} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-1 rounded hover:bg-gray-100"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 rounded hover:bg-red-50 text-red-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Note List Item Component
const NoteListItem: React.FC<NoteCardProps> = ({ note, onClick, onEdit, onDelete, onPin }) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'group flex items-center gap-4 bg-surface rounded-lg border border-border p-4',
        'cursor-pointer hover:shadow-sm hover:border-primary/30',
        'transition-all duration-200'
      )}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
        <StickyNote className="w-5 h-5 text-yellow-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-text truncate">{note.title}</h3>
          {note.isPinned && <Pin className="w-3.5 h-3.5 text-primary fill-primary flex-shrink-0" />}
        </div>
        <p className="text-sm text-muted truncate">
          {note.content || note.description || 'No content'}
        </p>
      </div>

      {/* Tags */}
      <div className="hidden md:flex items-center gap-1">
        {note.tags.slice(0, 2).map(tag => (
          <Badge key={tag.id} variant="default" size="sm">
            {tag.name}
          </Badge>
        ))}
      </div>

      {/* Date */}
      <span className="text-sm text-muted hidden sm:block">
        {new Date(note.updatedAt).toLocaleDateString()}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <IconButton
          aria-label="Edit"
          icon={<Edit3 className="w-full h-full" />}
          size="sm"
          variant="ghost"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
        />
        <IconButton
          aria-label="Delete"
          icon={<Trash2 className="w-full h-full" />}
          size="sm"
          variant="ghost"
          className="text-red-500 hover:bg-red-50"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        />
      </div>
    </div>
  );
};

// Note Preview Modal
interface NotePreviewModalProps {
  note: Item;
  onClose: () => void;
  onEdit: () => void;
}

const NotePreviewModal: React.FC<NotePreviewModalProps> = ({ note, onClose, onEdit }) => {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-4 md:inset-x-auto md:inset-y-8 md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-50 bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text">{note.title}</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <IconButton
              aria-label="Close"
              icon={<span className="text-lg">×</span>}
              onClick={onClose}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Tags */}
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {note.tags.map(tag => (
                <span
                  key={tag.id}
                  className="px-2 py-1 text-xs font-medium rounded-full"
                  style={{ 
                    backgroundColor: `${tag.color}20`,
                    color: tag.color 
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Note content */}
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-text bg-gray-50 p-4 rounded-lg font-sans">
              {note.content || 'No content'}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border text-sm text-muted">
          <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
          <span>Updated: {new Date(note.updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </>
  );
};
