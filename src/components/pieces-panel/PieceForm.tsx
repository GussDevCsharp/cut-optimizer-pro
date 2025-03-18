
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Package } from 'lucide-react';
import { Piece } from '../../hooks/useSheetData';
import { useProjectActions } from "@/hooks/useProjectActions";
import { useSheetData } from "@/hooks/useSheetData";
import { useToast } from "@/hooks/use-toast";
import { useMaterialsData } from "@/hooks/useMaterialsData";
import { useAuth } from "@/context/AuthContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SheetDimensionInput } from "../sheet-panel/SheetDimensionInput";

interface PieceFormProps {
  onAddPiece: (piece: Piece) => void;
  projectId: string | null;
}

export const PieceForm = ({ onAddPiece, projectId }: PieceFormProps) => {
  const { user } = useAuth();
  const [newPiece, setNewPiece] = useState<Omit<Piece, 'id'>>({
    width: 100,
    height: 100,
    quantity: 1,
    canRotate: true,
  });
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const { saveProject, isSaving } = useProjectActions();
  const { projectName, sheet, pieces, placedPieces } = useSheetData();
  const { toast } = useToast();
  const { materials, loadMaterials, isLoading: isMaterialsLoading } = useMaterialsData(user?.id);
  const [usingMaterial, setUsingMaterial] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadMaterials();
    }
  }, [user?.id, loadMaterials]);

  // Update dimensions when material is selected
  useEffect(() => {
    if (selectedMaterial && usingMaterial) {
      const material = materials.find(m => m.id === selectedMaterial);
      if (material) {
        setNewPiece(prev => ({
          ...prev,
          width: material.width || prev.width,
          height: material.height || prev.height,
        }));
      }
    }
  }, [selectedMaterial, materials, usingMaterial]);

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
      materialId: usingMaterial ? selectedMaterial : undefined,
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
    setSelectedMaterial(null);
    setUsingMaterial(false);
  };

  const handleMaterialSelect = (materialId: string) => {
    setSelectedMaterial(materialId);
    setUsingMaterial(true);
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    setNewPiece({ ...newPiece, [dimension]: value });
    // If manually changing dimensions, disable material auto-dimensions
    if (usingMaterial) {
      setUsingMaterial(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="material">Material</Label>
        <Select 
          value={selectedMaterial || ""} 
          onValueChange={handleMaterialSelect}
          disabled={isMaterialsLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um material" />
          </SelectTrigger>
          <SelectContent>
            {materials.map(material => (
              <SelectItem key={material.id} value={material.id}>
                {material.name} - {material.type} ({material.width}x{material.height} {material.unit})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedMaterial && (
          <div className="flex items-center mt-1">
            <input 
              type="checkbox" 
              id="useMaterialDimensions" 
              checked={usingMaterial} 
              onChange={(e) => setUsingMaterial(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="useMaterialDimensions" className="text-xs text-muted-foreground">
              Usar dimensões do material
            </label>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SheetDimensionInput
          id="width"
          label="Largura (mm)"
          value={newPiece.width}
          onChange={(value) => handleDimensionChange('width', value)}
          disabled={usingMaterial}
        />
        <SheetDimensionInput
          id="height"
          label="Altura (mm)"
          value={newPiece.height}
          onChange={(value) => handleDimensionChange('height', value)}
          disabled={usingMaterial}
        />
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
