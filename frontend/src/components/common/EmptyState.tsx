import React from 'react';
import { classNames } from '@/utils/classNames';
import { Button, ButtonProps } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps['variant'];
    icon?: React.ReactNode;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center text-center',
        'py-12 px-6',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 mb-4 text-muted flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-text mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <Button
          variant={action.variant || 'primary'}
          onClick={action.onClick}
          leftIcon={action.icon}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
