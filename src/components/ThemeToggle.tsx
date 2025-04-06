
import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'default' | 'outline' | 'ghost' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  iconSize?: number;
  className?: string;
}

export function ThemeToggle({
  variant = 'ghost',
  size = 'md',
  showTooltip = true,
  iconSize = 1.2,
  className,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  
  // Size mappings for button
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-10 h-10',
  };
  
  // Variant mappings
  const variantClasses = {
    default: 'bg-secondary hover:bg-secondary/80',
    outline: 'border border-border hover:bg-accent',
    ghost: 'hover:bg-accent',
    'icon-only': 'p-0 hover:bg-transparent',
  };
  
  const buttonContent = (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Sun icon with enhanced animations */}
      <Sun 
        className={cn(
          "absolute transition-all duration-500",
          isDark ? "opacity-0 scale-0 rotate-[-90deg] translate-y-4" : "opacity-100 scale-100 rotate-0 translate-y-0",
          "animate-in"
        )}
        size={iconSize * 16}
      />
      
      {/* Moon icon with enhanced animations */}
      <Moon 
        className={cn(
          "absolute transition-all duration-500",
          isDark ? "opacity-100 scale-100 rotate-0 translate-y-0" : "opacity-0 scale-0 rotate-90 -translate-y-4",
          "animate-in"
        )}
        size={iconSize * 16}
      />
    </div>
  );
  
  const toggleButton = (
    <Button 
      variant={variant === 'icon-only' ? 'ghost' : variant}
      size="icon" 
      onClick={toggleTheme}
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        "rounded-full relative overflow-hidden transition-colors duration-300",
        "focus-visible:ring-1 focus-visible:ring-offset-1",
        className
      )}
      aria-label={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
    >
      <span className="sr-only">Alternar tema</span>
      {buttonContent}
    </Button>
  );
  
  if (!showTooltip) {
    return toggleButton;
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {toggleButton}
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        align="center"
        className="font-medium transition-all duration-300 animate-in fade-in-50 data-[state=closed]:animate-out data-[state=closed]:fade-out-50"
      >
        <p>Mudar para tema {isDark ? 'claro' : 'escuro'}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default ThemeToggle;
