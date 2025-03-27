
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { initMercadoPago } from "@/services/mercadoPago";
import { PaymentSelectionPanel } from "./payment-selection";
import { ProductInfoPanel } from "./product-info";
import PaymentConfirmation from "./PaymentConfirmation";

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
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined);
  const [mpInitialized, setMpInitialized] = useState(false);
  const { toast } = useToast();

  // Initialize Mercado Pago SDK when modal opens
  useEffect(() => {
    if (isOpen && !mpInitialized) {
      initMercadoPago()
        .then(() => {
          setMpInitialized(true);
        })
        .catch(error => {
          console.error("Failed to initialize Mercado Pago:", error);
          toast({
            variant: "destructive",
            title: "Erro ao inicializar pagamento",
            description: "Por favor, tente novamente mais tarde."
          });
        });
    }
  }, [isOpen, mpInitialized, toast]);

  // Handle payment completion callback
  const handlePaymentComplete = (status: PaymentStatus, id?: string) => {
    setPaymentStatus(status);
    if (id) setPaymentId(id);
    
    if (onPaymentComplete) {
      onPaymentComplete(status, id);
    }
    
    // Show toast notification based on status
    if (status === 'approved') {
      toast({
        title: "Pagamento aprovado!",
        description: "Seu pagamento foi processado com sucesso.",
      });
    } else if (status === 'rejected' || status === 'error') {
      toast({
        variant: "destructive",
        title: "Falha no pagamento",
        description: "Houve um problema com seu pagamento. Por favor, tente novamente.",
      });
    }
  };

  // Reset state when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Only reset if payment is not in progress
      if (!isProcessing) {
        setPaymentMethod('pix');
        setPaymentStatus('pending');
        setPaymentId(undefined);
      }
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
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
