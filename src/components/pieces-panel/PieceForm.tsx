
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from 'lucide-react';
import { Piece } from '../../hooks/useSheetData';
import { useProjectActions } from "@/hooks/useProjectActions";
import { useSheetData } from "@/hooks/useSheetData";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width">Largura (mm)</Label>
          <Input
            id="width"
            type="number"
            value={newPiece.width}
            onChange={(e) => setNewPiece({ ...newPiece, width: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Altura (mm)</Label>
          <Input
            id="height"
            type="number"
            value={newPiece.height}
            onChange={(e) => setNewPiece({ ...newPiece, height: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantidade</Label>
        <Input
          id="quantity"
          type="number"
          value={newPiece.quantity}
          onChange={(e) => setNewPiece({ ...newPiece, quantity: Number(e.target.value) })}
        />
      </div>

      <Button 
        className="w-full mt-2" 
        onClick={handleAddPiece}
        disabled={isSaving}
      >
        <Plus size={16} className="mr-2" />
        {isSaving ? "Salvando..." : "Adicionar Peça"}
      </Button>
    </div>
  );
};
