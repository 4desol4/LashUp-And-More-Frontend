import React, { forwardRef } from 'react';
import { cn } from '@/utils/helpers';

const Card = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-white dark:bg-charcoal-800 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700 transition-colors duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;