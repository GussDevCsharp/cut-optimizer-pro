
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { CreditCard, QrCode, FileText } from 'lucide-react';
import { ProductInfo, PaymentStatus } from '../CheckoutModal';
import PixPayment from "../payment-methods/PixPayment";
import CardPayment from "../payment-methods/CardPayment";
import BoletoPayment from "../payment-methods/BoletoPayment";

interface PaymentMethodTabsProps {
  product: ProductInfo;
  paymentMethod: 'pix' | 'card' | 'boleto';
  setPaymentMethod: (method: 'pix' | 'card' | 'boleto') => void;
  onProcessing: (isProcessing: boolean) => void;
  onComplete: (status: PaymentStatus, paymentId?: string) => void;
}

const PaymentMethodTabs: React.FC<PaymentMethodTabsProps> = ({
  product,
  paymentMethod,
  setPaymentMethod,
  onProcessing,
  onComplete
}) => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 mb-6 border rounded-md overflow-hidden">
        <button
          className={`flex items-center justify-center space-x-2 p-3 ${
            paymentMethod === 'card' ? 'bg-primary text-primary-foreground' : 'bg-background'
          }`}
          onClick={() => setPaymentMethod('card')}
        >
          <CreditCard className="h-4 w-4" />
          <span>Cartão</span>
        </button>
        <button
          className={`flex items-center justify-center space-x-2 p-3 ${
            paymentMethod === 'pix' ? 'bg-primary text-primary-foreground' : 'bg-background'
          }`}
          onClick={() => setPaymentMethod('pix')}
        >
          <QrCode className="h-4 w-4" />
          <span>Pix</span>
        </button>
        <button
          className={`flex items-center justify-center space-x-2 p-3 ${
            paymentMethod === 'boleto' ? 'bg-primary text-primary-foreground' : 'bg-background'
          }`}
          onClick={() => setPaymentMethod('boleto')}
        >
          <FileText className="h-4 w-4" />
          <span>Boleto</span>
        </button>
      </div>

      <div className="mt-4">
        {paymentMethod === 'pix' && (
          <PixPayment
            product={product}
            onProcessing={onProcessing}
            onComplete={onComplete}
          />
        )}

        {paymentMethod === 'card' && (
          <CardPayment
            product={product}
            onProcessing={onProcessing}
            onComplete={onComplete}
          />
        )}

        {paymentMethod === 'boleto' && (
          <BoletoPayment
            product={product}
            onProcessing={onProcessing}
            onComplete={onComplete}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentMethodTabs;
