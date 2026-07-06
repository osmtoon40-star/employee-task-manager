import React from 'react';
import { cn } from '@/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  className = '',
  label,
  error,
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || React.useId();

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-[13px] font-medium text-neutral-500 dark:text-[#CBD5E1]">
          {label}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        className={cn(
          'w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] border border-neutral-200 dark:border-[#334155] rounded-md shadow-sm transition-all placeholder-neutral-400 dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-[#60A5FA] disabled:opacity-50 disabled:pointer-events-none dark:text-[#F8FAFC]',
          error && 'border-red-550 dark:border-rose-500 focus:ring-red-500/20 focus:border-red-650 dark:focus:border-rose-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-[12px] font-medium text-red-600 dark:text-rose-300">{error}</p>}
    </div>
  );
};

export default Input;
