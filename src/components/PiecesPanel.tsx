
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Puzzle } from 'lucide-react';
import { useSheetData, Piece } from '../hooks/useSheetData';
import { PieceForm } from './pieces-panel/PieceForm';
import { PiecesList } from './pieces-panel/PiecesList';

export const PiecesPanel = () => {
  const { pieces, addPiece, updatePiece, removePiece } = useSheetData();

  return (
    <Card className="w-full shadow-subtle border animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Puzzle size={18} />
          Peças
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PieceForm onAddPiece={addPiece} />
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
