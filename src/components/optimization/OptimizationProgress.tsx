
import React, { useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface OptimizationProgressProps {
  isOptimizing: boolean;
  optimizationProgress: number;
  startOptimization: (callbacks?: {
    onProgressUpdate?: (iteration: number, totalIterations: number) => void;
    onFinish?: () => void;
  }) => void;
  stopOptimization: () => Promise<void>;
  setOptimizationProgress: (value: number) => void;
}

export const OptimizationProgress: React.FC<OptimizationProgressProps> = ({
  isOptimizing,
  optimizationProgress,
  startOptimization,
  stopOptimization,
  setOptimizationProgress,
}) => {
  const { toast } = useToast();

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
    <>
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
    </>
  );
};
