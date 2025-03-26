
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PieceRotationToggleProps {
  canRotate: boolean;
  onToggleRotation: (canRotate: boolean) => void;
}

export const PieceRotationToggle = ({
  canRotate,
  onToggleRotation
}: PieceRotationToggleProps) => {
  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor="can-rotate" className="text-sm">Permitir rotação da peça</Label>
      <Switch 
        id="can-rotate" 
        checked={canRotate}
        onCheckedChange={onToggleRotation}
      />
    </div>
  );
};
