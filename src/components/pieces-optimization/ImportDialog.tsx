
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: () => void;
  onCancel: () => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onImport, 
  onCancel 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Importar CSV</DialogTitle>
          <DialogDescription>
            Deseja importar as peças do arquivo CSV?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button onClick={onImport}>Importar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
