
import { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router-dom';
import { PaymentStatus } from '../checkout/CheckoutModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Schema for validating user registration data
const userSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

export type UserFormValues = z.infer<typeof userSchema>;

interface CTAButtonLogicProps {
  productId: string;
  showCheckout: boolean;
}

const CTAButtonLogic = ({ productId, showCheckout }: CTAButtonLogicProps) => {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [userCredentials, setUserCredentials] = useState<{
    name: string; 
    email: string;
    address: string;
    password: string;
  } | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const saveLeadToDatabase = async (data: UserFormValues) => {
    try {
      // Save lead to database
      const { data: leadData, error } = await supabase
        .from('leads')
        .insert({
          name: data.name,
          email: data.email,
          address: data.address,
          created_at: new Date().toISOString(),
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('Lead saved successfully:', leadData);
      toast.success('Dados salvos com sucesso!');
      
      return leadData.id;
    } catch (error: any) {
      console.error('Error saving lead:', error);
      toast.error('Erro ao salvar dados. Tente novamente.');
      return null;
    }
  };

  const onSubmit = async (data: UserFormValues) => {
    // Save lead to database first
    const id = await saveLeadToDatabase(data);
    
    if (id) {
      setLeadId(id);
      
      // Only extract the needed fields for userCredentials
      setUserCredentials({
        name: data.name,
        email: data.email,
        address: data.address,
        password: data.password
      });
      
      setUserDialogOpen(false);
      setCheckoutOpen(true);
    }
  };

  const handleButtonClick = () => {
    if (!showCheckout) {
      navigate('/cadastro');
    } else {
      setUserDialogOpen(true);
    }
  };

  const handlePaymentComplete = async (status: PaymentStatus, paymentId?: string) => {
    console.log('Payment completed with status:', status, 'and ID:', paymentId);
    
    if (status === 'approved' && userCredentials && leadId) {
      try {
        // Update lead status
        await supabase
          .from('leads')
          .update({ status: 'converted', payment_id: paymentId })
          .eq('id', leadId);
          
        // Register the user after successful payment
        const { data, error } = await supabase.auth.signUp({
          email: userCredentials.email,
          password: userCredentials.password,
          options: {
            data: {
              name: userCredentials.name,
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
              full_name: userCredentials.name,
              email: userCredentials.email,
              address: userCredentials.address,
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
      } catch (error: any) {
        console.error('Error registering user:', error);
        toast.error("Erro ao cadastrar usuário", {
          description: error.message || "Por favor, tente novamente."
        });
      }
    }
  };

  return {
    userDialogOpen,
    setUserDialogOpen,
    checkoutOpen,
    setCheckoutOpen,
    userCredentials,
    handleButtonClick,
    handlePaymentComplete,
    form,
    onSubmit
  };
};

export default CTAButtonLogic;
