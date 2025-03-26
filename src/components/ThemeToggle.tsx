
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
            className="w-9 h-9 rounded-full hover:bg-accent"
          >
            <Sun 
              className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all 
                         dark:rotate-90 dark:scale-0" 
            />
            <Moon 
              className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 
                         transition-all dark:rotate-0 dark:scale-100" 
            />
            <span className="sr-only">Alternar tema</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Mudar para tema {theme === 'dark' ? 'claro' : 'escuro'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ThemeToggle;
