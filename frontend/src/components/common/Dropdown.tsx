import React, { useState, useRef, useEffect } from 'react';
import { classNames } from '@/utils/classNames';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  leftIcon?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  showCheckmark?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  leftIcon,
  className,
  buttonClassName,
  menuClassName,
  disabled = false,
  showCheckmark = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={classNames('relative', className)} ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={classNames(
          'flex items-center gap-2 px-3 py-2 text-sm',
          'bg-surface border border-border rounded-lg',
          'transition-all duration-200',
          'hover:border-gray-300 hover:bg-gray-50',
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
          isOpen && 'border-primary ring-2 ring-primary/50',
          disabled && 'opacity-60 cursor-not-allowed',
          buttonClassName
        )}
      >
        {leftIcon && (
          <span className="text-muted">{leftIcon}</span>
        )}
        <span className="flex-1 text-left truncate">
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={classNames(
            'w-4 h-4 text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={classNames(
            'absolute z-50 mt-1 w-full min-w-[200px]',
            'bg-surface border border-border rounded-xl shadow-lg',
            'overflow-hidden animate-fade-in',
            menuClassName
          )}
        >
          <div className="py-1.5 max-h-[280px] overflow-y-auto">
            {options.map((option) => {
              const isSelected = option.value === value;
              
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  className={classNames(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-left',
                    'transition-colors duration-150',
                    isSelected
                      ? 'bg-primary/5 text-primary'
                      : 'text-text hover:bg-gray-50',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {/* Icon */}
                  {option.icon && (
                    <span className={classNames(
                      'flex-shrink-0',
                      isSelected ? 'text-primary' : 'text-muted'
                    )}>
                      {option.icon}
                    </span>
                  )}
                  
                  {/* Label & Description */}
                  <div className="flex-1 min-w-0">
                    <p className={classNames(
                      'text-sm font-medium truncate',
                      isSelected && 'text-primary'
                    )}>
                      {option.label}
                    </p>
                    {option.description && (
                      <p className="text-xs text-muted truncate mt-0.5">
                        {option.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Checkmark */}
                  {showCheckmark && isSelected && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
