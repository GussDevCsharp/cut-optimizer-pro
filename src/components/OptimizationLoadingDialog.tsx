
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface OptimizationLoadingDialogProps {
  isOpen: boolean;
}

export const OptimizationLoadingDialog = ({ isOpen }: OptimizationLoadingDialogProps) => {
  const [progress, setProgress] = useState(10);
  
  useEffect(() => {
    if (isOpen) {
      // Reset progress when dialog opens
      setProgress(10);
      
      // Create a global listener for progress updates
      const handleProgressUpdate = (e: any) => {
        if (e.detail && typeof e.detail.progress === 'number') {
          setProgress(e.detail.progress);
        }
      };
      
      // Listen for progress events 
      window.addEventListener('optimization-progress', handleProgressUpdate);
      
      // Increment progress periodically to provide visual feedback
      const interval = setInterval(() => {
        setProgress(prev => {
          // Increment based on current progress to simulate slowing down
          // as the process continues
          if (prev < 90) {
            return prev + (90 - prev) / 10;
          }
          return prev;
        });
      }, 500);
      
      return () => {
        window.removeEventListener('optimization-progress', handleProgressUpdate);
        clearInterval(interval);
      };
    }
  }, [isOpen]);
  
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Otimizando Corte</DialogTitle>
        <DialogDescription>
          Calculando a melhor posição para suas peças. Isso pode levar alguns segundos...
        </DialogDescription>
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
            <span>{Math.round(progress)}% concluído</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OptimizationLoadingDialog;
