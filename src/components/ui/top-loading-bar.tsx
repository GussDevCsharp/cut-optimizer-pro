
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface TopLoadingBarProps {
  isLoading: boolean;
  progress?: number;
  color?: string;
  height?: number;
  className?: string;
}

export const TopLoadingBar = ({
  isLoading,
  progress = 0,
  color = "bg-primary",
  height = 3,
  className
}: TopLoadingBarProps) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      // Small delay before hiding to allow animation to complete
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  if (!visible && !isLoading) return null;
  
  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-opacity duration-300",
        isLoading ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <div 
        className={cn(color, "h-[3px] transition-all ease-out")}
        style={{ 
          height: `${height}px`, 
          width: `${progress}%`,
          transitionDuration: '0.2s'
        }}
      />
    </div>
  );
};

export default TopLoadingBar;
