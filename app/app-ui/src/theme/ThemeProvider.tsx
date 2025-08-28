import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeMode, lightTheme, darkTheme } from './theme';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    // Load theme from localStorage if available
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    setTheme(savedTheme === 'dark' ? darkTheme : lightTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme.mode === 'light' ? darkTheme : lightTheme;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme.mode);
    applyThemeVariables(newTheme);
  };

  const applyThemeVariables = (theme: Theme) => {
    document.documentElement.style.setProperty('--primary-color', theme.palette.primary);
    document.documentElement.style.setProperty('--background-color', theme.palette.background);
    document.documentElement.style.setProperty('--text-color', theme.palette.text);
  };

  useEffect(() => {
    applyThemeVariables(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
