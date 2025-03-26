
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Puzzle, Scissors, Sparkles } from 'lucide-react';
import { useSheetData } from '../hooks/useSheetData';
import { PieceForm } from './pieces-panel/PieceForm';
import { ImportPiecesForm } from './pieces-panel/ImportPiecesForm';
import OptimizationControls from './OptimizationControls';
import { useLocation } from 'react-router-dom';

export const PiecesAndOptimizationPanel = () => {
  const { pieces, addPiece } = useSheetData();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(window.location.search);
  const projectId = location.state?.projectId || searchParams.get('projectId');

  const handleImportPieces = (importedPieces: any[]) => {
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
        
        <PieceForm onAddPiece={addPiece} projectId={projectId} />
        
        {/* Optimization Controls are now in a separate component */}
        <OptimizationControls />
      </CardContent>
    </Card>
  );
};

export default PiecesAndOptimizationPanel;
