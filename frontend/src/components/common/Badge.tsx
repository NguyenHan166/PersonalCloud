import React from 'react';
import { classNames } from '@/utils/classNames';
import { X } from 'lucide-react';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  removable = false,
  onRemove,
  className,
  style,
  children,
}) => {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      style={style}
    >
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
