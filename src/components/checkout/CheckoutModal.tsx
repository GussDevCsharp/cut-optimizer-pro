
import React from 'react';
import { X } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import PaymentConfirmation from "./PaymentConfirmation";
import ProductSummary from './components/ProductSummary';
import PaymentMethodTabs from './components/PaymentMethodTabs';
import { usePaymentState } from './hooks/usePaymentState';

// Payment status types
export type PaymentStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'error';

// Product information type
export interface ProductInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductInfo;
  onPaymentComplete?: (status: PaymentStatus, paymentId?: string) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  product,
  onPaymentComplete 
}) => {
  const {
    paymentMethod,
    setPaymentMethod,
    paymentStatus,
    isProcessing,
    setIsProcessing,
    paymentId,
    handlePaymentComplete,
    resetPaymentState
  } = usePaymentState(isOpen, onPaymentComplete);

  // Reset state when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetPaymentState();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* Don't show close button during processing */}
        {!isProcessing && (
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        )}

        {/* Show product information */}
        <ProductSummary product={product} />

        {paymentStatus === 'pending' ? (
          <div className="px-6 pb-6">
            <DialogHeader className="pt-4 pb-2">
              <DialogTitle>Escolha o método de pagamento</DialogTitle>
              <DialogDescription>
                Selecione a forma de pagamento que preferir.
              </DialogDescription>
            </DialogHeader>

            <PaymentMethodTabs
              product={product}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onProcessing={setIsProcessing}
              onComplete={handlePaymentComplete}
            />
          </div>
        ) : (
          <PaymentConfirmation 
            status={paymentStatus} 
            paymentMethod={paymentMethod}
            paymentId={paymentId}
            product={product}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
