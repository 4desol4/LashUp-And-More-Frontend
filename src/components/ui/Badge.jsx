import React from 'react';
import { cn } from '@/utils/helpers';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-charcoal-700 dark:text-gray-300 dark:border-charcoal-600',
    primary: 'bg-primary-100 text-primary-800 border-primary-200 dark:bg-primary-900 dark:text-primary-200 dark:border-primary-700',
    success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
    danger: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
