
import React, { useState } from 'react';
import { generatePixPayment, CustomerData } from "@/services/mercadoPago";
import { ProductInfo, PaymentStatus } from "../../CheckoutModal";
import { PixForm, PixQRCode } from './';

interface PixPaymentProps {
  product: ProductInfo;
  onProcessing: (isProcessing: boolean) => void;
  onComplete: (status: PaymentStatus, paymentId?: string) => void;
}

interface PixPaymentResponse {
  status: PaymentStatus;
  paymentId: string;
  qrCode: string;
  qrCodeBase64: string;
  qrCodeText: string;
  expirationDate: string;
}

const PixPayment: React.FC<PixPaymentProps> = ({ product, onProcessing, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PixPaymentResponse | null>(null);

  // Handle form submission from the PixForm component
  const handleSubmit = async (customerData: CustomerData) => {
    try {
      setIsLoading(true);
      onProcessing(true);
      
      // Call the service to generate a Pix payment
      const response = await generatePixPayment(product, customerData) as PixPaymentResponse;
      
      setPaymentData(response);
      onComplete('pending', response.paymentId);
    } catch (error) {
      console.error('Error generating Pix payment:', error);
      onComplete('error');
    } finally {
      setIsLoading(false);
      onProcessing(false);
    }
  };

  // If payment data is available, show QR code
  if (paymentData) {
    return (
      <PixQRCode
        qrCodeUrl={paymentData.qrCode}
        qrCodeText={paymentData.qrCodeText}
        expirationDate={paymentData.expirationDate}
      />
    );
  }

  // Show form to collect customer data
  return (
    <PixForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default PixPayment;
