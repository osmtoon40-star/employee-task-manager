import React, { useState, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils';

export interface PasswordInputProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  /** Show a strength meter below the field */
  showStrength?: boolean;
}

const getStrength = (pw: string): { level: 0 | 1 | 2 | 3 | 4; label: string; color: string } => {
  if (!pw) return { level: 0, label: '', color: '' };
  if (pw.length < 8) {
    return { level: 1, label: 'Too weak', color: 'bg-red-500' };
  }

  let score = 0;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: 1, label: 'Too weak', color: 'bg-red-500' };
  if (score === 2) return { level: 2, label: 'Weak', color: 'bg-orange-400' };
  if (score === 3) return { level: 3, label: 'Good', color: 'bg-amber-400' };
  return { level: 4, label: 'Strong', color: 'bg-green-500' };
};

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  placeholder = 'Enter password',
  autoComplete = 'current-password',
  disabled = false,
  inputRef,
  showStrength = false,
}) => {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const inputId = id || generatedId;

  const strength = showStrength ? getStrength(value) : null;

  return (
    <div className="w-full space-y-1 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[14px] font-semibold text-neutral-800 dark:text-[#F8FAFC]"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          ref={inputRef}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-invalid={!!error}
          className={cn(
            'w-full pl-3.5 pr-10 py-2.5 text-[15px] bg-white dark:bg-[#111827] border rounded-lg shadow-sm transition-all duration-200',
            'placeholder-neutral-400 dark:placeholder-[#94A3B8] text-neutral-900 dark:text-[#F8FAFC]',
            'focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500',
            'hover:border-neutral-400 dark:hover:border-neutral-600',
            'disabled:opacity-50 disabled:pointer-events-none',
            error
              ? 'border-red-400 dark:border-red-600 focus:ring-red-500/20'
              : 'border-neutral-300 dark:border-[#334155] focus:ring-blue-500/20'
          )}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Strength meter */}
      {showStrength && value && strength && (
        <div className="space-y-1 pt-0.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(seg => (
              <div
                key={seg}
                className={cn(
                  'h-[3px] flex-1 rounded-full transition-all duration-300',
                  strength.level >= seg ? strength.color : 'bg-neutral-200 dark:bg-[#334155]'
                )}
              />
            ))}
          </div>
          <p className={cn(
            'text-[12px] font-medium',
            strength.level <= 1 ? 'text-red-500' :
            strength.level === 2 ? 'text-orange-400' :
            strength.level === 3 ? 'text-amber-500' :
            'text-green-500'
          )}>
            {strength.label}
          </p>
        </div>
      )}

      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-[12px] font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
