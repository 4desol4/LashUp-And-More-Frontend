import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

const Spinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  text = '',
  ...props 
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'border-primary-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent',
    burgundy: 'border-burgundy-600 border-t-transparent',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)} {...props}>
      <motion.div
        className={cn(
          'border-4 rounded-full animate-spin',
          sizeClasses[size],
          colorClasses[color]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {text && (
        <p className="mt-2 text-base font-three text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Spinner;