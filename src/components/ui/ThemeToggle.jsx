import { motion } from 'framer-motion';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/helpers';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200',
        'bg-gray-100 hover:bg-gray-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-charcoal-900',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          opacity: 1,
        }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <HiMoon className="w-5 h-5 text-yellow-400" />
        ) : (
          <HiSun className="w-5 h-5 text-orange-500" />
        )}
      </motion.div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {isDark ? 'Light mode' : 'Dark mode'}
      </div>
    </motion.button>
  );
};

export default ThemeToggle;