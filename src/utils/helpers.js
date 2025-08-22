import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge Tailwind classes
export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Generate random ID
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, length + 2);
};

// Truncate text
export const truncate = (str, length = 100) => {
  if (str.length <= length) return str;
  return str.substring(0, length).trim() + '...';
};

// Sleep function for delays
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Check if image exists
export const imageExists = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

// Get image with fallback
export const getImageWithFallback = (primaryUrl, fallbackUrl) => {
  return imageExists(primaryUrl).then(exists => 
    exists ? primaryUrl : fallbackUrl
  );
};

// Scroll to element
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Check if element is in viewport
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Get device type
export const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Check if mobile device
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// Local storage helpers with error handling
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} to localStorage:`, error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Array helpers
export const arrayHelpers = {
  // Remove duplicates from array
  unique: (array, key = null) => {
    if (!key) return [...new Set(array)];
    return array.filter((item, index, self) => 
      index === self.findIndex(t => t[key] === item[key])
    );
  },
  
  // Group array by key
  groupBy: (array, key) => {
    return array.reduce((result, item) => {
      const group = item[key];
      if (!result[group]) result[group] = [];
      result[group].push(item);
      return result;
    }, {});
  },
  
  // Sort array by key
  sortBy: (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
  },
  
  // Shuffle array
  shuffle: (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
};

// URL helpers
export const urlHelpers = {
  // Get query parameters
  getParams: () => {
    return new URLSearchParams(window.location.search);
  },
  
  // Get specific query parameter
  getParam: (key) => {
    return new URLSearchParams(window.location.search).get(key);
  },
  
  // Build URL with parameters
  buildUrl: (base, params) => {
    const url = new URL(base, window.location.origin);
    Object.keys(params).forEach(key => 
      url.searchParams.append(key, params[key])
    );
    return url.toString();
  }
};