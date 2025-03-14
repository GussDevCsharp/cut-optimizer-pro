
import { Button } from "@/components/ui/button";
import { Trash2, Plus, MinusIcon } from 'lucide-react';
import { Piece } from '../../hooks/useSheetData';

interface PiecesListProps {
  pieces: Piece[];
  onUpdatePiece: (id: string, piece: Partial<Piece>) => void;
  onRemovePiece: (id: string) => void;
}

export const PiecesList = ({ pieces, onUpdatePiece, onRemovePiece }: PiecesListProps) => {
  if (pieces.length === 0) {
    return null;
  }

  return (
    <div className="max-h-[250px] overflow-y-auto border rounded-md">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 sticky top-0">
          <tr>
            <th className="text-left py-2 px-3 font-medium">Peça</th>
            <th className="text-center py-2 px-3 font-medium">Dimensões</th>
            <th className="text-center py-2 px-3 font-medium">Qtd.</th>
            <th className="text-right py-2 px-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {pieces.map((piece, index) => (
            <tr key={piece.id} className="border-t">
              <td className="py-2 px-3">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: piece.color }}
                  ></div>
                  <span>{index + 1}</span>
                </div>
              </td>
              <td className="py-2 px-3 text-center">
                {piece.width}×{piece.height}
              </td>
              <td className="py-2 px-3 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onUpdatePiece(piece.id, { quantity: Math.max(1, piece.quantity - 1) })}
                  >
                    <MinusIcon size={14} />
                  </Button>
                  <span>{piece.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onUpdatePiece(piece.id, { quantity: piece.quantity + 1 })}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </td>
              <td className="py-2 px-3 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemovePiece(piece.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
