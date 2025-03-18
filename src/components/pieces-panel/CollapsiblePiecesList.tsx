
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PiecesList } from './PiecesList';
import { Piece } from '@/hooks/useSheetData';

interface CollapsiblePiecesListProps {
  pieces: Piece[];
  onUpdatePiece: (id: string, piece: Partial<Piece>) => void;
  onRemovePiece: (id: string) => void;
}

export const CollapsiblePiecesList = ({
  pieces,
  onUpdatePiece,
  onRemovePiece
}: CollapsiblePiecesListProps) => {
  if (pieces.length === 0) {
    return null;
  }

  return (
    <Card className="h-full shadow-subtle border animate-fade-in overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          Lista de Peças
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <PiecesList
            pieces={pieces}
            onUpdatePiece={onUpdatePiece}
            onRemovePiece={onRemovePiece}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CollapsiblePiecesList;
