
import { Piece } from '@/hooks/useSheetData';

interface PiecesStatsCardProps {
  pieces: Piece[];
}

export const PiecesStatsCard = ({ pieces }: PiecesStatsCardProps) => {
  const totalPieces = pieces.reduce((total, piece) => total + piece.quantity, 0);
  
  return (
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
  );
};

export default PiecesStatsCard;
