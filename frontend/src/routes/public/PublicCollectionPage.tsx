import { useParams } from 'react-router-dom';
import { Globe, User, FileText, Link as LinkIcon, Image, Video } from 'lucide-react';
import { Badge } from '@/components/common';
import { mockCollections, mockItems, mockCurrentUser } from '@/api/mockData';
import type { Item } from '@/types/domain';

// Get icon for item type
const getItemIcon = (item: Item) => {
  if (item.type === 'link') return LinkIcon;
  if (item.type === 'note') return FileText;
  if (item.mimeType?.startsWith('image/')) return Image;
  if (item.mimeType?.startsWith('video/')) return Video;
  return FileText;
};

export const PublicCollectionPage = () => {
  const { slug } = useParams<{ slug: string }>();

  // Find collection by slug
  const collection = mockCollections.find(c => c.slugPublic === slug && c.isPublic);

  // Get items in this collection
  const collectionItems = collection
    ? mockItems.filter(item => item.collections?.some(c => c.id === collection.id))
    : [];

  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-16 h-16 text-muted mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text mb-2">Collection Not Found</h1>
          <p className="text-muted">This collection doesn't exist or is not public.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-muted mb-4">
            <Globe className="w-4 h-4" />
            <span>Public Collection</span>
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">{collection.name}</h1>
          {collection.description && (
            <p className="text-lg text-muted mb-4">{collection.description}</p>
          )}
          
          {/* Owner info */}
          <div className="flex items-center gap-3">
            {mockCurrentUser.avatar ? (
              <img
                src={mockCurrentUser.avatar}
                alt={mockCurrentUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            )}
            <div>
              <p className="font-medium text-text">{mockCurrentUser.name}</p>
              <p className="text-sm text-muted">{collectionItems.length} items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {collectionItems.length > 0 ? (
          <div className="space-y-3">
            {collectionItems.map(item => {
              const ItemIcon = getItemIcon(item);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail or icon */}
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ItemIcon className="w-8 h-8 text-muted" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-text mb-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-muted line-clamp-2 mb-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="default" size="sm">
                          {item.type}
                        </Badge>
                        {item.type === 'link' && item.domain && (
                          <span className="text-xs text-muted">{item.domain}</span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    {item.type === 'link' && item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        Visit
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted">This collection is empty.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted">
          Created with Storage App
        </div>
      </div>
    </div>
  );
};
