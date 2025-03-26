
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isVisible: boolean;
  progress: number;
  message?: string;
  className?: string;
}

export const LoadingOverlay = ({
  isVisible,
  progress,
  message = "Otimizando cortes...",
  className
}: LoadingOverlayProps) => {
  if (!isVisible) return null;
  
  return (
    <div className={cn(
      "fixed inset-0 bg-background/90 backdrop-blur-sm z-50",
      "flex flex-col items-center justify-center",
      "transition-opacity duration-300",
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      className
    )}>
      <div className="w-[280px] md:w-[320px] space-y-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <Sparkles className="h-5 w-5 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold">{message}</h2>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Calculando a melhor disposição das peças...
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
