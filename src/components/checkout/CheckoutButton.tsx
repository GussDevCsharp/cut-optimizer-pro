
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import CheckoutModal from "./CheckoutModal";
import { PaymentStatus } from "./CheckoutModal";

interface CheckoutButtonProps {
  productId: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productImage?: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onPaymentComplete?: (status: PaymentStatus, paymentId?: string) => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  productId,
  productName,
  productDescription,
  productPrice,
  productImage,
  buttonText = "Comprar agora",
  buttonVariant = "default",
  buttonSize = "default",
  className,
  onPaymentComplete
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePaymentComplete = (status: PaymentStatus, paymentId?: string) => {
    // Handle successful payment (redirect, show message, etc)
    if (onPaymentComplete) {
      onPaymentComplete(status, paymentId);
    }
    
    // Close modal on approved or after error/rejection is acknowledged
    if (status === 'approved') {
      // Redirect to success page after a brief delay
      setTimeout(() => {
        setIsModalOpen(false);
        // Optional: redirect to thank you page
        // window.location.href = '/obrigado';
      }, 3000);
    }
  };
  
  return (
    <>
      <Button 
        variant={buttonVariant} 
        size={buttonSize}
        className={className}
        onClick={() => setIsModalOpen(true)}
      >
        {buttonText}
      </Button>
      
      <CheckoutModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        product={{
          id: productId,
          name: productName,
          description: productDescription,
          price: productPrice,
          image: productImage
        }}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
};

export default CheckoutButton;
