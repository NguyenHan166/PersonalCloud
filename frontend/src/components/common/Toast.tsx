import React from 'react';
import { classNames } from '@/utils/classNames';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
  isExiting?: boolean;
}

interface ToastProps extends ToastData {
  onClose: (id: string) => void;
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    iconColor: 'text-success',
    textColor: 'text-success',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-error/10',
    borderColor: 'border-error/30',
    iconColor: 'text-error',
    textColor: 'text-error',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    iconColor: 'text-warning',
    textColor: 'text-amber-700',
  },
  info: {
    icon: Info,
    bgColor: 'bg-info/10',
    borderColor: 'border-info/30',
    iconColor: 'text-info',
    textColor: 'text-info',
  },
};

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  variant,
  isExiting,
  onClose,
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={classNames(
        'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg',
        'min-w-[300px] max-w-[400px]',
        config.bgColor,
        config.borderColor,
        isExiting ? 'animate-toast-out' : 'animate-toast-in'
      )}
    >
      <Icon className={classNames('w-5 h-5 flex-shrink-0', config.iconColor)} />
      <p className={classNames('flex-1 text-sm font-medium', config.textColor)}>
        {message}
      </p>
      <button
        onClick={() => onClose(id)}
        aria-label="Close notification"
        className={classNames(
          'p-1 -m-1 rounded-md transition-colors',
          'hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-primary/50',
          config.iconColor
        )}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
