
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className={cn(
              "w-9 h-9 rounded-full relative overflow-hidden transition-colors duration-300",
              "hover:bg-accent focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
            aria-label="Alternar tema"
          >
            <span className="sr-only">Alternar tema</span>
            
            {/* Sun icon with enhanced animations */}
            <Sun 
              className={cn(
                "absolute h-[1.2rem] w-[1.2rem] transition-all duration-500",
                "dark:opacity-0 dark:scale-50 dark:rotate-[-40deg] dark:translate-y-2",
                "opacity-100 scale-100 rotate-0 translate-y-0"
              )}
            />
            
            {/* Moon icon with enhanced animations */}
            <Moon 
              className={cn(
                "absolute h-[1.2rem] w-[1.2rem] transition-all duration-500",
                "opacity-0 scale-50 rotate-40 -translate-y-2",
                "dark:opacity-100 dark:scale-100 dark:rotate-0 dark:translate-y-0"
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="font-medium transition-all duration-300"
        >
          <p>Mudar para tema {theme === 'dark' ? 'claro' : 'escuro'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ThemeToggle;
