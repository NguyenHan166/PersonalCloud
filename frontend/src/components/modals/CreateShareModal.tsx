import { useState } from 'react';
import { classNames } from '@/utils/classNames';
import { Button, IconButton, Input } from '@/components/common';
import { X, Share2, Clock, Lock, Copy, Check, ExternalLink } from 'lucide-react';
import type { Item } from '@/types/domain';

interface CreateShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onCreateShare?: (data: CreateShareData) => void;
}

interface CreateShareData {
  itemId: string;
  expiresInHours: number;
  password?: string;
}

const EXPIRATION_OPTIONS = [
  { label: '1 hour', hours: 1 },
  { label: '24 hours', hours: 24 },
  { label: '7 days', hours: 24 * 7 },
  { label: '30 days', hours: 24 * 30 },
  { label: 'Never', hours: 0 },
];

export const CreateShareModal: React.FC<CreateShareModalProps> = ({
  isOpen,
  onClose,
  item,
  onCreateShare,
}) => {
  const [expiresInHours, setExpiresInHours] = useState(24 * 7); // Default: 7 days
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!item) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));

    const token = Math.random().toString(36).substring(2, 11);
    const shareUrl = `${window.location.origin}/s/${token}`;
    
    setCreatedLink(shareUrl);
    
    onCreateShare?.({
      itemId: item.id,
      expiresInHours,
      password: usePassword ? password : undefined,
    });

    setIsLoading(false);
  };

  const handleCopy = async () => {
    if (!createdLink) return;
    await navigator.clipboard.writeText(createdLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setExpiresInHours(24 * 7);
    setPassword('');
    setUsePassword(false);
    setCreatedLink(null);
    setCopied(false);
    onClose();
  };

  if (!isOpen || !item) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-[15%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[440px] z-50 bg-surface rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Share2 className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-text">Share Link</h2>
          </div>
          <IconButton
            aria-label="Close"
            icon={<X className="w-full h-full" />}
            onClick={handleClose}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {!createdLink ? (
            // Create form
            <>
              {/* Item info */}
              <div className="p-3 bg-gray-50 rounded-lg mb-6">
                <p className="font-medium text-text truncate">{item.title}</p>
                <p className="text-sm text-muted">{item.type}</p>
              </div>

              {/* Expiration */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-text mb-3">
                  <Clock className="w-4 h-4 text-muted" />
                  Link expiration
                </label>
                <div className="flex flex-wrap gap-2">
                  {EXPIRATION_OPTIONS.map(opt => (
                    <button
                      key={opt.hours}
                      onClick={() => setExpiresInHours(opt.hours)}
                      className={classNames(
                        'px-3 py-2 text-sm rounded-lg border transition-colors',
                        expiresInHours === opt.hours
                          ? 'border-primary bg-primary/5 text-primary font-medium'
                          : 'border-border bg-white text-text hover:border-primary/30'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password protection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-text mb-3">
                  <Lock className="w-4 h-4 text-muted" />
                  Password protection
                </label>
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => setUsePassword(false)}
                    className={classNames(
                      'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors',
                      !usePassword
                        ? 'border-primary bg-primary/5 text-primary font-medium'
                        : 'border-border bg-white text-text hover:border-primary/30'
                    )}
                  >
                    No password
                  </button>
                  <button
                    onClick={() => setUsePassword(true)}
                    className={classNames(
                      'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors',
                      usePassword
                        ? 'border-primary bg-primary/5 text-primary font-medium'
                        : 'border-border bg-white text-text hover:border-primary/30'
                    )}
                  >
                    Set password
                  </button>
                </div>
                {usePassword && (
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                )}
              </div>
            </>
          ) : (
            // Success state
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">Link Created!</h3>
              <p className="text-sm text-muted mb-6">
                Anyone with this link{usePassword ? ' and password' : ''} can access the shared item.
              </p>
              
              {/* Share URL */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-4">
                <input
                  type="text"
                  value={createdLink}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-text focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-gray-200 text-muted hover:text-text transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-3">
                <a
                  href={createdLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open link
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!createdLink && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-gray-50">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              loading={isLoading}
              disabled={usePassword && !password.trim()}
            >
              Create Share Link
            </Button>
          </div>
        )}

        {createdLink && (
          <div className="flex items-center justify-center px-6 py-4 border-t border-border bg-gray-50">
            <Button onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
