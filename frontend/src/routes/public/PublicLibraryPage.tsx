import { Link } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/common';
import { mockCollections } from '@/api/mockData';
import type { Collection } from '@/types/domain';

export const PublicLibraryPage = () => {
  // Get all public collections
  const publicCollections = mockCollections.filter(c => c.isPublic);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text">Public Library</h1>
              <p className="text-muted">Explore shared knowledge collections</p>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {publicCollections.length > 0 ? (
          <>
            <p className="text-muted mb-6">
              {publicCollections.length} public collection{publicCollections.length !== 1 ? 's' : ''} available
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicCollections.map(collection => (
                <PublicCollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-muted mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text mb-2">No public collections</h2>
            <p className="text-muted">There are no public collections available yet.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-white mt-8">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-muted">
          Powered by CloudLib
        </div>
      </div>
    </div>
  );
};

// Collection card for public library
const PublicCollectionCard: React.FC<{ collection: Collection }> = ({ collection }) => {
  return (
    <Link
      to={`/public/${collection.slugPublic}`}
      className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
    >
      {/* Cover */}
      <div className="h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center relative">
        {collection.coverImage ? (
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Globe className="w-12 h-12 text-primary/40" />
        )}
        
        {/* Arrow on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-all">
          <div className="w-10 h-10 rounded-full bg-white/0 group-hover:bg-white flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all">
            <ArrowRight className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-text group-hover:text-primary transition-colors">
          {collection.name}
        </h3>
        {collection.description && (
          <p className="text-sm text-muted mt-1 line-clamp-2">
            {collection.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <Badge variant="default" size="sm">
            {collection.itemCount} items
          </Badge>
          <span className="text-xs text-primary font-medium">
            /{collection.slugPublic}
          </span>
        </div>
      </div>
    </Link>
  );
};
