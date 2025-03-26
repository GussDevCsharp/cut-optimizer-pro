
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DuplicateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DuplicateDialog: React.FC<DuplicateDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Duplicar Peça</DialogTitle>
          <DialogDescription>
            Deseja duplicar a peça selecionada?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" onClick={onConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
