import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  items: { label: string; onClick: () => void; danger?: boolean }[];
}

export const Dropdown: React.FC<DropdownProps> = ({
  className = '',
  trigger,
  items,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className={cn('relative inline-block text-left', className)} ref={containerRef} {...(props as any)}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-[#111827] border border-neutral-200 dark:border-[#334155] rounded-md shadow-lg dark:shadow-[0_16px_48px_rgba(0,0,0,0.35)] z-30 focus:outline-none py-1"
          >
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-[#CBD5E1] hover:bg-neutral-50 dark:hover:bg-[#1E293B] transition-colors cursor-pointer',
                  item.danger && 'text-red-650 dark:text-rose-300 hover:bg-red-50 dark:hover:bg-rose-500/10'
                )}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
