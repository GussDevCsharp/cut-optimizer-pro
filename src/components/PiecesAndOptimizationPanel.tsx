
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Puzzle, Scissors } from 'lucide-react';
import { useSheetData, Piece } from '../hooks/useSheetData';
import { PieceForm } from './pieces-panel/PieceForm';
import { ImportPiecesForm } from './pieces-panel/ImportPiecesForm';
import OptimizationControls from './OptimizationControls';

export const PiecesAndOptimizationPanel = () => {
  const { addPiece } = useSheetData();

  const handleImportPieces = (importedPieces: Piece[]) => {
    importedPieces.forEach(piece => {
      addPiece(piece);
    });
  };

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
        <div className="flex items-center justify-between">
          <ImportPiecesForm onImportPieces={handleImportPieces} />
        </div>
        
        <PieceForm onAddPiece={addPiece} />
        
        {/* Componente de controles de otimização */}
        <OptimizationControls />
      </CardContent>
    </Card>
  );
};

export default PiecesAndOptimizationPanel;
