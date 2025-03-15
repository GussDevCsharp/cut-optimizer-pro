
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Puzzle } from 'lucide-react';
import { useSheetData, Piece } from '../hooks/useSheetData';
import { PieceForm } from './pieces-panel/PieceForm';
import { PiecesList } from './pieces-panel/PiecesList';
import { ImportPiecesForm } from './pieces-panel/ImportPiecesForm';
import { useLocation } from 'react-router-dom';

export const PiecesPanel = () => {
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
    <Card className="w-full shadow-subtle border animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Puzzle size={18} />
          Peças
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <ImportPiecesForm onImportPieces={handleImportPieces} />
        </div>
        <PieceForm onAddPiece={addPiece} projectId={projectId} />
      </CardContent>

      {pieces.length > 0 && (
        <div className="px-6 pb-4">
          <PiecesList
            pieces={pieces}
            onUpdatePiece={updatePiece}
            onRemovePiece={removePiece}
          />
        </div>
      )}
    </Card>
  );
};

export default PiecesPanel;
