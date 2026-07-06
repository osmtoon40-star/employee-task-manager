import React from 'react';
import { cn } from '@/utils';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'auth-card-animate w-full max-w-[460px] bg-white dark:bg-[#111827] border border-neutral-200 dark:border-[#334155] rounded-xl shadow-lg dark:shadow-[0_24px_70px_rgba(2,6,23,0.4)] px-8 py-7',
        className
      )}
    >
      {children}
    </div>
  );
};

export default AuthCard;
