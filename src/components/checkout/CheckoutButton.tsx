
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogClose 
} from "@/components/ui/dialog";
import { Loader, CheckCircle, X } from 'lucide-react';
import { PaymentStatus } from "./CheckoutModal";
import { createCheckoutPreference, initCheckoutBricks } from "@/services/mercadoPagoService";
import { useToast } from "@/hooks/use-toast";

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
  const [isLoading, setIsLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isCheckoutReady, setIsCheckoutReady] = useState(false);
  const checkoutContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize checkout when modal opens
  useEffect(() => {
    if (isModalOpen && !isCheckoutReady && !paymentStatus) {
      const initCheckout = async () => {
        setIsLoading(true);
        try {
          // Get preference ID
          const preference = await createCheckoutPreference(
            {
              id: productId,
              name: productName,
              description: productDescription,
              price: productPrice,
              image: productImage
            },
            customerData
          );
          
          setPreferenceId(preference.preferenceId);
          
          // Make sure the container is rendered
          setTimeout(async () => {
            if (checkoutContainerRef.current && preference.preferenceId) {
              const success = await initCheckoutBricks(
                'checkout-container', 
                preference.preferenceId,
                handlePaymentComplete
              );
              
              if (success) {
                setIsCheckoutReady(true);
              } else {
                toast({
                  variant: "destructive",
                  title: "Erro ao inicializar pagamento",
                  description: "Não foi possível carregar o checkout. Por favor, tente novamente."
                });
              }
            }
            setIsLoading(false);
          }, 500);
        } catch (error) {
          console.error("Failed to initialize checkout:", error);
          setIsLoading(false);
          toast({
            variant: "destructive",
            title: "Erro ao inicializar checkout",
            description: "Ocorreu um erro ao preparar o checkout. Por favor, tente novamente."
          });
        }
      };
      
      initCheckout();
    }
  }, [isModalOpen, isCheckoutReady, paymentStatus]);

  const handlePaymentComplete = (status: PaymentStatus, paymentId?: string) => {
    setPaymentStatus(status);
    
    // Call the callback if provided
    if (onPaymentComplete) {
      onPaymentComplete(status, paymentId);
    }
    
    // Close modal on approved after a delay
    if (status === 'approved') {
      setTimeout(() => {
        setIsModalOpen(false);
        resetCheckout();
      }, 3000);
    }
  };
  
  const resetCheckout = () => {
    setIsCheckoutReady(false);
    setPreferenceId(null);
    setPaymentStatus(null);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetCheckout();
  };
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
          
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">{productName}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{productDescription}</p>
            <p className="mt-2 text-xl font-bold">{formatCurrency(productPrice)}</p>
          </div>
          
          <div className="p-6">
            {paymentStatus === 'approved' ? (
              <div className="flex flex-col items-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Pagamento Aprovado!</h3>
                <p className="text-center text-muted-foreground mb-6">
                  Seu pagamento foi processado com sucesso. Você será redirecionado em instantes.
                </p>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center py-12">
                <Loader className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-center text-muted-foreground">
                  Inicializando o checkout...
                </p>
              </div>
            ) : (
              <div>
                <DialogHeader className="mb-4">
                  <DialogTitle>Finalizar compra</DialogTitle>
                  <DialogDescription>
                    Escolha a forma de pagamento que preferir.
                  </DialogDescription>
                </DialogHeader>
                
                <div id="checkout-container" ref={checkoutContainerRef} className="min-h-[300px]"></div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutButton;
