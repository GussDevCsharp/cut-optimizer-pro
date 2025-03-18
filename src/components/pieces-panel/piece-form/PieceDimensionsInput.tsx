
import { Piece } from '@/hooks/useSheetData';
import { SheetDimensionInput } from "@/components/sheet-panel/SheetDimensionInput";

interface PieceDimensionsInputProps {
  piece: Omit<Piece, 'id'>;
  onDimensionChange: (dimension: 'width' | 'height', value: number) => void;
}

export const PieceDimensionsInput = ({ 
  piece, 
  onDimensionChange 
}: PieceDimensionsInputProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SheetDimensionInput
        id="width"
        label="Largura (mm)"
        value={piece.width}
        onChange={(value) => onDimensionChange('width', value)}
      />
      <SheetDimensionInput
        id="height"
        label="Altura (mm)"
        value={piece.height}
        onChange={(value) => onDimensionChange('height', value)}
      />
    </div>
  );
};
