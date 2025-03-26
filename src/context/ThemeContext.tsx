
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

// Define the Attribute type that next-themes expects
type Attribute = "class" | "data-theme" | "data-mode";

// Define the ValueObject type that next-themes expects for the value prop
interface ValueObject {
  [themeName: string]: string;
}

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  attribute?: Attribute | Attribute[];
  value?: ValueObject;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  forcedTheme?: string;
  enableColorScheme?: boolean;
};

type ThemeProviderContextProps = {
  theme: string | undefined;
  setTheme: (theme: string) => void;
};

export const ThemeProviderContext = createContext<ThemeProviderContextProps>({
  theme: undefined,
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
