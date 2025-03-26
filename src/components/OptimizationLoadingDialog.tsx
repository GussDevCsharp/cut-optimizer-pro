
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, Timer } from "lucide-react";

interface OptimizationLoadingDialogProps {
  isOpen: boolean;
  progress?: number;
  message?: string;
}

export const OptimizationLoadingDialog = ({ 
  isOpen, 
  progress = 0, 
  message = "Calculando a melhor posição para suas peças..."
}: OptimizationLoadingDialogProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Reset timer when dialog opens
  useEffect(() => {
    if (isOpen) {
      setElapsedTime(0);
    }
  }, [isOpen]);
  
  // Update timer when dialog is open
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (isOpen) {
      timerId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isOpen]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate estimated remaining time based on progress and elapsed time
  const calculateRemainingTime = (): string => {
    if (progress <= 0) return "--:--";
    
    const totalEstimatedTime = elapsedTime / (progress / 100);
    const remainingSeconds = Math.max(0, Math.round(totalEstimatedTime - elapsedTime));
    return formatTime(remainingSeconds);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
            <h3 className="text-lg font-medium">Otimizando Corte</h3>
          </div>
          
          <p className="text-center text-muted-foreground">
            {message}
          </p>
          
          {/* Progress bar */}
          <Progress value={progress} className="w-full" />
          
          {/* Progress percentage */}
          <p className="text-sm font-medium">{Math.round(progress)}%</p>
          
          {/* Timer */}
          <div className="flex items-center gap-2 text-sm">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span>Tempo: {formatTime(elapsedTime)} {progress > 0 && `(Restante: ~${calculateRemainingTime()})`}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OptimizationLoadingDialog;
