import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSheetData } from '@/hooks/useSheetData';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface OptimizationControlsProps {
  className?: string;
}

export const OptimizationControls: React.FC<OptimizationControlsProps> = ({ className }) => {
  const {
    startOptimization,
    stopOptimization,
    isOptimizing,
    optimizationProgress,
    setOptimizationTimeLimit,
    optimizationTimeLimit,
  } = useSheetData();
  const { toast } = useToast();
  const [inputTimeLimit, setInputTimeLimit] = useState(optimizationTimeLimit.toString());
  const debouncedTimeLimit = useDebounce(inputTimeLimit, 500);

  // Update the time limit when the debounced value changes
  React.useEffect(() => {
    const newTimeLimit = parseInt(debouncedTimeLimit, 10);
    if (!isNaN(newTimeLimit) && newTimeLimit !== optimizationTimeLimit) {
      setOptimizationTimeLimit(newTimeLimit);
    }
  }, [debouncedTimeLimit, setOptimizationTimeLimit, optimizationTimeLimit]);

  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setInputTimeLimit(value);
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira apenas números.",
      });
    }
  };

  const onStartOptimization = useCallback(async () => {
    try {
      toast({
        title: "Otimização",
        description: "Otimização iniciada. Isso pode levar alguns minutos...",
      });
      
      startOptimization({
        onProgressUpdate: (iteration: number, totalIterations: number) => {
          setOptimizationProgress(0); // Initialize to 0 at the start of optimization
          const newProgress = Math.min((iteration / totalIterations) * 100, 95);
          setOptimizationProgress(newProgress);
        },
        onFinish: () => {
          toast({
            title: "Otimização Concluída",
            description: "Otimização concluída com sucesso!",
          });
        },
      });
    } catch (error: any) {
      console.error("Optimization failed:", error);
      toast({
        variant: "destructive",
        title: "Erro na Otimização",
        description: "Otimização falhou. Por favor, tente novamente.",
      });
    }
  }, [startOptimization, toast, setOptimizationProgress]);

  const onStopOptimization = useCallback(async () => {
    try {
      await stopOptimization();
      toast({
        title: "Otimização",
        description: "Otimização interrompida pelo usuário.",
      });
    } catch (error: any) {
      console.error("Failed to stop optimization:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao interromper a otimização.",
      });
    }
  }, [stopOptimization, toast]);

  return (
    <div className={cn("flex flex-col gap-4 p-4 border rounded-md", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor="time-limit">Tempo Limite (segundos)</Label>
        <Input
          type="number"
          id="time-limit"
          placeholder="Tempo Limite"
          value={inputTimeLimit}
          onChange={handleTimeLimitChange}
          className="w-32 text-right"
          min="1"
        />
      </div>
      
      {isOptimizing ? (
        <>
          <Progress value={optimizationProgress} />
          <Button variant="destructive" onClick={onStopOptimization} disabled={!isOptimizing}>
            Parar Otimização
          </Button>
        </>
      ) : (
        <Button onClick={onStartOptimization} disabled={isOptimizing}>
          Otimizar
        </Button>
      )}
    </div>
  );
};
