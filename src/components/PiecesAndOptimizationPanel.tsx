
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Puzzle, Scissors } from 'lucide-react';
import { useSheetData, Piece } from '../hooks/useSheetData';
import { PieceForm } from './pieces-panel/PieceForm';
import { PiecesList } from './pieces-panel/PiecesList';
import { ImportPiecesForm } from './pieces-panel/ImportPiecesForm';
import { optimizeCutting } from '../utils/optimizationAlgorithm';
import { Button } from "@/components/ui/button";
import { Sparkles, RectangleHorizontal } from 'lucide-react';
import { toast } from "sonner";
import { useProjectActions } from "@/hooks/useProjectActions";
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const PiecesAndOptimizationPanel = () => {
  const { sheet, pieces, placedPieces, setPlacedPieces, addPiece, updatePiece, removePiece, projectName } = useSheetData();
  const { saveProject } = useProjectActions();
  const location = useLocation();
  
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
        <Tabs defaultValue="pieces" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="pieces">Peças</TabsTrigger>
            <TabsTrigger value="optimization">Otimização</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pieces" className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <ImportPiecesForm onImportPieces={handleImportPieces} />
            </div>
            <PieceForm onAddPiece={addPiece} projectId={projectId} />
            
            {pieces.length > 0 && (
              <div className="pt-4">
                <PiecesList
                  pieces={pieces}
                  onUpdatePiece={updatePiece}
                  onRemovePiece={removePiece}
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="optimization" className="pt-4 space-y-4">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PiecesAndOptimizationPanel;
