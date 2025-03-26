
import { Button } from "@/components/ui/button";
import { Sparkles, RectangleHorizontal, AlignHorizontalJustifyStart, AlignVerticalJustifyStart } from 'lucide-react';
import { useSheetData } from '../hooks/useSheetData';
import { optimizeCutting, OptimizationDirection } from '../utils/optimizationAlgorithm';
import { toast } from "sonner";
import { useProjectActions } from "@/hooks/useProjectActions";
import { useLocation } from 'react-router-dom';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LoadingOverlay } from './cutting-board/LoadingOverlay';

export const OptimizationControls = () => {
  const { 
    sheet, 
    pieces, 
    placedPieces, 
    setPlacedPieces, 
    projectName, 
    optimizationDirection,
    setOptimizationDirection,
    isOptimizing,
    optimizationProgress,
    setIsOptimizing,
    setOptimizationProgress
  } = useSheetData();
  const { saveProject } = useProjectActions();
  const location = useLocation();
  
  // Get projectId from URL params or location state
  const searchParams = new URLSearchParams(window.location.search);
  const projectId = location.state?.projectId || searchParams.get('projectId');
  
  const handleDirectionChange = (value: string) => {
    if (value === 'horizontal' || value === 'vertical') {
      setOptimizationDirection(value as OptimizationDirection);
    }
  };
  
  const handleOptimize = async () => {
    if (pieces.length === 0) {
      toast.error("Adicione peças antes de otimizar", {
        description: "Você precisa adicionar pelo menos uma peça para otimizar o corte."
      });
      return;
    }
    
    // Show loading indicator
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    try {
      // Simulate progress increases
      const progressInterval = setInterval(() => {
        setOptimizationProgress(prev => {
          const newProgress = prev + 5;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);
      
      // Slight delay to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const optimizedPieces = optimizeCutting(pieces, sheet, optimizationDirection);
      setPlacedPieces(optimizedPieces);
      
      // Complete the progress
      clearInterval(progressInterval);
      setOptimizationProgress(100);
      
      // Show toast with result
      const placedCount = optimizedPieces.length;
      const totalCount = pieces.reduce((total, piece) => total + piece.quantity, 0);
      
      if (placedCount === totalCount) {
        toast.success("Otimização concluída com sucesso!", {
          description: `Todas as ${totalCount} peças foram posicionadas na chapa.`
        });
      } else {
        toast.warning("Otimização parcial!", {
          description: `Foram posicionadas ${placedCount} de ${totalCount} peças na chapa.`
        });
      }
      
      // Save the project with optimized pieces
      if (projectName && projectId) {
        try {
          const projectData = {
            sheet,
            pieces,
            placedPieces: optimizedPieces
          };
          
          await saveProject(projectId, projectName, projectData);
          console.log("Project saved after optimization");
        } catch (error) {
          console.error("Error saving project after optimization:", error);
        }
      }
    } finally {
      // Hide loading indicator after a brief delay to show completion
      setTimeout(() => {
        setIsOptimizing(false);
        setOptimizationProgress(0);
      }, 500);
    }
  };
  
  const handleClear = async () => {
    setPlacedPieces([]);
    toast.info("Visualização limpa", {
      description: "Todas as peças foram removidas da visualização."
    });
    
    // Save the project with cleared placed pieces
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
      <LoadingOverlay 
        isVisible={isOptimizing} 
        progress={optimizationProgress}
      />
      
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
    </>
  );
};

export default OptimizationControls;
