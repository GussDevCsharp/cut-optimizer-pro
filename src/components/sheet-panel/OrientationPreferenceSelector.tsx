
import React from 'react';
import { useSheetData, OrientationPreference } from '../../hooks/useSheetData';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Maximize2, Minimize2 } from 'lucide-react';

export const OrientationPreferenceSelector = () => {
  const { orientationPreference, setOrientationPreference } = useSheetData();

  const handleChange = (value: string) => {
    setOrientationPreference(value as OrientationPreference);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Preferência de Orientação:</Label>
      <RadioGroup
        value={orientationPreference}
        onValueChange={handleChange}
        className="flex flex-row gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="horizontal" id="horizontal" />
          <Label htmlFor="horizontal" className="flex items-center gap-1 cursor-pointer">
            <Maximize2 size={16} />
            <span>Horizontal</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="vertical" id="vertical" />
          <Label htmlFor="vertical" className="flex items-center gap-1 cursor-pointer">
            <Minimize2 size={16} />
            <span>Vertical</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default OrientationPreferenceSelector;
