
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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
  const [isRegistering, setIsRegistering] = useState(false);

  const handlePaymentComplete = async (status: PaymentStatus, paymentId?: string) => {
    console.log("Payment status in UserRegistrationCheckout:", status);
    
    // Only register the user if payment was successful and not already registering
    if (status === 'approved' && !isRegistering) {
      setIsRegistering(true);
      try {
        console.log("Attempting to register user:", userCredentials.email);
        
        // Register the user with the provided credentials
        await register(
          userCredentials.name, 
          userCredentials.email, 
          userCredentials.password
        );
        
        // Get the current user after registration
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Insert user data into profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: userCredentials.name,
              email: userCredentials.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (profileError) {
            console.error("Error inserting profile data:", profileError);
            // We don't throw here as user is already registered
          }
          
          // Insert transaction data
          const { error: transactionError } = await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              product_id: product.id,
              product_name: product.name,
              amount: product.price,
              payment_method: 'card',
              payment_status: 'approved',
              payment_id: paymentId || '',
              created_at: new Date().toISOString()
            });
          
          if (transactionError) {
            console.error("Error inserting transaction data:", transactionError);
            // We don't throw here as profile is already created
          }
        }
        
        toast.success("Conta criada com sucesso!", {
          description: "Seu acesso à plataforma foi ativado.",
        });
        
        console.log("User registration successful for:", userCredentials.email);
      } catch (error: any) {
        console.error("Erro ao registrar usuário após pagamento:", error);
        toast.error("Erro ao criar conta", {
          description: error.message || "Não foi possível criar sua conta. Entre em contato com o suporte.",
        });
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
