import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Laptop, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils';
import { ThemePreference, useTheme } from '@/hooks/useTheme';

interface ThemeSelectorProps {
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (t: ThemePreference) => {
    setTheme(t);
    setOpen(false);
  };

  const options = [
    { value: 'light' as ThemePreference, label: 'Light', Icon: Sun },
    { value: 'dark' as ThemePreference, label: 'Dark', Icon: Moon },
    { value: 'system' as ThemePreference, label: 'Auto', Icon: Laptop },
  ];

  const CurrentIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Laptop;

  return (
    <div className={cn('relative', className)} ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-[#334155] bg-white dark:bg-[#111827] hover:bg-neutral-50 dark:hover:bg-[#1E293B] transition-all cursor-pointer text-xs font-semibold text-neutral-700 dark:text-[#CBD5E1]"
        aria-label="Toggle theme"
      >
        <CurrentIcon className="w-3.5 h-3.5 text-neutral-500 dark:text-[#94A3B8]" />
        <span className="capitalize">{theme === 'system' ? 'Auto' : theme}</span>
        <ChevronDown className="w-3 h-3 text-neutral-400" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-2 w-32 origin-top-right bg-white dark:bg-[#111827] border border-neutral-200 dark:border-[#334155] rounded-md shadow-lg dark:shadow-[0_16px_48px_rgba(0,0,0,0.35)] z-50 py-1"
          >
            {options.map(({ value, label, Icon }) => (
              <button
                key={value}
                onClick={() => handleChange(value)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left transition-colors cursor-pointer',
                  theme === value
                    ? 'bg-blue-50 dark:bg-[#1E293B] text-blue-600 dark:text-[#93C5FD] font-semibold'
                    : 'text-neutral-700 dark:text-[#CBD5E1] hover:bg-neutral-50 dark:hover:bg-[#1E293B]'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
