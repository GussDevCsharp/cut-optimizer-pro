
import { Button } from "@/components/ui/button";
import { Sparkles, RectangleHorizontal, AlignHorizontalJustifyStart, AlignVerticalJustifyStart } from 'lucide-react';
import { useSheetData } from '../hooks/useSheetData';
import { optimizeCutting, OptimizationDirection } from '../utils/optimizationAlgorithm';
import { toast } from "sonner";
import { useProjectActions } from "@/hooks/useProjectActions";
import { useLocation } from 'react-router-dom';
import { useState } from "react";
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
  const { saveProject } = useProjectActions();
  const location = useLocation();
  const [isOptimizing, setIsOptimizing] = useState(false);
  
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
    
    // Show loading dialog
    setIsOptimizing(true);
    
    try {
      // Slight delay to ensure the loading dialog is shown
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const optimizedPieces = optimizeCutting(pieces, sheet, optimizationDirection);
      setPlacedPieces(optimizedPieces);
      
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
      // Hide loading dialog
      setIsOptimizing(false);
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
          disabled={pieces.length === 0}
        >
          <Sparkles size={16} />
          Otimizar Corte
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full gap-2" 
          onClick={handleClear}
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
