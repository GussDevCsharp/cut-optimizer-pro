
import { Button } from "@/components/ui/button";
import { Sparkles, RectangleHorizontal, AlignHorizontalJustifyStart, AlignVerticalJustifyStart } from 'lucide-react';
import { useSheetData } from '../hooks/useSheetData';
import { OptimizationDirection } from '../utils/optimizationAlgorithm';
import { useToast } from "@/hooks/use-toast";
import { useProjectActions } from "@/hooks/useProjectActions";
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import OptimizationLoadingDialog from './OptimizationLoadingDialog';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const OptimizationControls = () => {
  const { 
    sheet, 
    pieces, 
    placedPieces, 
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
      const { status, progress, success, placedPieces: optimizedPieces, error, message } = event.data;
      
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

  const totalPieces = pieces.reduce((total, piece) => total + piece.quantity, 0);
  
  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Direction toggle */}
        <div className="bg-secondary rounded-md p-3">
          <p className="text-sm text-muted-foreground mb-2">Direção da otimização:</p>
          <ToggleGroup 
            type="single" 
            value={optimizationDirection} 
            onValueChange={handleDirectionChange} 
            className="justify-start"
          >
            <ToggleGroupItem value="horizontal" aria-label="Horizontal" className="flex gap-1 items-center">
              <AlignHorizontalJustifyStart size={16} />
              <span className="text-xs sm:text-sm">Horizontal</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="vertical" aria-label="Vertical" className="flex gap-1 items-center">
              <AlignVerticalJustifyStart size={16} />
              <span className="text-xs sm:text-sm">Vertical</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      
        <Button 
          className="w-full gap-2" 
          onClick={handleOptimize}
          disabled={pieces.length === 0 || isOptimizing}
        >
          <Sparkles size={16} />
          Otimizar Corte
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full gap-2" 
          onClick={handleClear}
          disabled={isOptimizing}
        >
          <RectangleHorizontal size={16} />
          Limpar Visualização
        </Button>
        
        <div className="bg-secondary rounded-md p-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total de peças:</span>
            <span className="font-medium">{totalPieces}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Tipos de peças:</span>
            <span className="font-medium">{pieces.length}</span>
          </div>
        </div>
      </div>
      
      {/* Updated loading dialog with progress */}
      <OptimizationLoadingDialog isOpen={isOptimizing} progress={optimizationProgress} />
    </>
  );
};

export default OptimizationControls;
