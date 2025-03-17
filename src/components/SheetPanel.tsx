
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from 'lucide-react';
import { useSheetData } from '../hooks/useSheetData';
import { SheetDimensionInput } from './sheet-panel/SheetDimensionInput';
import { CutWidthControl } from './sheet-panel/CutWidthControl';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/context/AuthContext';
import { materialService } from '@/services/material';
import { Material } from '@/types/material';
import { useToast } from '@/hooks/use-toast';

export const SheetPanel = () => {
  const { sheet, setSheet } = useSheetData();
  const [localSheet, setLocalSheet] = useState(sheet);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadMaterials();
    }
  }, [user]);

  const loadMaterials = async () => {
    if (!user) return;
    
    setIsLoadingMaterials(true);
    try {
      const { data, error } = await materialService.getMaterials(user.id);
      
      if (error) {
        console.error("Error loading materials:", error);
      } else if (data) {
        setMaterials(data);
      }
    } catch (error) {
      console.error("Failed to load materials:", error);
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  const handleWidthChange = (width: number) => {
    setLocalSheet({ ...localSheet, width, materialId: undefined });
  };

  const handleHeightChange = (height: number) => {
    setLocalSheet({ ...localSheet, height, materialId: undefined });
  };

  const handleCutWidthChange = (value: number[]) => {
    setLocalSheet({ ...localSheet, cutWidth: value[0] });
  };

  const handleMaterialChange = (materialId: string) => {
    const selectedMaterial = materials.find(m => m.id === materialId);
    
    if (selectedMaterial) {
      setLocalSheet({
        ...localSheet,
        width: selectedMaterial.width,
        height: selectedMaterial.height,
        materialId
      });
      
      toast({
        title: "Material selecionado",
        description: `Dimensões da chapa ajustadas para ${selectedMaterial.width} x ${selectedMaterial.height} mm.`
      });
    }
  };

  const updateSheet = () => {
    setSheet(localSheet);
  };

  return (
    <Card className="w-full shadow-subtle border animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers size={18} />
          Chapa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {materials.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Selecionar material</label>
            <Select
              value={localSheet.materialId}
              onValueChange={handleMaterialChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um material" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.description} ({material.width} x {material.height} mm)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <SheetDimensionInput
            id="width"
            label="Largura (mm)"
            value={localSheet.width}
            onChange={handleWidthChange}
          />
          <SheetDimensionInput
            id="height"
            label="Altura (mm)"
            value={localSheet.height}
            onChange={handleHeightChange}
          />
        </div>

        <CutWidthControl 
          value={localSheet.cutWidth} 
          onChange={handleCutWidthChange} 
        />

        <Button 
          className="w-full mt-4" 
          onClick={updateSheet}
          disabled={
            localSheet.width === sheet.width && 
            localSheet.height === sheet.height && 
            localSheet.cutWidth === sheet.cutWidth &&
            localSheet.materialId === sheet.materialId
          }
        >
          Atualizar Chapa
        </Button>
      </CardContent>
    </Card>
  );
};

export default SheetPanel;
