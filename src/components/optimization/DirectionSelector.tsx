
import { AlignHorizontalJustifyStart, AlignVerticalJustifyStart } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { OptimizationDirection } from '@/utils/optimizationAlgorithm';

interface DirectionSelectorProps {
  direction: OptimizationDirection;
  onDirectionChange: (value: string) => void;
}

export const DirectionSelector = ({ 
  direction, 
  onDirectionChange 
}: DirectionSelectorProps) => {
  return (
    <div className="bg-secondary rounded-md p-3">
      <p className="text-sm text-muted-foreground mb-2">Direção da otimização:</p>
      <ToggleGroup 
        type="single" 
        value={direction} 
        onValueChange={onDirectionChange} 
        className="justify-start"
      >
        <ToggleGroupItem value="horizontal" aria-label="Horizontal" className="flex gap-1 items-center">
          <AlignHorizontalJustifyStart size={16} />
          <span className="text-xs sm:text-sm">Horizontal</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="vertical" aria-label="Vertical" className="flex gap-1 items-center">
          <AlignVerticalJustifyStart size={16} />
          <span className="text-xs sm:text-sm">Vertical</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default DirectionSelector;
