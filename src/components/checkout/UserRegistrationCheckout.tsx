
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
    console.log("------ FLUXO DE PAGAMENTO E REGISTRO ------");
    console.log("1. Status do pagamento:", status);
    console.log("2. ID do pagamento:", paymentId || "Não disponível");
    
    // Apenas registra o usuário se o pagamento foi bem-sucedido e não está já registrando
    if (status === 'approved' && !isRegistering) {
      setIsRegistering(true);
      try {
        console.log("3. Iniciando registro do usuário:", userCredentials.email);
        
        // Registra o usuário com as credenciais fornecidas
        await register(
          userCredentials.name, 
          userCredentials.email, 
          userCredentials.password
        );
        
        console.log("4. Usuário registrado com sucesso, obtendo dados do usuário");
        
        // Obtém o usuário atual após o registro
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log("5. Usuário encontrado, ID:", user.id);
          
          // Insere dados do usuário na tabela profiles
          console.log("6. Inserindo dados na tabela profiles");
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
            console.error("7. Erro ao inserir dados do perfil:", profileError);
            // Não lançamos erro aqui, pois o usuário já está registrado
          } else {
            console.log("7. Perfil criado com sucesso");
          }
          
          // Insere dados da transação
          console.log("8. Inserindo dados da transação");
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
            console.error("9. Erro ao inserir dados da transação:", transactionError);
            // Não lançamos erro aqui, pois o perfil já foi criado
          } else {
            console.log("9. Transação registrada com sucesso");
          }
        } else {
          console.error("5. Usuário não encontrado após registro");
        }
        
        toast.success("Conta criada com sucesso!", {
          description: "Seu acesso à plataforma foi ativado.",
        });
        
        console.log("10. Processo de registro concluído com sucesso");
      } catch (error: any) {
        console.error("Erro no processo de registro:", error);
        toast.error("Erro ao criar conta", {
          description: error.message || "Não foi possível criar sua conta. Entre em contato com o suporte.",
        });
      } finally {
        setIsRegistering(false);
        console.log("------ FIM DO FLUXO DE REGISTRO ------");
      }
    }
    
    // Chama o callback original de onPaymentComplete
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
