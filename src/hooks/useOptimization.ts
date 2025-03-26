
import { useState, useRef, useEffect } from "react";
import { useSheetData } from './useSheetData';
import { useToast } from "@/hooks/use-toast";
import { useProjectActions } from "@/hooks/useProjectActions";
import { useLocation } from 'react-router-dom';
import { OptimizationDirection } from '../utils/optimizationAlgorithm';

export const useOptimization = () => {
  const { 
    sheet, 
    pieces, 
    setPlacedPieces, 
    projectName, 
    optimizationDirection,
    setOptimizationDirection
  } = useSheetData();
  const { toast } = useToast();
  const { saveProject } = useProjectActions();
  const location = useLocation();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  
  // Get projectId from URL params or location state
  const searchParams = new URLSearchParams(window.location.search);
  const projectId = location.state?.projectId || searchParams.get('projectId');
  
  // Initialize the worker
  useEffect(() => {
    // Terminate previous worker if it exists
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    
    // Create a new worker
    workerRef.current = new Worker(
      new URL('../workers/optimizationWorker.ts', import.meta.url),
      { type: 'module' }
    );
    
    // Set up listeners
    workerRef.current.addEventListener('message', (event) => {
      const { status, progress, success, placedPieces: optimizedPieces, error } = event.data;
      
      switch (status) {
        case 'ready':
          console.log('Worker initialized and ready');
          break;
          
        case 'processing':
          setOptimizationProgress(progress || 0);
          break;
          
        case 'complete':
          if (success && optimizedPieces) {
            setPlacedPieces(optimizedPieces);
            setIsOptimizing(false);
            
            // Success feedback
            const placedCount = optimizedPieces.length;
            const totalCount = pieces.reduce((total, piece) => total + piece.quantity, 0);
            
            toast({
              title: "Otimização concluída com sucesso!",
              description: `${placedCount} de ${totalCount} peças foram posicionadas na chapa.`,
            });
            
            // Save project after optimization
            if (projectName && projectId) {
              saveProject(projectId, projectName, {
                sheet,
                pieces,
                placedPieces: optimizedPieces
              }).catch(error => {
                console.error("Error saving project after optimization:", error);
              });
            }
          }
          break;
          
        case 'error':
          setIsOptimizing(false);
          toast({
            title: "Erro na otimização",
            description: error || "Ocorreu um erro ao otimizar o corte.",
            variant: "destructive",
          });
          break;
      }
    });
    
    workerRef.current.addEventListener('error', (error) => {
      console.error('Worker error:', error);
      setIsOptimizing(false);
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao executar a otimização.",
        variant: "destructive",
      });
    });
    
    // Clean up worker on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [pieces, sheet, projectName, projectId, setPlacedPieces, toast, saveProject]);
  
  const handleDirectionChange = (value: string) => {
    if (value === 'horizontal' || value === 'vertical') {
      setOptimizationDirection(value as OptimizationDirection);
    }
  };
  
  const handleOptimize = async () => {
    if (pieces.length === 0) {
      toast({
        title: "Adicione peças antes de otimizar",
        description: "Você precisa adicionar pelo menos uma peça para otimizar o corte.",
        variant: "destructive",
      });
      return;
    }
    
    if (!workerRef.current) {
      toast({
        title: "Erro no processamento",
        description: "Não foi possível iniciar o processo de otimização.",
        variant: "destructive",
      });
      return;
    }
    
    // Show loading dialog and reset progress
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    // Send data to worker
    workerRef.current.postMessage({
      pieces,
      sheet,
      direction: optimizationDirection
    });
  };
  
  const handleClear = async () => {
    setPlacedPieces([]);
    toast({
      title: "Visualização limpa",
      description: "Todas as peças foram removidas da visualização.",
    });
    
    // Save project with cleared pieces
    if (projectName && projectId) {
      try {
        await saveProject(projectId, projectName, {
          sheet,
          pieces,
          placedPieces: []
        });
      } catch (error) {
        console.error("Error saving project after clearing:", error);
      }
    }
  };

  return {
    isOptimizing,
    optimizationProgress,
    optimizationDirection,
    handleDirectionChange,
    handleOptimize,
    handleClear,
    pieces
  };
};
