
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CancelSubscriptionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  handleCancelSubscription: () => void;
  isPending: boolean;
}

export function CancelSubscriptionDialog({
  isOpen,
  onOpenChange,
  handleCancelSubscription,
  isPending
}: CancelSubscriptionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancelar Assinatura</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja cancelar esta assinatura? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => onOpenChange(false)}
          >
            Voltar
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            onClick={handleCancelSubscription}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Confirmar Cancelamento'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
