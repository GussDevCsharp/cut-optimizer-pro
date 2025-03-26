
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Puzzle, Scissors, Sparkles, RectangleHorizontal, LayoutHorizontal, LayoutVertical } from 'lucide-react';
import { useSheetData, Piece } from '../hooks/useSheetData';
import { PieceForm } from './pieces-panel/PieceForm';
import { ImportPiecesForm } from './pieces-panel/ImportPiecesForm';
import { optimizeCutting, OptimizationDirection } from '../utils/optimizationAlgorithm';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useProjectActions } from "@/hooks/useProjectActions";
import { useLocation } from 'react-router-dom';
import { useState } from "react";
import OptimizationLoadingDialog from './OptimizationLoadingDialog';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const PiecesAndOptimizationPanel = () => {
  const { 
    sheet, 
    pieces, 
    placedPieces, 
    setPlacedPieces, 
    projectName, 
    addPiece, 
    updatePiece, 
    removePiece,
    optimizationDirection,
    setOptimizationDirection
  } = useSheetData();
  const { saveProject } = useProjectActions();
  const location = useLocation();
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const searchParams = new URLSearchParams(window.location.search);
  const projectId = location.state?.projectId || searchParams.get('projectId');

  const handleImportPieces = (importedPieces: Piece[]) => {
    importedPieces.forEach(piece => {
      addPiece(piece);
    });
  };
  
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
    
    setIsOptimizing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const optimizedPieces = optimizeCutting(pieces, sheet, optimizationDirection);
      setPlacedPieces(optimizedPieces);
      
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
      setIsOptimizing(false);
    }
  };
  
  const handleClear = async () => {
    setPlacedPieces([]);
    toast.info("Visualização limpa", {
      description: "Todas as peças foram removidas da visualização."
    });
    
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
      <Card className="w-full shadow-subtle border animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Puzzle size={18} />
              <Scissors size={18} />
              <span>Peças e Otimização</span>
            </div>
          </CardTitle>
          <CardDescription>
            Adicione peças e otimize o corte de chapas
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <ImportPiecesForm onImportPieces={handleImportPieces} />
          </div>
          
          <PieceForm onAddPiece={addPiece} projectId={projectId} />
          
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
                <LayoutHorizontal size={16} />
                <span className="text-xs sm:text-sm">Horizontal</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="vertical" aria-label="Vertical" className="flex gap-1 items-center">
                <LayoutVertical size={16} />
                <span className="text-xs sm:text-sm">Vertical</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              className="flex-1 gap-2" 
              onClick={handleOptimize}
              disabled={pieces.length === 0}
            >
              <Sparkles size={16} />
              Otimizar Corte
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 gap-2" 
              onClick={handleClear}
            >
              <RectangleHorizontal size={16} />
              Limpar
            </Button>
          </div>
          
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
        </CardContent>
      </Card>
      
      <OptimizationLoadingDialog isOpen={isOptimizing} />
    </>
  );
};

export default PiecesAndOptimizationPanel;
