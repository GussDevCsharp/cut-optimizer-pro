
import React from 'react';
import { ProductInfoPanel } from '../product-info';
import { PaymentSelectionPanel } from '../payment-selection';
import PaymentConfirmation from '../PaymentConfirmation';
import { usePayment } from '../context/PaymentContext';
import { ProductInfo } from '../CheckoutModal';

interface CheckoutContentProps {
  product: ProductInfo;
}

const CheckoutContent: React.FC<CheckoutContentProps> = ({ product }) => {
  const { 
    paymentStatus, 
    paymentMethod, 
    isProcessing, 
    setIsProcessing, 
    handlePaymentComplete, 
    setPaymentMethod,
    paymentId
  } = usePayment();

  return (
    <>
      <ProductInfoPanel product={product} />

      {paymentStatus === 'pending' ? (
        <PaymentSelectionPanel
          product={product}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          onComplete={handlePaymentComplete}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      ) : (
        <PaymentConfirmation 
          status={paymentStatus} 
          paymentMethod={paymentMethod}
          paymentId={paymentId}
          product={product}
        />
      )}
    </>
  );
};

export default CheckoutContent;
