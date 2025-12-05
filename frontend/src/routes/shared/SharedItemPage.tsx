import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Share2, 
  Clock, 
  FileText, 
  Link as LinkIcon, 
  Image, 
  StickyNote, 
  ExternalLink, 
  Download,
  Lock,
  AlertCircle,
  Calendar,
  Eye
} from 'lucide-react';
import { Button, Badge, Input } from '@/components/common';
import { mockSharedLinks } from '@/api/mockData';
import type { SharedLink, Item } from '@/types/domain';

// Get icon for item type
const getItemIcon = (item?: Item) => {
  if (!item) return FileText;
  if (item.type === 'link') return LinkIcon;
  if (item.type === 'note') return StickyNote;
  if (item.mimeType?.startsWith('image/')) return Image;
  return FileText;
};

// Format date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get status
const getShareStatus = (link: SharedLink): 'active' | 'expired' | 'revoked' => {
  if (link.isRevoked) return 'revoked';
  if (new Date(link.expiresAt) < new Date()) return 'expired';
  return 'active';
};

export const SharedItemPage = () => {
  const { token } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [sharedLink, setSharedLink] = useState<SharedLink | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Find shared link by token
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const link = mockSharedLinks.find(l => l.token === token);
      setSharedLink(link || null);
      // Auto-unlock if no password
      if (link && !link.hasPassword) {
        setIsUnlocked(true);
      }
      setIsLoading(false);
    }, 500);
  }, [token]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password check - in real app, this would be an API call
    if (password === 'demo123') {
      setIsUnlocked(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const status = sharedLink ? getShareStatus(sharedLink) : null;
  const item = sharedLink?.item;
  const ItemIcon = getItemIcon(item);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Not found
  if (!sharedLink) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-text mb-2">Link Not Found</h1>
          <p className="text-muted mb-6">
            This shared link doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Expired or Revoked
  if (status === 'expired' || status === 'revoked') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-xl font-bold text-text mb-2">
            {status === 'expired' ? 'Link Expired' : 'Link Revoked'}
          </h1>
          <p className="text-muted mb-4">
            {status === 'expired' 
              ? 'This shared link has expired and is no longer accessible.'
              : 'The owner has revoked access to this shared link.'}
          </p>
          {status === 'expired' && (
            <p className="text-sm text-muted mb-6">
              Expired on: {formatDate(sharedLink.expiresAt)}
            </p>
          )}
          <Link to="/">
            <Button variant="secondary">Go to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Password required
  if (sharedLink.hasPassword && !isUnlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-text mb-2">Password Protected</h1>
            <p className="text-muted">
              Enter the password to access this shared content.
            </p>
          </div>
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                error={passwordError}
              />
            </div>
            <Button type="submit" className="w-full">
              Unlock
            </Button>
          </form>
          
          <p className="text-xs text-muted text-center mt-4">
            (Demo password: demo123)
          </p>
        </div>
      </div>
    );
  }

  // Active - Show item
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-text">Shared Content</span>
          </div>
          <Badge variant="success" size="sm">Active</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Preview */}
          {item?.thumbnailUrl ? (
            <div className="relative">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-64 object-cover"
              />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
              <ItemIcon className="w-16 h-16 text-primary/40" />
            </div>
          )}

          {/* Info */}
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <ItemIcon className="w-5 h-5 text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-text">{item?.title}</h1>
                <p className="text-sm text-muted capitalize">{item?.type}</p>
              </div>
            </div>

            {item?.description && (
              <p className="text-text mb-6">{item.description}</p>
            )}

            {/* Link specific - URL */}
            {item?.type === 'link' && item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors mb-6"
              >
                <LinkIcon className="w-5 h-5" />
                <span className="truncate flex-1">{item.url}</span>
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
              </a>
            )}

            {/* Note specific - Content */}
            {item?.type === 'note' && item.content && (
              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <pre className="whitespace-pre-wrap text-sm text-text">
                  {item.content}
                </pre>
              </div>
            )}

            {/* Tags */}
            {item?.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map(tag => (
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

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm text-muted border-t border-border pt-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Shared {formatDate(sharedLink.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Expires {formatDate(sharedLink.expiresAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{sharedLink.accessCount} views</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              {item?.type === 'file' && (
                <Button
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={() => console.log('Download')}
                >
                  Download
                </Button>
              )}
              {item?.type === 'link' && item.url && (
                <Button
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                  onClick={() => window.open(item.url, '_blank')}
                >
                  Open Link
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted mt-8">
          Powered by CloudLib
        </div>
      </div>
    </div>
  );
};
