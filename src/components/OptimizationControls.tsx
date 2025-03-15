
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RectangleHorizontal, Loader2 } from 'lucide-react';
import { useSheetData } from '../hooks/useSheetData';
import { optimizeCutting } from '../utils/optimizationAlgorithm';
import { toast } from "sonner";

export const OptimizationControls = () => {
  const { sheet, pieces, setPlacedPieces } = useSheetData();
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const handleOptimize = () => {
    if (pieces.length === 0) {
      toast.error("Adicione peças antes de otimizar", {
        description: "Você precisa adicionar pelo menos uma peça para otimizar o corte."
      });
      return;
    }
    
    setIsOptimizing(true);
    
    // Use setTimeout to allow the UI to update before running the optimization
    setTimeout(() => {
      try {
        const placedPieces = optimizeCutting(pieces, sheet);
        setPlacedPieces(placedPieces);
        
        // Show toast with result
        const placedCount = placedPieces.length;
        const totalCount = pieces.reduce((total, piece) => total + piece.quantity, 0);
        
        if (placedCount === totalCount) {
          toast.success("Otimização concluída com sucesso!", {
            description: `Todas as ${totalCount} peças foram posicionadas na chapa.`
          });
        } else {
          toast.warning("Otimização parcial!", {
            description: `Foram posicionadas ${placedCount} de ${totalCount} peças na chapa.`
          });
        }
      } catch (error) {
        toast.error("Erro na otimização", {
          description: "Ocorreu um erro ao tentar otimizar o corte."
        });
        console.error(error);
      } finally {
        setIsOptimizing(false);
      }
    }, 10);
  };
  
  const handleClear = () => {
    setPlacedPieces([]);
    toast.info("Visualização limpa", {
      description: "Todas as peças foram removidas da visualização."
    });
  };

  const totalPieces = pieces.reduce((total, piece) => total + piece.quantity, 0);
  
  return (
    <div className="flex flex-col gap-4">
      <Button 
        className="w-full gap-2" 
        onClick={handleOptimize}
        disabled={pieces.length === 0 || isOptimizing}
      >
        {isOptimizing ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Sparkles size={16} />
        )}
        {isOptimizing ? "Otimizando..." : "Otimizar Corte"}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full gap-2" 
        onClick={handleClear}
        disabled={isOptimizing}
      >
        <RectangleHorizontal size={16} />
        Limpar Visualização
      </Button>
      
      <div className="bg-secondary rounded-md p-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total de peças:</span>
          <span className="font-medium">{totalPieces}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Tipos de peças:</span>
          <span className="font-medium">{pieces.length}</span>
        </div>
      </div>
    </div>
  );
};

export default OptimizationControls;
