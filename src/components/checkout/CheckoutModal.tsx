
import React, { useState, useEffect } from 'react';
import { X, CreditCard, QrCode, FileText, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { initMercadoPago } from "@/services/mercadoPago";
import PixPayment from "./payment-methods/PixPayment";
import CardPayment from "./payment-methods/CardPayment";
import BoletoPayment from "./payment-methods/BoletoPayment";
import PaymentConfirmation from "./PaymentConfirmation";
import { cn } from "@/lib/utils";

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

  // Format price to Brazilian currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

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

        {/* Show product information */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
          <p className="mt-2 text-xl font-bold">{formatPrice(product.price)}</p>
        </div>

        {paymentStatus === 'pending' ? (
          <div className="px-6 pb-6">
            <DialogHeader className="pt-4 pb-2">
              <DialogTitle>Escolha o método de pagamento</DialogTitle>
              <DialogDescription>
                Selecione a forma de pagamento que preferir.
              </DialogDescription>
            </DialogHeader>

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
                  onComplete={handlePaymentComplete}
                />
              </TabsContent>

              <TabsContent value="card" className="mt-0">
                <CardPayment
                  product={product}
                  onProcessing={setIsProcessing}
                  onComplete={handlePaymentComplete}
                />
              </TabsContent>

              <TabsContent value="boleto" className="mt-0">
                <BoletoPayment
                  product={product}
                  onProcessing={setIsProcessing}
                  onComplete={handlePaymentComplete}
                />
              </TabsContent>
            </Tabs>
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
