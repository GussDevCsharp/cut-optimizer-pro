
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OptimizationLoadingDialogProps {
  isOpen: boolean;
  onCancel?: () => void;
}

export const OptimizationLoadingDialog = ({ isOpen, onCancel }: OptimizationLoadingDialogProps) => {
  const [progress, setProgress] = useState(5);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showCancelOption, setShowCancelOption] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      // Reset progress and timers when dialog opens
      setProgress(5);
      setTimeElapsed(0);
      setShowCancelOption(false);
      
      // Create a global listener for progress updates
      const handleProgressUpdate = (e: CustomEvent) => {
        if (e.detail && typeof e.detail.progress === 'number') {
          setProgress(e.detail.progress);
        }
      };
      
      // Listen for progress events 
      window.addEventListener('optimization-progress', handleProgressUpdate as EventListener);
      
      // Timer to show estimated time
      const timer = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          // Show cancel option after 10 seconds
          if (newTime >= 10 && !showCancelOption) {
            setShowCancelOption(true);
          }
          return newTime;
        });
      }, 1000);
      
      return () => {
        window.removeEventListener('optimization-progress', handleProgressUpdate as EventListener);
        clearInterval(timer);
      };
    }
  }, [isOpen, showCancelOption]);
  
  // Format time elapsed
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Otimizando Corte</DialogTitle>
        <DialogDescription>
          Calculando a melhor posição para suas peças. Este processo pode levar algum tempo dependendo da quantidade de peças.
        </DialogDescription>
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
            <span>{Math.round(progress)}% concluído</span>
          </div>
          <Progress value={progress} className="w-full" />
          
          <div className="text-sm text-muted-foreground">
            Tempo decorrido: {formatTime(timeElapsed)}
          </div>
          
          {showCancelOption && onCancel && (
            <Button variant="outline" onClick={onCancel} className="mt-2">
              Cancelar Otimização
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OptimizationLoadingDialog;
