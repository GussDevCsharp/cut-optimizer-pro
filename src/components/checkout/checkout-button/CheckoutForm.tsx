
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CheckoutFormProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ containerRef }) => {
  return (
    <div>
      <DialogHeader className="mb-4">
        <DialogTitle>Finalizar compra</DialogTitle>
        <DialogDescription>
          Escolha a forma de pagamento que preferir.
        </DialogDescription>
      </DialogHeader>
      
      <div id="checkout-container" ref={containerRef} className="min-h-[300px]"></div>
    </div>
  );
};

export default CheckoutForm;
