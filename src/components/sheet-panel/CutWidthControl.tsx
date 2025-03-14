
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Scissors } from 'lucide-react';

interface CutWidthControlProps {
  value: number;
  onChange: (value: number[]) => void;
}

export const CutWidthControl = ({ value, onChange }: CutWidthControlProps) => {
  return (
    <div className="space-y-2 bg-muted/20 p-3 rounded-md border">
      <Label htmlFor="cut-width" className="flex items-center gap-2 text-base font-medium">
        <Scissors size={16} />
        <span>Espessura da serra de corte (mm)</span>
      </Label>
      <div className="pt-2 px-1">
        <Slider
          id="cut-width"
          value={[value]}
          max={10}
          min={0.5}
          step={0.5}
          onValueChange={onChange}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground pt-1">
        <span>0.5mm</span>
        <span className="font-medium text-sm">{value}mm</span>
        <span>10mm</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Esta é a largura do material que será consumida pela serra durante cada corte.
      </div>
    </div>
  );
};
