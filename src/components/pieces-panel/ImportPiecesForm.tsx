
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from 'lucide-react';
import { Piece } from '../../hooks/useSheetData';
import { ExcelImportTab } from './import/ExcelImportTab';
import { TextImportTab } from './import/TextImportTab';
import { toast } from "sonner";

interface ImportPiecesFormProps {
  onImportPieces: (pieces: Piece[]) => void;
}

export const ImportPiecesForm = ({ onImportPieces }: ImportPiecesFormProps) => {
  const [open, setOpen] = useState(false);
  
  const handleImportSuccess = (importedPieces: Piece[]) => {
    onImportPieces(importedPieces);
    setOpen(false);
    toast.success(`${importedPieces.length} peças importadas com sucesso!`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 mb-4">
          <Upload size={16} />
          Importar Peças
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Peças</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="excel" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="excel">Excel</TabsTrigger>
            <TabsTrigger value="text">Texto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="excel" className="py-4">
            <ExcelImportTab onImportSuccess={handleImportSuccess} />
          </TabsContent>
          
          <TabsContent value="text" className="py-4">
            <TextImportTab onImportSuccess={handleImportSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
