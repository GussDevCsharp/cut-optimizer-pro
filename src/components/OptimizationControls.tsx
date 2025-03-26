
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
  const workerRef = useRef<Worker | null>(null);
  
  // Get projectId from URL params or location state
  const searchParams = new URLSearchParams(window.location.search);
  const projectId = location.state?.projectId || searchParams.get('projectId');
  
  // Inicializa o worker
  useEffect(() => {
    // Cria o worker apenas uma vez
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/optimizationWorker.ts', import.meta.url),
        { type: 'module' }
      );
      
      // Define os listeners para o worker
      workerRef.current.addEventListener('message', (event) => {
        if (event.data.status === 'ready') {
          console.log('Worker inicializado e pronto');
        } else if (event.data.success === true) {
          setPlacedPieces(event.data.placedPieces);
          setIsOptimizing(false);
          
          // Feedback de sucesso
          const placedCount = event.data.placedPieces.length;
          const totalCount = pieces.reduce((total, piece) => total + piece.quantity, 0);
          
          if (placedCount === totalCount) {
            toast({
              title: "Otimização concluída com sucesso!",
              description: `Todas as ${totalCount} peças foram posicionadas na chapa.`,
            });
          } else {
            toast({
              title: "Otimização parcial!",
              description: `Foram posicionadas ${placedCount} de ${totalCount} peças na chapa.`,
              variant: "destructive",
            });
          }
          
          // Salva o projeto após a otimização
          if (projectName && projectId) {
            saveProject(projectId, projectName, {
              sheet,
              pieces,
              placedPieces: event.data.placedPieces
            }).catch(error => {
              console.error("Error saving project after optimization:", error);
            });
          }
        } else if (event.data.success === false) {
          setIsOptimizing(false);
          toast({
            title: "Erro na otimização",
            description: event.data.error || "Ocorreu um erro ao otimizar o corte.",
            variant: "destructive",
          });
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
    }
    
    // Limpa o worker ao desmontar o componente
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
    
    // Mostra o diálogo de carregamento
    setIsOptimizing(true);
    
    // Envia os dados para o worker
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
    
    // Salva o projeto com as peças removidas
    if (projectName && projectId) {
      try {
        const projectData = {
          sheet,
          pieces,
          placedPieces: []
        };
        
        await saveProject(projectId, projectName, projectData);
        console.log("Project saved after clearing");
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
      
      {/* Loading dialog */}
      <OptimizationLoadingDialog isOpen={isOptimizing} />
    </>
  );
};

export default OptimizationControls;
