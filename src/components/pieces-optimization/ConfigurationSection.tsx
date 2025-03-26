
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useSheetData } from '@/hooks/useSheetData';

export const ConfigurationSection: React.FC = () => {
  const { kerf, setKerf, grainDirection, setGrainDirection } = useSheetData();

  const handleKerfChange = (value: number[]) => {
    if (setKerf) {
      setKerf(value[0]);
    }
  };

  const handleGrainDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (setGrainDirection) {
      setGrainDirection(e.target.value as 'width' | 'height');
    }
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Configurações</h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="kerf">Kerf (mm): {kerf}</Label>
          <Slider
            defaultValue={[kerf]}
            max={10}
            step={0.5}
            onValueChange={handleKerfChange}
          />
        </div>
        <div>
          <Label htmlFor="grainDirection">Direção do Grão</Label>
          <select
            id="grainDirection"
            className="w-full p-2 border rounded"
            value={grainDirection}
            onChange={handleGrainDirectionChange}
          >
            <option value="width">Largura</option>
            <option value="height">Altura</option>
          </select>
        </div>
      </div>
    </>
  );
};
