
import { Button } from "@/components/ui/button";
import { Sparkles, RectangleHorizontal } from 'lucide-react';

interface OptimizationButtonsProps {
  onOptimize: () => void;
  onClear: () => void;
  isOptimizing: boolean;
  hasPieces: boolean;
}

export const OptimizationButtons = ({ 
  onOptimize, 
  onClear, 
  isOptimizing, 
  hasPieces 
}: OptimizationButtonsProps) => {
  return (
    <>
      <Button 
        className="w-full gap-2" 
        onClick={onOptimize}
        disabled={!hasPieces || isOptimizing}
      >
        <Sparkles size={16} />
        Otimizar Corte
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full gap-2" 
        onClick={onClear}
        disabled={isOptimizing}
      >
        <RectangleHorizontal size={16} />
        Limpar Visualização
      </Button>
    </>
  );
};

export default OptimizationButtons;
