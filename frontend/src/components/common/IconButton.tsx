import React from 'react';
import { classNames } from '@/utils/classNames';
import { Loader2 } from 'lucide-react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: 'default' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon: React.ReactNode;
}

const variantStyles = {
  default: 'bg-surface border border-border hover:bg-gray-50 text-text',
  ghost: 'hover:bg-gray-100 text-muted hover:text-text',
  danger: 'hover:bg-red-50 text-muted hover:text-error',
};

const sizeStyles = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2.5',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      loading = false,
      disabled,
      icon,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={classNames(
          'inline-flex items-center justify-center rounded-lg',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className={classNames('animate-spin', iconSizes[size])} />
        ) : (
          <span className={iconSizes[size]}>{icon}</span>
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
