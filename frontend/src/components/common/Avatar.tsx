import React from 'react';
import { classNames } from '@/utils/classNames';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const showImage = src && !imageError;
  const showInitials = !showImage && name;
  const showIcon = !showImage && !name;

  return (
    <div
      className={classNames(
        'relative inline-flex items-center justify-center',
        'rounded-full bg-gray-100 text-muted font-medium',
        'overflow-hidden flex-shrink-0',
        sizeStyles[size],
        className
      )}
    >
      {showImage && (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
      {showInitials && <span>{getInitials(name)}</span>}
      {showIcon && <User className={iconSizes[size]} />}
    </div>
  );
};
