
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Piece } from '@/hooks/useSheetData';
import { Edit, Copy, Trash2 } from 'lucide-react';
import { calculateTotalArea } from '@/utils/calculations';
import { DuplicateDialog } from './DuplicateDialog';
import { generateId } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PiecesListProps {
  pieces: Piece[];
  onUpdatePiece: (id: string, piece: Partial<Piece>) => void;
  onRemovePiece: (id: string) => void;
}

export const PiecesList: React.FC<PiecesListProps> = ({ 
  pieces, 
  onUpdatePiece, 
  onRemovePiece 
}) => {
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pieceToDuplicate, setPieceToDuplicate] = useState<Piece | null>(null);

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  const handleStartEdit = (piece: Piece) => {
    // In a full implementation, this would open an edit form or dialog
    console.log("Edit piece:", piece);
  };

  const handleDuplicatePiece = (piece: Piece) => {
    setPieceToDuplicate(piece);
    setIsDialogOpen(true);
  };

  const confirmDuplicatePiece = () => {
    if (!pieceToDuplicate) return;

    const newPiece: Piece = {
      id: generateId(),
      name: pieceToDuplicate.name,
      width: pieceToDuplicate.width,
      height: pieceToDuplicate.height,
      quantity: pieceToDuplicate.quantity,
      canRotate: pieceToDuplicate.canRotate,
    };

    // Here we would call a function passed as prop to add the piece
    // For now, we'll just log it
    console.log("Duplicate piece:", newPiece);
    
    setIsDialogOpen(false);
    setPieceToDuplicate(null);
  };

  const cancelDuplicatePiece = () => {
    setIsDialogOpen(false);
    setPieceToDuplicate(null);
  };

  const totalArea = calculateTotalArea(pieces);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Lista de Peças ({pieces.length})</h2>
        <Button variant="outline" size="sm" onClick={toggleTableVisibility}>
          {isTableVisible ? 'Esconder Tabela' : 'Mostrar Tabela'}
        </Button>
      </div>

      {isTableVisible && (
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>Total de área: {totalArea} mm²</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Nome</TableHead>
                <TableHead>Largura</TableHead>
                <TableHead>Altura</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pieces.map((piece) => (
                <TableRow key={piece.id}>
                  <TableCell className="font-medium">{piece.name}</TableCell>
                  <TableCell>{piece.width}</TableCell>
                  <TableCell>{piece.height}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleStartEdit(piece)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicatePiece(piece)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onRemovePiece(piece.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">{pieces.length} peças</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}

      <DuplicateDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={confirmDuplicatePiece}
        onCancel={cancelDuplicatePiece}
      />
    </div>
  );
};
