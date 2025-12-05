import { useState, useMemo } from 'react';
import { 
  Link as LinkIcon, 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  ExternalLink,
  Edit3,
  Trash2,
  Pin,
  Globe,
  Star,
  Clock
} from 'lucide-react';
import { EmptyState, Button, Input, IconButton, Badge, Tooltip } from '@/components/common';
import { AddLinkModal } from '@/components/modals';
import { mockItems } from '@/api/mockData';
import type { Item, ViewMode } from '@/types/domain';
import { classNames } from '@/utils/classNames';

// Extract domain from URL
const extractDomain = (url?: string) => {
  if (!url) return 'unknown';
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'unknown';
  }
};

// Get favicon URL
const getFaviconUrl = (domain: string) => {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
};

export const LinksPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Item | null>(null);
  const [groupByDomain, setGroupByDomain] = useState(false);

  // Filter only links
  const links = useMemo(() => {
    return mockItems
      .filter(item => item.type === 'link')
      .filter(item => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.url?.toLowerCase().includes(query) ||
          item.domain?.toLowerCase().includes(query) ||
          item.tags.some(t => t.name.toLowerCase().includes(query))
        );
      });
  }, [searchQuery]);

  // Group by domain
  const groupedLinks = useMemo(() => {
    if (!groupByDomain) return null;
    
    const groups: Record<string, Item[]> = {};
    links.forEach(link => {
      const domain = extractDomain(link.url);
      if (!groups[domain]) groups[domain] = [];
      groups[domain].push(link);
    });
    
    // Sort by count
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [links, groupByDomain]);

  const handleAddLink = (data: unknown) => {
    console.log('Add link:', data);
    setIsAddModalOpen(false);
  };

  const handleEditLink = (link: Item) => {
    setEditingLink(link);
    setIsAddModalOpen(true);
  };

  const handleDeleteLink = (link: Item) => {
    console.log('Delete link:', link);
  };

  const handlePinLink = (link: Item) => {
    console.log('Toggle pin:', link);
  };

  const handleOpenLink = (url?: string) => {
    if (url) window.open(url, '_blank');
  };

  const hasLinks = links.length > 0;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Links</h1>
          <p className="text-muted mt-1">Save and organize external links</p>
        </div>
        <Button 
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditingLink(null);
            setIsAddModalOpen(true);
          }}
        >
          Add Link
        </Button>
      </div>

      {hasLinks ? (
        <>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Group by domain toggle */}
              <Button
                variant={groupByDomain ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setGroupByDomain(!groupByDomain)}
              >
                <Globe className="w-4 h-4 mr-1" />
                Group by Domain
              </Button>

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
          </div>

          {/* Links Display */}
          {groupByDomain && groupedLinks ? (
            // Grouped view
            <div className="space-y-8">
              {groupedLinks.map(([domain, domainLinks]) => (
                <div key={domain}>
                  <div className="flex items-center gap-2 mb-4">
                    <img 
                      src={getFaviconUrl(domain)} 
                      alt={domain}
                      className="w-5 h-5 rounded"
                    />
                    <h2 className="font-semibold text-text">{domain}</h2>
                    <Badge variant="default" size="sm">{domainLinks.length}</Badge>
                  </div>
                  
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {domainLinks.map(link => (
                        <LinkCard
                          key={link.id}
                          link={link}
                          onOpen={() => handleOpenLink(link.url)}
                          onEdit={() => handleEditLink(link)}
                          onDelete={() => handleDeleteLink(link)}
                          onPin={() => handlePinLink(link)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {domainLinks.map(link => (
                        <LinkListItem
                          key={link.id}
                          link={link}
                          onOpen={() => handleOpenLink(link.url)}
                          onEdit={() => handleEditLink(link)}
                          onDelete={() => handleDeleteLink(link)}
                          onPin={() => handlePinLink(link)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Flat view
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {links.map(link => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    onOpen={() => handleOpenLink(link.url)}
                    onEdit={() => handleEditLink(link)}
                    onDelete={() => handleDeleteLink(link)}
                    onPin={() => handlePinLink(link)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {links.map(link => (
                  <LinkListItem
                    key={link.id}
                    link={link}
                    onOpen={() => handleOpenLink(link.url)}
                    onEdit={() => handleEditLink(link)}
                    onDelete={() => handleDeleteLink(link)}
                    onPin={() => handlePinLink(link)}
                  />
                ))}
              </div>
            )
          )}

          {/* No results */}
          {links.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted">No links match "{searchQuery}"</p>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<LinkIcon className="w-full h-full" />}
          title="No links saved"
          description="Save links to articles, documentation, videos, and more."
          action={{
            label: 'Add Your First Link',
            onClick: () => setIsAddModalOpen(true),
          }}
        />
      )}

      {/* Add/Edit Modal */}
      <AddLinkModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingLink(null);
        }}
        onSubmit={handleAddLink}
      />
    </div>
  );
};

// Link Card Component
interface LinkCardProps {
  link: Item;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPin: () => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onOpen, onEdit, onDelete, onPin }) => {
  const domain = extractDomain(link.url);
  
  return (
    <div
      className={classNames(
        'group relative bg-surface rounded-xl border border-border overflow-hidden',
        'cursor-pointer hover:shadow-md hover:border-primary/30',
        'transition-all duration-200',
        link.isPinned && 'ring-2 ring-primary/20'
      )}
    >
      {/* Thumbnail or gradient */}
      <div 
        onClick={onOpen}
        className="relative h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center"
      >
        {link.thumbnailUrl ? (
          <img
            src={link.thumbnailUrl}
            alt={link.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <LinkIcon className="w-10 h-10 text-blue-500/40" />
        )}
        
        {/* Pin indicator */}
        {link.isPinned && (
          <div className="absolute top-2 right-2">
            <Pin className="w-4 h-4 text-primary fill-primary" />
          </div>
        )}

        {/* Open overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <div className="p-2 bg-white rounded-full shadow-lg">
            <ExternalLink className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Domain */}
        <div className="flex items-center gap-2 mb-2">
          <img 
            src={getFaviconUrl(domain)} 
            alt={domain}
            className="w-4 h-4 rounded"
          />
          <span className="text-xs text-muted truncate">{domain}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-text mb-1 line-clamp-2" title={link.title}>
          {link.title}
        </h3>

        {/* Description */}
        {link.description && (
          <p className="text-sm text-muted line-clamp-2 mb-2">
            {link.description}
          </p>
        )}

        {/* Tags */}
        {link.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {link.tags.slice(0, 2).map(tag => (
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
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-border">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(link.createdAt).toLocaleDateString()}
          </span>
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onPin(); }}
              className="p-1 rounded hover:bg-gray-100"
            >
              <Pin className={classNames('w-3.5 h-3.5', link.isPinned && 'fill-current text-primary')} />
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
    </div>
  );
};

// Link List Item Component
const LinkListItem: React.FC<LinkCardProps> = ({ link, onOpen, onEdit, onDelete, onPin }) => {
  const domain = extractDomain(link.url);
  
  return (
    <div
      className={classNames(
        'group flex items-center gap-4 bg-surface rounded-lg border border-border p-4',
        'cursor-pointer hover:shadow-sm hover:border-primary/30',
        'transition-all duration-200'
      )}
      onClick={onOpen}
    >
      {/* Favicon */}
      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
        <img 
          src={getFaviconUrl(domain)} 
          alt={domain}
          className="w-6 h-6 rounded"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-text truncate">{link.title}</h3>
          {link.isPinned && <Pin className="w-3.5 h-3.5 text-primary fill-primary flex-shrink-0" />}
        </div>
        <p className="text-sm text-muted truncate">{domain}</p>
      </div>

      {/* Tags */}
      <div className="hidden md:flex items-center gap-1">
        {link.tags.slice(0, 2).map(tag => (
          <Badge key={tag.id} variant="default" size="sm">
            {tag.name}
          </Badge>
        ))}
      </div>

      {/* Date */}
      <span className="text-sm text-muted hidden sm:block">
        {new Date(link.createdAt).toLocaleDateString()}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Tooltip content="Pin">
          <IconButton
            aria-label="Pin"
            icon={<Pin className={classNames('w-full h-full', link.isPinned && 'fill-current text-primary')} />}
            size="sm"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); onPin(); }}
          />
        </Tooltip>
        <Tooltip content="Open link">
          <IconButton
            aria-label="Open"
            icon={<ExternalLink className="w-full h-full" />}
            size="sm"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
          />
        </Tooltip>
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
