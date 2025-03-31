
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import UserRegistrationDialog, { UserFormValues } from './UserRegistrationDialog';
import UserRegistrationCheckout from '../checkout/user-registration';
import { ProductInfo, UserCredentials } from './types';

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
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null);
  const navigate = useNavigate();
  
  const handleFormSubmit = (data: UserFormValues) => {
    // Only extract the needed fields for userCredentials
    setUserCredentials({
      name: data.name,
      email: data.email,
      password: data.password
    });
    setUserDialogOpen(false);
    setCheckoutOpen(true);
  };

  const handleButtonClick = () => {
    if (!showCheckout) {
      navigate('/cadastro');
    } else {
      setUserDialogOpen(true);
    }
  };

  const handlePaymentComplete = (status: string, paymentId?: string) => {
    console.log('Payment completed with status:', status, 'and ID:', paymentId);
    
    if (status === 'approved') {
      // Redirect to dashboard after successful payment and registration
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    }
  };
  
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
      
      {/* User registration dialog */}
      <UserRegistrationDialog
        isOpen={userDialogOpen}
        onOpenChange={setUserDialogOpen}
        onSubmit={handleFormSubmit}
      />
      
      {/* Checkout dialog */}
      {userCredentials && (
        <UserRegistrationCheckout 
          isOpen={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          planId={productId}
          userCredentials={userCredentials}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </>
  );
};

export default CTAButton;
