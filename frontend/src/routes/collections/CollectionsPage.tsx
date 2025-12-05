import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Plus, Search } from 'lucide-react';
import { EmptyState, Button, Input } from '@/components/common';
import { CollectionCard, CollectionModal } from '@/components/collections';
import { mockCollections } from '@/api/mockData';
import type { Collection } from '@/types/domain';

export const CollectionsPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter collections
  const filteredCollections = mockCollections.filter(col =>
    col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    col.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCollectionClick = (collection: Collection) => {
    navigate(`/app/collections/${collection.id}`);
  };

  const handleCreateCollection = (data: { name: string; description: string; isPublic: boolean }) => {
    console.log('Create collection:', data);
    // TODO: Call API and refresh
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const hasCollections = mockCollections.length > 0;

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Collections</h1>
          <p className="text-muted mt-1">Organize your items into collections</p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditingCollection(null);
            setIsModalOpen(true);
          }}
        >
          New Collection
        </Button>
      </div>

      {hasCollections ? (
        <>
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Collections grid */}
          {filteredCollections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCollections.map(collection => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onClick={handleCollectionClick}
                  onMenu={(col, e) => {
                    e.stopPropagation();
                    handleEditCollection(col);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted">No collections match your search.</p>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<FolderOpen className="w-full h-full" />}
          title="No collections yet"
          description="Create collections to organize your files, links, and notes by topic or project."
          action={{
            label: 'Create Collection',
            onClick: () => setIsModalOpen(true),
          }}
        />
      )}

      {/* Create/Edit Modal */}
      <CollectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCollection(null);
        }}
        onSubmit={handleCreateCollection}
        collection={editingCollection}
      />
    </div>
  );
};
