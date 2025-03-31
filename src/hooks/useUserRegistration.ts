
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useUserRegistration = () => {
  const navigate = useNavigate();
  
  const registerUserAfterPayment = async (
    userData: {
      name: string;
      email: string;
      address: string;
      password: string;
    },
    productId: string,
    paymentId?: string
  ) => {
    try {
      // Register the user after successful payment
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      
      if (error) throw error;
      
      // Create profile for the user
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: userData.name,
            email: userData.email,
            address: userData.address,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (profileError) throw profileError;
        
        // Insert transaction record
        await supabase
          .from('transactions')
          .insert({
            user_id: data.user.id,
            product_id: productId,
            payment_id: paymentId || '',
            payment_method: 'card',
            payment_status: 'approved',
            amount: 0, // This would be set properly in real implementation
            created_at: new Date().toISOString()
          });
      }
      
      toast.success("Cadastro concluído com sucesso!", {
        description: "Seu acesso à plataforma foi ativado."
      });
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
      return true;
    } catch (error: any) {
      console.error('Error registering user:', error);
      toast.error("Erro ao cadastrar usuário", {
        description: error.message || "Por favor, tente novamente."
      });
      return false;
    }
  };
  
  return {
    registerUserAfterPayment
  };
};
