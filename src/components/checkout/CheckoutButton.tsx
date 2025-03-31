
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogClose 
} from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { PaymentStatus } from "./CheckoutModal";
import { 
  CheckoutComplete,
  CheckoutLoading,
  CheckoutForm,
  ProductDisplay,
  useCheckout
} from './checkout-button';

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
  customerData?: { name: string; email: string };
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  productId,
  productName,
  productDescription,
  productPrice,
  productImage,
  buttonText = "Assinar agora",
  buttonVariant = "default",
  buttonSize = "default",
  className,
  onPaymentComplete,
  customerData
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    isLoading,
    paymentStatus,
    isCheckoutReady,
    checkoutContainerRef,
    initCheckout,
    resetCheckout
  } = useCheckout(
    {
      id: productId,
      name: productName,
      description: productDescription,
      price: productPrice,
      image: productImage
    },
    customerData,
    onPaymentComplete
  );

  // Initialize checkout when modal opens
  useEffect(() => {
    if (isModalOpen && !isCheckoutReady && !paymentStatus) {
      initCheckout();
    }
  }, [isModalOpen, isCheckoutReady, paymentStatus]);
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetCheckout();
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
      
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          {paymentStatus !== 'approved' && (
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </DialogClose>
          )}
          
          <ProductDisplay 
            productName={productName}
            productDescription={productDescription}
            productPrice={productPrice}
          />
          
          <div className="p-6">
            {paymentStatus === 'approved' ? (
              <CheckoutComplete productName={productName} />
            ) : isLoading ? (
              <CheckoutLoading />
            ) : (
              <CheckoutForm containerRef={checkoutContainerRef} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutButton;
