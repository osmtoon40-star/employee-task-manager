import React from 'react';
import { cn } from '@/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({
  className = '',
  src,
  name,
  size = 'md',
  ...props
}) => {
  const [error, setError] = React.useState<boolean>(false);

  const sizes = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  const getInitials = (n: string) => {
    const parts = n.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return n.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className={cn(
        'relative shrink-0 flex items-center justify-center rounded-full overflow-hidden bg-blue-50 text-blue-750 dark:bg-[#1E293B] dark:text-[#CBD5E1] font-bold border border-neutral-100 dark:border-[#334155]',
        sizes[size],
        className
      )}
      {...props}
    >
      {src && !error ? (
        <img
          src={src}
          alt={name}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;
