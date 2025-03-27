
import * as React from 'react';

type Theme = 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'melhor-corte-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  
  // Initialize theme from localStorage safely
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem(storageKey);
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
          setTheme(savedTheme as Theme);
        }
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
  }, [defaultTheme, storageKey]);

  // Apply theme changes to document and localStorage
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const root = window.document.documentElement;
        
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        
        localStorage.setItem(storageKey, theme);
      }
    } catch (e) {
      console.error('Error accessing localStorage or DOM:', e);
    }
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => setTheme(theme),
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
