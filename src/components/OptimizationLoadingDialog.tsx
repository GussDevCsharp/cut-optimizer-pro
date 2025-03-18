
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, Timer, Clock } from "lucide-react";

interface OptimizationLoadingDialogProps {
  isOpen: boolean;
}

export const OptimizationLoadingDialog = ({ isOpen }: OptimizationLoadingDialogProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Average optimization time in seconds
  const estimatedTotalTime = 15; // Reduced to 15 seconds for better UX
  
  // Reset timer when dialog opens or closes
  useEffect(() => {
    if (isOpen) {
      setElapsedTime(0);
      setProgress(0);
    }
  }, [isOpen]);
  
  // Update timer and progress when dialog is open
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    
    if (isOpen) {
      timerId = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          // Update progress based on elapsed time relative to estimated time
          const newProgress = Math.min((newTime / estimatedTotalTime) * 100, 98);
          setProgress(newProgress);
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isOpen, estimatedTotalTime]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate remaining time
  const remainingTime = Math.max(estimatedTotalTime - elapsedTime, 0);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
            <h3 className="text-lg font-medium">Otimizando Corte</h3>
          </div>
          
          <p className="text-center text-muted-foreground">
            Calculando a melhor posição para suas peças. Isso pode levar alguns segundos...
          </p>
          
          {/* Progress bar */}
          <Progress value={progress} className="w-full" />
          
          {/* Timer and estimated time */}
          <div className="grid grid-cols-2 w-full gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span>Tempo decorrido: {formatTime(elapsedTime)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm justify-end">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Tempo restante: ~{formatTime(remainingTime)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OptimizationLoadingDialog;
