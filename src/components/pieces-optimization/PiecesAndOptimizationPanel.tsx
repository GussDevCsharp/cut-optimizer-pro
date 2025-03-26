
import React from 'react';
import { Card } from "@/components/ui/card";
import { useSheetData } from '@/hooks/useSheetData';
import { PieceForm } from './PieceForm';
import { PiecesList } from './PiecesList';
import { ImportSection } from './ImportSection';
import { OptimizationSection } from './OptimizationSection';
import { ConfigurationSection } from './ConfigurationSection';
import { CSVDownloader } from '../CSVDownloader';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PiecesAndOptimizationPanelProps {
  sheetId?: string;
}

export const PiecesAndOptimizationPanel: React.FC<PiecesAndOptimizationPanelProps> = ({ sheetId = "default" }) => {
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const { pieces, setPieces, updatePiece, removePiece, kerf, grainDirection, updateSheetData } = useSheetData();
  const { toast } = useToast();

  const handleAddPiece = (piece) => {
    setPieces([...pieces, piece]);
  };

  const handleImportPieces = (importedPieces) => {
    setPieces([...pieces, ...importedPieces]);
  };

  const handleSavePieces = async () => {
    setIsSaving(true);
    try {
      await updateSheetData(sheetId, { pieces, kerf, grainDirection });
      toast({
        title: "Sucesso!",
        description: "Peças salvas com sucesso.",
      });
    } catch (error) {
      console.error("Error saving pieces:", error);
      toast({
        title: "Erro",
        description: "Falha ao salvar as peças. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="md:flex md:gap-4">
        <div className="mb-4 md:w-1/2">
          <PieceForm onAddPiece={handleAddPiece} />
        </div>
        <div className="mb-4 md:w-1/2">
          <ConfigurationSection />
        </div>
      </div>

      <ImportSection onImportPieces={handleImportPieces} />
      
      <OptimizationSection />
      
      <PiecesList 
        pieces={pieces} 
        onUpdatePiece={updatePiece} 
        onRemovePiece={removePiece} 
      />

      <div className="flex justify-between items-center mt-4">
        <CSVDownloader data={pieces} filename={`pieces-${new Date().toISOString()}.csv`} />
        <Button 
          variant="outline" 
          onClick={handleSavePieces}
          disabled={isSaving}
        >
          {isSaving ? 'Salvando...' : 'Salvar Peças'}
          <Save className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default PiecesAndOptimizationPanel;
