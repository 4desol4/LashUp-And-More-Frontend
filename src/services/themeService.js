class ThemeService {
  constructor() {
    this.initialized = false;
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    
   
    this.applyStoredTheme();

    this.watchThemeChanges();

    this.watchSystemTheme();
    
    this.initialized = true;
  }

  applyStoredTheme() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    
    this.setTheme(theme, false);
  }

  setTheme(theme, save = true) {
    const html = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    html.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    
    // Add new theme
    html.classList.add(theme);
    body.classList.add(theme);
    
    // Force style recalculation - CRITICAL for production
    this.forceStyleUpdate();
    
    if (save) {
      localStorage.setItem('theme', theme);
    }
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('theme-changed', { 
      detail: { theme } 
    }));
  }

  forceStyleUpdate() {
    // Multiple techniques to ensure styles are applied
    
    // 1. Force reflow
    document.body.style.display = 'none';
    document.body.offsetHeight;
    document.body.style.display = '';
    
    // 2. Update specific problematic elements
    const textElements = document.querySelectorAll('[class*="text-gray"], [class*="text-charcoal"]');
    textElements.forEach(el => {
      const originalClass = el.className;
      el.className = '';
      el.offsetHeight; // Force reflow
      el.className = originalClass;
    });
    
    // 3. Force CSS custom property updates
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    
    if (isDark) {
      root.style.setProperty('--text-primary', '#f9fafb');
      root.style.setProperty('--bg-primary', '#111827');
    } else {
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--bg-primary', '#ffffff');
    }
  }

  watchThemeChanges() {
    // Watch for class changes on document element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // Small delay to ensure theme change is complete
          setTimeout(() => this.forceStyleUpdate(), 10);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if no theme is manually set
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }

  toggleTheme() {
    const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    return next;
  }

  getCurrentTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  // Emergency fix for production text color issues
  fixTextColors() {
    const isDark = document.documentElement.classList.contains('dark');
    const problematicElements = document.querySelectorAll('*');
    
    problematicElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      const color = computedStyle.color;
      
      if (!isDark) {
        // Light mode: fix white text
        if (color === 'rgb(255, 255, 255)' || color === '#ffffff') {
          el.style.color = '#111827';
        }
      } else {
        // Dark mode: fix dark text
        if (color === 'rgb(17, 24, 39)' || color === '#111827') {
          el.style.color = '#f9fafb';
        }
      }
    });
  }
}

// Initialize immediately if in browser
let themeService = null;
if (typeof window !== 'undefined') {
  themeService = new ThemeService();
  
  // Emergency fix on page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      themeService?.fixTextColors();
    }, 100);
  });
  
  // Expose for debugging in production
  window.__themeService = themeService;
}

export default themeService;