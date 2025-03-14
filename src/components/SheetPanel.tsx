
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Layers, Scissors } from 'lucide-react';
import { useSheetData } from '../hooks/useSheetData';

export const SheetPanel = () => {
  const { sheet, setSheet } = useSheetData();
  const [localSheet, setLocalSheet] = useState(sheet);

  const materialOptions = [
    { value: "madeira", label: "Madeira" },
    { value: "vidro", label: "Vidro" },
    { value: "mdf", label: "MDF" },
    { value: "aco", label: "Aço" },
  ];

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalSheet({ ...localSheet, width: value });
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalSheet({ ...localSheet, height: value });
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
          <div className="space-y-2">
            <Label htmlFor="width">Largura (mm)</Label>
            <div className="flex">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-r-none h-10"
                onClick={() => setLocalSheet({ ...localSheet, width: Math.max(1, localSheet.width - 10) })}
              >
                <Minus size={16} />
              </Button>
              <Input
                id="width"
                type="number"
                value={localSheet.width}
                onChange={handleWidthChange}
                className="rounded-none text-center h-10"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-l-none h-10"
                onClick={() => setLocalSheet({ ...localSheet, width: localSheet.width + 10 })}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Altura (mm)</Label>
            <div className="flex">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-r-none h-10"
                onClick={() => setLocalSheet({ ...localSheet, height: Math.max(1, localSheet.height - 10) })}
              >
                <Minus size={16} />
              </Button>
              <Input
                id="height"
                type="number"
                value={localSheet.height}
                onChange={handleHeightChange}
                className="rounded-none text-center h-10"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-l-none h-10"
                onClick={() => setLocalSheet({ ...localSheet, height: localSheet.height + 10 })}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2 bg-muted/20 p-3 rounded-md border">
          <Label htmlFor="cut-width" className="flex items-center gap-2 text-base font-medium">
            <Scissors size={16} />
            <span>Espessura da serra de corte (mm)</span>
          </Label>
          <div className="pt-2 px-1">
            <Slider
              id="cut-width"
              value={[localSheet.cutWidth]}
              max={10}
              min={0.5}
              step={0.5}
              onValueChange={handleCutWidthChange}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <span>0.5mm</span>
            <span className="font-medium text-sm">{localSheet.cutWidth}mm</span>
            <span>10mm</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Esta é a largura do material que será consumida pela serra durante cada corte.
          </div>
        </div>

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
