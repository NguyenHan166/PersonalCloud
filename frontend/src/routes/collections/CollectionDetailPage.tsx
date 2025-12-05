import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Globe, Lock, Settings, Share2 } from 'lucide-react';
import { Button, IconButton, Badge, Tooltip, EmptyState } from '@/components/common';
import { ItemGrid, ItemDetailPanel } from '@/components/library';
import { CollectionModal } from '@/components/collections';
import { CreateShareModal, ItemPickerModal } from '@/components/modals';
import { mockCollections, mockItems } from '@/api/mockData';
import type { Item, ViewMode } from '@/types/domain';

export const CollectionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [viewMode] = useState<ViewMode>('grid');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [shareItem, setShareItem] = useState<Item | null>(null);
  const [isItemPickerOpen, setIsItemPickerOpen] = useState(false);

  // Find collection
  const collection = mockCollections.find(c => c.id === id);

  // Get items in this collection
  const collectionItems = useMemo(() => {
    return mockItems.filter(item => 
      item.collections?.some(c => c.id === id)
    );
  }, [id]);

  if (!collection) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Collection not found.</p>
        <Button variant="ghost" onClick={() => navigate('/collections')} className="mt-4">
          Back to Collections
        </Button>
      </div>
    );
  }

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleTogglePublic = () => {
    console.log('Toggle public:', !collection.isPublic);
    // TODO: Call API to toggle
  };

  const handleAddItems = () => {
    setIsItemPickerOpen(true);
  };

  const handleAddItemsSubmit = (itemIds: string[]) => {
    console.log('Add items to collection:', itemIds);
    // TODO: Call API to add items to collection
  };

  const handleEditCollection = (data: { name: string; description: string; isPublic: boolean }) => {
    console.log('Update collection:', data);
    // TODO: Call API
  };

  const handleUpdateItem = (item: Item, updates: Partial<Item>) => {
    console.log('Update item:', item.id, updates);
    setSelectedItem(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleDeleteItem = (item: Item) => {
    console.log('Delete item from collection:', item);
    setSelectedItem(null);
  };

  const handleShareItem = (item: Item) => {
    setShareItem(item);
  };

  const handleCreateShare = (data: { itemId: string; expiresInHours: number; password?: string }) => {
    console.log('Create share link:', data);
  };

  const handleDownloadItem = (item: Item) => {
    console.log('Download item:', item);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        {/* Top row: Back button + Actions */}
        <div className="flex items-center justify-between mb-4">
          <IconButton
            aria-label="Back to collections"
            icon={<ArrowLeft className="w-full h-full" />}
            onClick={() => navigate('/collections')}
            variant="ghost"
          />
          
          {/* Actions - always visible */}
          <div className="flex items-center gap-2">
            {collection.isPublic && (
              <Tooltip content="Share public link">
                <IconButton
                  aria-label="Share"
                  icon={<Share2 className="w-full h-full" />}
                  variant="ghost"
                  onClick={() => {
                    const url = `${window.location.origin}/public/${collection.slugPublic}`;
                    navigator.clipboard.writeText(url);
                    alert('Link copied!');
                  }}
                />
              </Tooltip>
            )}
            <Tooltip content="Settings">
              <IconButton
                aria-label="Settings"
                icon={<Settings className="w-full h-full" />}
                variant="ghost"
                onClick={() => setIsEditModalOpen(true)}
              />
            </Tooltip>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleAddItems}
              className="hidden sm:flex"
            >
              Add Items
            </Button>
            {/* Mobile: icon only */}
            <IconButton
              aria-label="Add Items"
              icon={<Plus className="w-full h-full" />}
              onClick={handleAddItems}
              className="sm:hidden"
            />
          </div>
        </div>

        {/* Title row */}
        <div className="flex items-start gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-text">{collection.name}</h1>
          <Tooltip content={collection.isPublic ? 'Public Collection' : 'Private Collection'}>
            <button
              onClick={handleTogglePublic}
              className={`p-1.5 rounded-full transition-colors flex-shrink-0 ${
                collection.isPublic
                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {collection.isPublic ? (
                <Globe className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </button>
          </Tooltip>
        </div>
        
        {/* Description */}
        {collection.description && (
          <p className="text-muted text-sm sm:text-base mt-1">{collection.description}</p>
        )}
        
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Badge variant="default">
            {collectionItems.length} item{collectionItems.length !== 1 ? 's' : ''}
          </Badge>
          {collection.isPublic && collection.slugPublic && (
            <Badge variant="success">
              /{collection.slugPublic}
            </Badge>
          )}
        </div>
      </div>

      {/* Items */}
      {collectionItems.length > 0 ? (
        <ItemGrid
          items={collectionItems}
          viewMode={viewMode}
          isLoading={false}
          isError={false}
          onItemClick={handleItemClick}
          onItemPin={() => {}}
          onItemMenu={() => {}}
          onRetry={() => {}}
          onAddItem={handleAddItems}
        />
      ) : (
        <EmptyState
          icon={<Plus className="w-full h-full" />}
          title="No items in this collection"
          description="Add items from your library to organize them in this collection."
          action={{
            label: 'Add Items',
            onClick: handleAddItems,
          }}
        />
      )}

      {/* Edit Modal */}
      <CollectionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditCollection}
        collection={collection}
      />

      {/* Item Detail Panel */}
      <ItemDetailPanel
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteItem}
        onShare={handleShareItem}
        onDownload={handleDownloadItem}
      />

      {/* Share Modal */}
      <CreateShareModal
        isOpen={!!shareItem}
        onClose={() => setShareItem(null)}
        item={shareItem}
        onCreateShare={handleCreateShare}
      />

      {/* Item Picker Modal */}
      <ItemPickerModal
        isOpen={isItemPickerOpen}
        onClose={() => setIsItemPickerOpen(false)}
        onAdd={handleAddItemsSubmit}
        excludeItemIds={collectionItems.map(item => item.id)}
        title={`Add Items to ${collection.name}`}
      />
    </div>
  );
};

