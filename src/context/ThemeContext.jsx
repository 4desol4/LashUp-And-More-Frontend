import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {

    if (typeof window === "undefined") return "light";
    
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;


    root.classList.remove("light", "dark");
    body.classList.remove("light", "dark");
    
  
    root.classList.add(theme);
    body.classList.add(theme);


    if (theme === "dark") {
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--bg-color', '#000000');
      root.style.setProperty('--text-secondary', '#9ca3af');
    } else {
      root.style.setProperty('--text-color', '#1f2937');
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--text-secondary', '#6b7280');
    }

    localStorage.setItem("theme", theme);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = theme === "light" ? "#ffffff" : "#000000";
    }

    // Force repaint to ensure styles apply
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const setLightTheme = () => setTheme("light");
  const setDarkTheme = () => setTheme("dark");

  const value = {
    theme,
    isDark: theme === "dark",
    isLight: theme === "light",
    toggleTheme,
    setLightTheme,
    setDarkTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};