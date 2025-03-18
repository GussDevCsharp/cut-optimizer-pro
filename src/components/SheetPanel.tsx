
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
import { Label } from "@/components/ui/label";
import { useMaterialsData } from "@/hooks/useMaterialsData";
import { useAuth } from "@/context/AuthContext";

export const SheetPanel = () => {
  const { user } = useAuth();
  const { sheet, setSheet } = useSheetData();
  const [localSheet, setLocalSheet] = useState(sheet);
  const { materials, loadMaterials, isLoading: isMaterialsLoading } = useMaterialsData(user?.id);
  const [usingMaterialDimensions, setUsingMaterialDimensions] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadMaterials();
    }
  }, [user?.id, loadMaterials]);

  // Update dimensions when material is selected
  useEffect(() => {
    if (localSheet.materialId && usingMaterialDimensions) {
      const material = materials.find(m => m.id === localSheet.materialId);
      if (material && material.width && material.height) {
        setLocalSheet(prev => ({
          ...prev,
          width: material.width || prev.width,
          height: material.height || prev.height,
        }));
      }
    }
  }, [localSheet.materialId, materials, usingMaterialDimensions]);

  const handleWidthChange = (width: number) => {
    setLocalSheet({ ...localSheet, width });
    // If manually changing dimensions, disable material auto-dimensions
    if (usingMaterialDimensions) {
      setUsingMaterialDimensions(false);
    }
  };

  const handleHeightChange = (height: number) => {
    setLocalSheet({ ...localSheet, height });
    // If manually changing dimensions, disable material auto-dimensions
    if (usingMaterialDimensions) {
      setUsingMaterialDimensions(false);
    }
  };

  const handleCutWidthChange = (value: number[]) => {
    setLocalSheet({ ...localSheet, cutWidth: value[0] });
  };

  const handleMaterialSelect = (materialId: string) => {
    setLocalSheet({ ...localSheet, materialId });
    setUsingMaterialDimensions(true);
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
        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Select 
            value={localSheet.materialId || ""} 
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
          {localSheet.materialId && (
            <div className="flex items-center mt-1">
              <input 
                type="checkbox" 
                id="useMaterialDimensions" 
                checked={usingMaterialDimensions} 
                onChange={(e) => setUsingMaterialDimensions(e.target.checked)}
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
            value={localSheet.width}
            onChange={handleWidthChange}
            disabled={usingMaterialDimensions}
          />
          <SheetDimensionInput
            id="height"
            label="Altura (mm)"
            value={localSheet.height}
            onChange={handleHeightChange}
            disabled={usingMaterialDimensions}
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
