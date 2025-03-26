
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Piece } from '@/hooks/useSheetData';
import { generateId } from '@/lib/utils';
import { Plus, Save } from 'lucide-react';

interface PieceFormProps {
  onAddPiece: (piece: Piece) => void;
}

export const PieceForm: React.FC<PieceFormProps> = ({ onAddPiece }) => {
  const [name, setName] = useState('');
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [editingPieceId, setEditingPieceId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddPiece = () => {
    if (!name || !width || !height || quantity <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos corretamente.",
        variant: "destructive",
      });
      return;
    }

    const newPieces: Piece[] = [];
    for (let i = 0; i < quantity; i++) {
      const newPiece: Piece = {
        id: generateId(),
        name,
        width,
        height,
        quantity: 1, // Each piece has quantity 1 since we're creating multiple pieces
        canRotate: true,
      };
      newPieces.push(newPiece);
    }

    newPieces.forEach(piece => onAddPiece(piece));
    resetForm();
  };

  const handleEditPiece = () => {
    if (!name || !width || !height) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos corretamente.",
        variant: "destructive",
      });
      return;
    }

    // We would need to implement this if we want to support editing
    setEditingPieceId(null);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setWidth(undefined);
    setHeight(undefined);
    setQuantity(1);
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Adicionar Peça</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              type="number"
              id="quantity"
              value={quantity.toString()}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              min="1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="width">Largura (mm)</Label>
            <Input
              type="number"
              id="width"
              value={width !== undefined ? width.toString() : ''}
              onChange={(e) => setWidth(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="height">Altura (mm)</Label>
            <Input
              type="number"
              id="height"
              value={height !== undefined ? height.toString() : ''}
              onChange={(e) => setHeight(parseFloat(e.target.value))}
            />
          </div>
        </div>

        {editingPieceId ? (
          <Button onClick={handleEditPiece} className="bg-blue-500 text-white hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Salvar Edição
          </Button>
        ) : (
          <Button onClick={handleAddPiece} className="bg-green-500 text-white hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Peça
          </Button>
        )}
      </div>
    </>
  );
};
