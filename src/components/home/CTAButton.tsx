
import React from 'react';
import { Button } from "@/components/ui/button";
import UserRegistrationDialog from './UserRegistrationDialog';
import CTAButtonLogic from './CTAButtonLogic';
import UserRegistrationCheckout from '../checkout/UserRegistrationCheckout';

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
  const { 
    handleButtonClick, 
    userDialogOpen, 
    setUserDialogOpen,
    checkoutOpen,
    setCheckoutOpen,
    userCredentials,
    handlePaymentComplete,
    form,
    onSubmit
  } = CTAButtonLogic({ 
    productId, 
    showCheckout 
  });

  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        className={className}
        onClick={handleButtonClick}
      >
        {buttonText}
      </Button>
      
      <UserRegistrationDialog 
        userDialogOpen={userDialogOpen}
        setUserDialogOpen={setUserDialogOpen}
        form={form}
        onSubmit={onSubmit}
      />
      
      {userCredentials && (
        <UserRegistrationCheckout 
          isOpen={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          product={{
            id: productId,
            name: productName,
            description: productDescription,
            price: productPrice
          }}
          userCredentials={userCredentials}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </>
  );
};

export default CTAButton;
