import React, { useState } from 'react';
import { LibraryToolbar, LibraryFilters, ItemGrid, ItemDetailPanel } from '@/components/library';
import { UploadModal, AddLinkModal, AddNoteModal, CreateShareModal } from '@/components/modals';
import { Button } from '@/components/common';
import { Upload, Link, StickyNote } from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { mockTags } from '@/api/mockData';
import type { ViewMode, Item } from '@/types/domain';

export const LibraryPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<LibraryFilters>({
    search: '',
    type: 'all',
    tags: [],
    category: '',
    project: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [shareItem, setShareItem] = useState<Item | null>(null);

  const { items, total, isLoading, isError, errorMessage, refetch } = useItems(filters);

  // Get unique categories and projects from items
  const categories = [...new Set(items.map(i => i.category).filter(Boolean))] as string[];
  const projects = [...new Set(items.map(i => i.project).filter(Boolean))] as string[];

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleItemPin = (item: Item) => {
    console.log('Toggle pin:', item);
    // TODO: Call togglePinItem API
  };

  const handleItemMenu = (item: Item, e: React.MouseEvent) => {
    console.log('Open menu:', item);
    // TODO: Show context menu
  };

  const handleAddItem = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadComplete = (files: unknown[]) => {
    console.log('Upload complete:', files);
    refetch();
  };

  const handleAddLink = (data: unknown) => {
    console.log('Add link:', data);
    refetch();
  };

  const handleAddNote = (data: unknown) => {
    console.log('Add note:', data);
    refetch();
  };

  const handleUpdateItem = (item: Item, updates: Partial<Item>) => {
    console.log('Update item:', item.id, updates);
    // TODO: Call updateItem API and refresh
    // For now, update locally
    setSelectedItem(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleDeleteItem = (item: Item) => {
    console.log('Delete item:', item);
    // TODO: Show confirm dialog and call delete API
    setSelectedItem(null);
  };

  const handleShareItem = (item: Item) => {
    setShareItem(item);
  };

  const handleCreateShare = (data: { itemId: string; expiresInHours: number; password?: string }) => {
    console.log('Create share link:', data);
    // TODO: Call API to create share link
  };

  const handleDownloadItem = (item: Item) => {
    console.log('Download item:', item);
    // TODO: Call download API
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Library</h1>
          <p className="text-muted mt-1">All your files, links, and notes in one place</p>
        </div>

        {/* Add buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            leftIcon={<Upload className="w-4 h-4" />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            leftIcon={<Link className="w-4 h-4" />}
            onClick={() => setIsAddLinkModalOpen(true)}
          >
            Add Link
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            leftIcon={<StickyNote className="w-4 h-4" />}
            onClick={() => setIsAddNoteModalOpen(true)}
          >
            New Note
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <LibraryToolbar
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        availableTags={mockTags}
        availableCategories={categories}
        availableProjects={projects}
        totalItems={total}
      />

      {/* Items grid/list */}
      <ItemGrid
        items={items}
        viewMode={viewMode}
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage || undefined}
        onItemClick={handleItemClick}
        onItemPin={handleItemPin}
        onItemMenu={handleItemMenu}
        onRetry={refetch}
        onAddItem={handleAddItem}
      />

      {/* Item detail panel */}
      <ItemDetailPanel
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteItem}
        onShare={handleShareItem}
        onDownload={handleDownloadItem}
      />

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
      <AddLinkModal
        isOpen={isAddLinkModalOpen}
        onClose={() => setIsAddLinkModalOpen(false)}
        onSubmit={handleAddLink}
      />
      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onSubmit={handleAddNote}
      />
      <CreateShareModal
        isOpen={!!shareItem}
        onClose={() => setShareItem(null)}
        item={shareItem}
        onCreateShare={handleCreateShare}
      />
    </div>
  );
};
