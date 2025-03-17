
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from 'lucide-react';
import { useSheetData } from '../hooks/useSheetData';
import { SheetDimensionInput } from './sheet-panel/SheetDimensionInput';
import { CutWidthControl } from './sheet-panel/CutWidthControl';

export const SheetPanel = () => {
  const { sheet, setSheet } = useSheetData();
  const [localSheet, setLocalSheet] = useState(sheet);

  const handleWidthChange = (width: number) => {
    setLocalSheet({ ...localSheet, width });
  };

  const handleHeightChange = (height: number) => {
    setLocalSheet({ ...localSheet, height });
  };

  const handleCutWidthChange = (value: number[]) => {
    setLocalSheet({ ...localSheet, cutWidth: value[0] });
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
            localSheet.cutWidth === sheet.cutWidth
          }
        >
          Atualizar Chapa
        </Button>
      </CardContent>
    </Card>
  );
};

export default SheetPanel;
