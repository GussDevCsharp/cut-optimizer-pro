
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CheckoutModal from './CheckoutModal';
import { PaymentStatus } from './CheckoutModal';

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

  const handlePaymentComplete = async (status: PaymentStatus, paymentId?: string) => {
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
  
  return (
    <CheckoutModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      product={product}
      onPaymentComplete={handlePaymentComplete}
    />
  );
};

export default UserRegistrationCheckout;
