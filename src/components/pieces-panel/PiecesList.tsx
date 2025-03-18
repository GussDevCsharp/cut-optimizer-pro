
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Piece } from '../../hooks/useSheetData';

interface PiecesListProps {
  pieces: Piece[];
  onUpdatePiece: (id: string, piece: Partial<Piece>) => void;
  onRemovePiece: (id: string) => void;
}

export const PiecesList = ({ pieces, onUpdatePiece, onRemovePiece }: PiecesListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  if (pieces.length === 0) {
    return null;
  }

  const handleDoubleClick = (piece: Piece) => {
    setEditingId(piece.id);
    setEditValue(piece.quantity);
  };

  const handleBlur = () => {
    if (editingId && editValue > 0) {
      onUpdatePiece(editingId, { quantity: editValue });
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editingId && editValue > 0) {
      onUpdatePiece(editingId, { quantity: editValue });
      setEditingId(null);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <div className="w-full border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 sticky top-0 z-10">
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
              <td className="py-2 px-3 text-center" onDoubleClick={() => handleDoubleClick(piece)}>
                {editingId === piece.id ? (
                  <Input
                    type="number"
                    min="1"
                    value={editValue}
                    onChange={(e) => setEditValue(parseInt(e.target.value) || 1)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="w-16 h-8 mx-auto"
                  />
                ) : (
                  <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded" title="Clique duplo para editar">
                    {piece.quantity}
                  </span>
                )}
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
