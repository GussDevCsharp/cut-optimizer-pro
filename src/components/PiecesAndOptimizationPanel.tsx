
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Puzzle, Scissors } from 'lucide-react';
import { useSheetData, Piece } from '../hooks/useSheetData';
import { PieceForm } from './pieces-panel/PieceForm';
import { PiecesList } from './pieces-panel/PiecesList';
import { ImportPiecesForm } from './pieces-panel/ImportPiecesForm';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OptimizationControls from './OptimizationControls';

export const PiecesAndOptimizationPanel = () => {
  const { pieces, addPiece, updatePiece, removePiece } = useSheetData();
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
              <OptimizationControls />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default PiecesAndOptimizationPanel;
