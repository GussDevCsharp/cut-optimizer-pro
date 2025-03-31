
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PaymentStatus } from './CheckoutModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader, CheckCircle, X } from 'lucide-react';
import { createCheckoutPreference, initCheckoutBricks } from "@/services/mercadoPagoService";

interface UserRegistrationCheckoutProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
  };
  userCredentials: {
    name: string;
    email: string;
    password: string;
  };
  onPaymentComplete?: (status: PaymentStatus, paymentId?: string) => void;
}

const UserRegistrationCheckout: React.FC<UserRegistrationCheckoutProps> = ({
  isOpen,
  onOpenChange,
  product,
  userCredentials,
  onPaymentComplete
}) => {
  const { register } = useAuth();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [checkoutInitialized, setCheckoutInitialized] = useState(false);

  React.useEffect(() => {
    if (isOpen && !checkoutInitialized) {
      initializeCheckout();
    }
  }, [isOpen]);

  const initializeCheckout = async () => {
    setIsLoading(true);
    try {
      const preference = await createCheckoutPreference(
        product,
        { name: userCredentials.name, email: userCredentials.email }
      );
      
      // Wait a bit for DOM to be ready
      setTimeout(async () => {
        const success = await initCheckoutBricks(
          'user-registration-checkout-container', 
          preference.preferenceId,
          handlePaymentComplete
        );
        
        if (success) {
          setCheckoutInitialized(true);
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao inicializar pagamento",
            description: "Não foi possível carregar o checkout. Por favor, tente novamente."
          });
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

  const handlePaymentComplete = async (status: PaymentStatus, paymentId?: string) => {
    setPaymentStatus(status);
    
    // Only register the user if payment was successful
    if (status === 'approved' && !isRegistering) {
      setIsRegistering(true);
      try {
        // Register the user with the provided credentials
        await register(
          userCredentials.name, 
          userCredentials.email, 
          userCredentials.password
        );
        
        toast({
          title: "Conta criada com sucesso!",
          description: "Seu acesso à plataforma foi ativado.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao criar conta",
          description: error.message || "Não foi possível criar sua conta. Entre em contato com o suporte.",
        });
        console.error("Erro ao registrar usuário após pagamento:", error);
      } finally {
        setIsRegistering(false);
      }
    }
    
    // Call the original onPaymentComplete callback
    if (onPaymentComplete) {
      onPaymentComplete(status, paymentId);
    }
  };

  // Format currency
  const formatCurrency = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  const handleCloseDialog = () => {
    // Only allow closing if not processing payment
    if (!isRegistering) {
      onOpenChange(false);
      setCheckoutInitialized(false);
      setPaymentStatus(null);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {paymentStatus !== 'approved' && !isRegistering && (
          <button 
            onClick={handleCloseDialog} 
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </button>
        )}
        
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
          <p className="mt-2 text-xl font-bold">{formatCurrency(product.price)}</p>
        </div>
        
        <div className="p-6">
          {paymentStatus === 'approved' ? (
            <div className="flex flex-col items-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Pagamento Aprovado!</h3>
              <p className="text-center text-muted-foreground mb-6">
                Seu pagamento foi processado com sucesso e sua conta foi criada.
                Você será redirecionado para a plataforma em instantes.
              </p>
            </div>
          ) : isRegistering ? (
            <div className="flex flex-col items-center py-8">
              <Loader className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-center text-muted-foreground">
                Criando sua conta...
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
              </DialogHeader>
              
              <div id="user-registration-checkout-container" className="min-h-[300px]"></div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserRegistrationCheckout;
