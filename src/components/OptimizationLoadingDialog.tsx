
import React, { useState, useEffect, useRef } from 'react';
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
  const timerRef = useRef<number | null>(null);
  const progressRef = useRef(5);
  const startTimeRef = useRef<number | null>(null);
  
  // Update the ref whenever progress changes
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  
  useEffect(() => {
    if (isOpen) {
      // Only initialize progress and timer if this is a new optimization
      if (!startTimeRef.current) {
        progressRef.current = 5;
        setProgress(5);
        startTimeRef.current = Date.now();
        setTimeElapsed(0);
      }
      
      setShowCancelOption(false);
      
      // Create a global listener for progress updates
      const handleProgressUpdate = (e: CustomEvent) => {
        if (e.detail && typeof e.detail.progress === 'number') {
          setProgress(e.detail.progress);
        }
      };
      
      // Listen for progress events 
      window.addEventListener('optimization-progress', handleProgressUpdate as EventListener);
      
      // Timer to show elapsed time
      timerRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          const newTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setTimeElapsed(newTime);
          
          // Show cancel option after 10 seconds
          if (newTime >= 10 && !showCancelOption) {
            setShowCancelOption(true);
          }
        }
      }, 1000);
      
      return () => {
        window.removeEventListener('optimization-progress', handleProgressUpdate as EventListener);
        
        // Only clear timer if dialog is closed
        if (!isOpen && timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    } else {
      // Reset timer and progress when dialog is fully closed
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Reset start time reference when optimization is done
      startTimeRef.current = null;
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
