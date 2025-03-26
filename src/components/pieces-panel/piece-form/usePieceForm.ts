
import { useState } from 'react';
import { Piece } from '@/hooks/useSheetData';
import { useProjectActions } from "@/hooks/useProjectActions";
import { useSheetData } from "@/hooks/useSheetData";
import { useToast } from "@/components/ui/use-toast";

interface UsePieceFormProps {
  onAddPiece: (piece: Piece) => void;
  projectId: string | null;
}

export const usePieceForm = ({ onAddPiece, projectId }: UsePieceFormProps) => {
  const [newPiece, setNewPiece] = useState<Omit<Piece, 'id'>>({
    width: 100,
    height: 100,
    quantity: 1,
    canRotate: true,
  });
  
  const { saveProject, isSaving } = useProjectActions();
  const { projectName, sheet, pieces, placedPieces } = useSheetData();
  const { toast } = useToast();

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    setNewPiece({ ...newPiece, [dimension]: value });
  };

  const handleQuantityChange = (quantity: number) => {
    setNewPiece({ ...newPiece, quantity });
  };

  const handleToggleRotation = (canRotate: boolean) => {
    setNewPiece({ ...newPiece, canRotate });
  };

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

  return {
    newPiece,
    isSaving,
    handleDimensionChange,
    handleQuantityChange,
    handleToggleRotation,
    handleAddPiece
  };
};
