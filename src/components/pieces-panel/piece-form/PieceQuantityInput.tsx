
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PieceQuantityInputProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export const PieceQuantityInput = ({ 
  quantity, 
  onQuantityChange 
}: PieceQuantityInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="quantity">Quantidade</Label>
      <Input
        id="quantity"
        type="number"
        value={quantity}
        onChange={(e) => onQuantityChange(Number(e.target.value))}
      />
    </div>
  );
};
