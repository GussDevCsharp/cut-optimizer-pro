
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CheckoutFormProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ containerRef }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* First column with information */}
      <div className="space-y-4">
        <DialogHeader>
          <DialogTitle>Finalizar compra</DialogTitle>
          <DialogDescription>
            Escolha a forma de pagamento que preferir.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted/30 p-4 rounded-md">
          <h3 className="font-medium mb-2">Informações importantes</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Pagamento processado com segurança</li>
            <li>• Liberação imediata após confirmação</li>
            <li>• Suporte disponível em caso de dúvidas</li>
          </ul>
        </div>
      </div>

      {/* Second column with checkout container */}
      <div className="border rounded-md p-4 bg-background">
        <div id="checkout-container" ref={containerRef} className="min-h-[300px]"></div>
      </div>
    </div>
  );
};

export default CheckoutForm;
