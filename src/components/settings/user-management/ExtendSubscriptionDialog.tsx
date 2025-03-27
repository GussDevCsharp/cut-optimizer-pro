
import React from 'react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExtendSubscriptionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  renewalDays: string;
  setRenewalDays: (days: string) => void;
  handleExtendSubscription: () => void;
  isPending: boolean;
}

export function ExtendSubscriptionDialog({
  isOpen,
  onOpenChange,
  renewalDays,
  setRenewalDays,
  handleExtendSubscription,
  isPending
}: ExtendSubscriptionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Renovar Assinatura</DialogTitle>
          <DialogDescription>
            Defina um novo período de validade para a assinatura do usuário.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Select 
              value={renewalDays} 
              onValueChange={setRenewalDays}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 dias (1 mês)</SelectItem>
                <SelectItem value="90">90 dias (3 meses)</SelectItem>
                <SelectItem value="180">180 dias (6 meses)</SelectItem>
                <SelectItem value="365">365 dias (1 ano)</SelectItem>
              </SelectContent>
            </Select>
            {renewalDays && (
              <p className="text-sm text-muted-foreground">
                Nova data de expiração: {format(addDays(new Date(), parseInt(renewalDays)), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            type="button" 
            onClick={handleExtendSubscription}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Confirmar Renovação'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
