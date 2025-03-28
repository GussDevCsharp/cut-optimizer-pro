
import React from 'react';
import { CreditCard, QrCode, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductInfo, PaymentStatus } from "../CheckoutModal";
import { PixPayment } from "./pix";
import { CardPayment } from "./card";
import { BoletoPayment } from "./boleto";

interface PaymentMethodTabsProps {
  product: ProductInfo;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  onComplete: (status: PaymentStatus, paymentId?: string) => void;
  paymentMethod: 'pix' | 'card' | 'boleto';
  setPaymentMethod: (method: 'pix' | 'card' | 'boleto') => void;
}

const PaymentMethodTabs: React.FC<PaymentMethodTabsProps> = ({
  product,
  isProcessing,
  setIsProcessing,
  onComplete,
  paymentMethod,
  setPaymentMethod
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
          onProcessing={setIsProcessing}
          onComplete={onComplete}
        />
      </TabsContent>

      <TabsContent value="card" className="mt-0">
        <CardPayment
          product={product}
          onProcessing={setIsProcessing}
          onComplete={onComplete}
        />
      </TabsContent>

      <TabsContent value="boleto" className="mt-0">
        <BoletoPayment
          product={product}
          onProcessing={setIsProcessing}
          onComplete={onComplete}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PaymentMethodTabs;
