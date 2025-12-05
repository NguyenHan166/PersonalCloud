import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '@/utils/classNames';

export interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  delay = 200,
  className,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const showTooltip = () => {
    timeoutRef.current = window.setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let top = 0;
        let left = 0;

        switch (position) {
          case 'top':
            top = rect.top - 8;
            left = rect.left + rect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom + 8;
            left = rect.left + rect.width / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2;
            left = rect.left - 8;
            break;
          case 'right':
            top = rect.top + rect.height / 2;
            left = rect.right + 8;
            break;
        }

        setCoords({ top, left });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-0 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 translate-y-0 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 -translate-x-0 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 translate-x-0 ml-2',
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              transform:
                position === 'top' || position === 'bottom'
                  ? 'translateX(-50%) translateY(-100%)'
                  : position === 'left'
                  ? 'translateX(-100%) translateY(-50%)'
                  : 'translateY(-50%)',
            }}
            className={classNames(
              'z-50 px-2 py-1 text-xs font-medium',
              'bg-gray-900 text-white rounded-md',
              'animate-fade-in whitespace-nowrap',
              className
            )}
            role="tooltip"
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};
