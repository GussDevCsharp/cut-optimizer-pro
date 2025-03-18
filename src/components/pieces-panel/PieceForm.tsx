
import { useState } from 'react';
import { Piece } from '../../hooks/useSheetData';
import { useProjectActions } from "@/hooks/useProjectActions";
import { useSheetData } from "@/hooks/useSheetData";
import { useToast } from "@/hooks/use-toast";
import { PieceDimensionsInput } from './piece-form/PieceDimensionsInput';
import { PieceQuantityInput } from './piece-form/PieceQuantityInput';
import { AddPieceButton } from './piece-form/AddPieceButton';

interface PieceFormProps {
  onAddPiece: (piece: Piece) => void;
  projectId: string | null;
}

export const PieceForm = ({ onAddPiece, projectId }: PieceFormProps) => {
  const [newPiece, setNewPiece] = useState<Omit<Piece, 'id'>>({
    width: 100,
    height: 100,
    quantity: 1,
    canRotate: true,
  });
  const { saveProject, isSaving } = useProjectActions();
  const { projectName, sheet, pieces, placedPieces } = useSheetData();
  const { toast } = useToast();

  const handleAddPiece = async () => {
    // Basic validation
    if (newPiece.width <= 0 || newPiece.height <= 0 || newPiece.quantity <= 0) {
      return;
    }
    
    const piece: Piece = {
      ...newPiece,
      id: `piece-${Date.now()}`,
      // Generate a random pastel color
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`,
    };
    
    // Add the piece to the local state
    onAddPiece(piece);
    
    // Save the updated project data to the database
    const updatedPieces = [...pieces, piece];
    const projectData = {
      sheet,
      pieces: updatedPieces,
      placedPieces
    };
    
    console.log("Saving project after adding piece:", projectData);
    
    try {
      if (projectName) {
        await saveProject(projectId, projectName, projectData);
        toast({
          title: "Peça adicionada",
          description: "Peça adicionada e projeto salvo automaticamente."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Atenção",
          description: "Defina um nome para o projeto para salvar automaticamente."
        });
      }
    } catch (err) {
      console.error("Error saving project after adding piece:", err);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar o projeto após adicionar a peça."
      });
    }
    
    // Reset form
    setNewPiece({
      width: 100,
      height: 100,
      quantity: 1,
      canRotate: true,
    });
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    setNewPiece({ ...newPiece, [dimension]: value });
  };

  const handleQuantityChange = (quantity: number) => {
    setNewPiece({ ...newPiece, quantity });
  };

  return (
    <div className="space-y-4">
      <PieceDimensionsInput
        piece={newPiece}
        onDimensionChange={handleDimensionChange}
      />

      <PieceQuantityInput
        quantity={newPiece.quantity}
        onQuantityChange={handleQuantityChange}
      />

      <AddPieceButton
        onClick={handleAddPiece}
        isLoading={isSaving}
      />
    </div>
  );
};
