import React from 'react';
import { classNames } from '@/utils/classNames';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  return (
    <Loader2
      className={classNames(
        'animate-spin text-primary',
        sizeStyles[size],
        className
      )}
      aria-label="Loading"
    />
  );
};
