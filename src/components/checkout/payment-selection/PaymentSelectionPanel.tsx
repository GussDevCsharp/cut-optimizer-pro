
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PaymentMethodTabs } from '../payment-methods';
import { ProductInfo, PaymentStatus } from '../CheckoutModal';

interface PaymentSelectionPanelProps {
  product: ProductInfo;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  onComplete: (status: PaymentStatus, paymentId?: string) => void;
  paymentMethod: 'pix' | 'card' | 'boleto';
  setPaymentMethod: (method: 'pix' | 'card' | 'boleto') => void;
}

const PaymentSelectionPanel: React.FC<PaymentSelectionPanelProps> = ({
  product,
  isProcessing,
  setIsProcessing,
  onComplete,
  paymentMethod,
  setPaymentMethod
}) => {
  return (
    <div className="px-6 pb-6">
      <DialogHeader className="pt-4 pb-2">
        <DialogTitle>Escolha o método de pagamento</DialogTitle>
        <DialogDescription>
          Selecione a forma de pagamento que preferir.
        </DialogDescription>
      </DialogHeader>

      <PaymentMethodTabs 
        product={product}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        onComplete={onComplete}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
    </div>
  );
};

export default PaymentSelectionPanel;
