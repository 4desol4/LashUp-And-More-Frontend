import { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

export const useThemeForceUpdate = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // Force update all text elements on theme change
    const forceTextColorUpdate = () => {
      // Get all elements that might have text color classes
      const elements = document.querySelectorAll('[class*="text-"]');
      
      elements.forEach(element => {
        const classes = element.className;
        
        // Force re-evaluation of text color classes
        if (classes.includes('text-charcoal') || classes.includes('text-gray')) {
          element.className = element.className; // Force re-render
          
          // If in light mode, ensure dark text colors
          if (theme === 'light') {
            if (classes.includes('text-white')) {
              element.style.color = '#111827'; // Force dark text
            }
          } else {
            // Dark mode - ensure light text
            if (classes.includes('text-charcoal-') || classes.includes('text-gray-9')) {
              element.style.color = '#f9fafb'; // Force light text
            }
          }
        }
      });
    };

    // Run immediately
    forceTextColorUpdate();

    // Run after a small delay to catch any late-rendering elements
    const timeoutId = setTimeout(forceTextColorUpdate, 100);

    return () => clearTimeout(timeoutId);
  }, [theme]);
};

// Alternative: Global theme listener
export const initThemeForceUpdate = () => {
  const handleThemeChange = (event) => {
    const { theme } = event.detail;
    
    // Force repaint all elements
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      const computed = window.getComputedStyle(element);
      const color = computed.color;
      
      // If text is white in light mode, fix it
      if (theme === 'light' && (color === 'rgb(255, 255, 255)' || color === '#ffffff')) {
        element.style.color = '#111827';
      }
      // If text is dark in dark mode, fix it  
      else if (theme === 'dark' && (color === 'rgb(17, 24, 39)' || color === '#111827')) {
        element.style.color = '#f9fafb';
      }
    });
  };

  window.addEventListener('themeChanged', handleThemeChange);
  
  return () => {
    window.removeEventListener('themeChanged', handleThemeChange);
  };
};