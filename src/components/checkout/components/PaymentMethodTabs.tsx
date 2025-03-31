
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <Tabs 
      value={paymentMethod} 
      onValueChange={(value) => setPaymentMethod(value as any)} 
      className="mt-4"
    >
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="pix" className="flex items-center space-x-2">
          <QrCode className="h-4 w-4" />
          <span>Pix</span>
        </TabsTrigger>
        <TabsTrigger value="card" className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4" />
          <span>Cartão</span>
        </TabsTrigger>
        <TabsTrigger value="boleto" className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Boleto</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pix" className="mt-0">
        <PixPayment
          product={product}
          onProcessing={onProcessing}
          onComplete={onComplete}
        />
      </TabsContent>

      <TabsContent value="card" className="mt-0">
        <CardPayment
          product={product}
          onProcessing={onProcessing}
          onComplete={onComplete}
        />
      </TabsContent>

      <TabsContent value="boleto" className="mt-0">
        <BoletoPayment
          product={product}
          onProcessing={onProcessing}
          onComplete={onComplete}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PaymentMethodTabs;
