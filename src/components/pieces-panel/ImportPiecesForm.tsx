
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload } from 'lucide-react';
import { Piece, useSheetData } from '../../hooks/useSheetData';
import { TextImportTab } from './import/TextImportTab';
import { toast } from "sonner";

interface ImportPiecesFormProps {
  onImportPieces: (pieces: Piece[]) => void;
}

export const ImportPiecesForm = ({ onImportPieces }: ImportPiecesFormProps) => {
  const [open, setOpen] = useState(false);
  const { setProjectName, setSheet, setPieces, setPlacedPieces } = useSheetData();
  
  const handleImportSuccess = (importedPieces: Piece[]) => {
    onImportPieces(importedPieces);
    setOpen(false);
    toast.success(`${importedPieces.length} peças importadas com sucesso!`);
  };

  const handleImportProject = (projectData: any) => {
    if (!projectData) return;
    
    // Update project data in context
    if (projectData.projectName) {
      setProjectName(projectData.projectName);
    }
    
    if (projectData.sheet) {
      setSheet(projectData.sheet);
    }
    
    if (projectData.pieces) {
      setPieces(projectData.pieces);
    }
    
    if (projectData.placedPieces) {
      setPlacedPieces(projectData.placedPieces);
    }
    
    setOpen(false);
    toast.success(`Projeto "${projectData.projectName || 'Importado'}" carregado com sucesso!`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 mb-4">
          <Upload size={16} />
          Importar Peças
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importar Peças</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <TextImportTab 
            onImportSuccess={handleImportSuccess} 
            onImportProject={handleImportProject}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
