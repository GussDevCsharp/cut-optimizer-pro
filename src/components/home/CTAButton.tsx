import React from 'react';
import CheckoutButton from '../checkout/CheckoutButton';
import { Button } from "@/components/ui/button";

interface CTAButtonProps {
  productId: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showCheckout?: boolean;
}

const CTAButton: React.FC<CTAButtonProps> = ({ 
  productId,
  productName,
  productDescription,
  productPrice,
  buttonText = "Comprar agora",
  buttonVariant = "default",
  buttonSize = "lg",
  className,
  showCheckout = true
}) => {
  // If showCheckout is true, render the CheckoutButton component
  if (showCheckout) {
    return (
      <CheckoutButton
        productId={productId}
        productName={productName}
        productDescription={productDescription}
        productPrice={productPrice}
        buttonText={buttonText}
        buttonVariant={buttonVariant}
        buttonSize={buttonSize}
        className={className}
        onPaymentComplete={(status, paymentId) => {
          console.log('Payment completed with status:', status, 'and ID:', paymentId);
          // Here you could add analytics tracking or other actions
          
          if (status === 'approved') {
            // For example, redirect to thank you page
            // window.location.href = '/obrigado';
          }
        }}
      />
    );
  }
  
  // Otherwise, render a standard button
  return (
    <Button
      variant={buttonVariant}
      size={buttonSize}
      className={className}
      onClick={() => window.location.href = '/cadastro'}
    >
      {buttonText}
    </Button>
  );
};

export default CTAButton;
