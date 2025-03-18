
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Puzzle, Scissors, Sparkles, RectangleHorizontal, Upload, Plus } from 'lucide-react';
import { useSheetData, Piece } from '../hooks/useSheetData';
import { PieceForm } from './pieces-panel/PieceForm';
import { PiecesList } from './pieces-panel/PiecesList';
import { ImportPiecesForm } from './pieces-panel/ImportPiecesForm';
import { optimizeCutting } from '../utils/optimizationAlgorithm';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useProjectActions } from "@/hooks/useProjectActions";
import { useLocation } from 'react-router-dom';
import { useState } from "react";
import OptimizationLoadingDialog from './OptimizationLoadingDialog';

export const PiecesAndOptimizationPanel = () => {
  const { sheet, pieces, placedPieces, setPlacedPieces, projectName, addPiece, updatePiece, removePiece } = useSheetData();
  const { saveProject } = useProjectActions();
  const location = useLocation();
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Get the projectId from URL params or location state
  const searchParams = new URLSearchParams(window.location.search);
  const projectId = location.state?.projectId || searchParams.get('projectId');

  const handleImportPieces = (importedPieces: Piece[]) => {
    // Add each imported piece
    importedPieces.forEach(piece => {
      addPiece(piece);
    });
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
      
      // Run optimization algorithm
      const optimizedPieces = optimizeCutting(pieces, sheet);
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
          {/* Import Pieces Button */}
          <div className="flex items-center justify-between">
            <ImportPiecesForm onImportPieces={handleImportPieces} />
          </div>
          
          {/* Piece Form */}
          <PieceForm onAddPiece={addPiece} projectId={projectId} />
          
          {/* Optimization Buttons */}
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
          
          {/* Pieces Stats */}
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
          
          {/* Pieces List */}
          {pieces.length > 0 && (
            <div className="pt-2">
              <PiecesList
                pieces={pieces}
                onUpdatePiece={updatePiece}
                onRemovePiece={removePiece}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <OptimizationLoadingDialog isOpen={isOptimizing} />
    </>
  );
};

export default PiecesAndOptimizationPanel;
