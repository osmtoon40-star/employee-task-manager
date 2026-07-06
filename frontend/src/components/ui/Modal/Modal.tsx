import React from 'react';
import { cn } from '@/utils';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const Modal: React.FC<ModalProps> = ({
  className = '',
  isOpen,
  onClose,
  title,
  children,
  ...props
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative bg-white dark:bg-[#111827] border border-neutral-200 dark:border-[#334155] w-full max-w-lg rounded-xl shadow-xl dark:shadow-[0_30px_80px_rgba(2,6,23,0.55)] z-10 flex flex-col overflow-hidden max-h-[90vh]',
              className
            )}
            {...(props as any)}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-[#334155] shrink-0">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-[#F8FAFC]">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#1E293B] hover:text-neutral-600 dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
