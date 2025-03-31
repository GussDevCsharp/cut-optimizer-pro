
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema for validating user registration data
export const userSchema = z.object({
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

export const useLeadManagement = () => {
  const saveLeadToDatabase = async (data: UserFormValues, source?: string) => {
    try {
      console.log('Saving lead to database:', { 
        name: data.name, 
        email: data.email 
      });
      
      // Save lead to database with enhanced error handling
      const { data: leadData, error } = await supabase
        .from('leads')
        .insert({
          name: data.name,
          email: data.email,
          address: data.address,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'pending',
          source: source || 'cta_button'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving lead:', error);
        throw error;
      }
      
      console.log('Lead saved successfully:', leadData);
      toast.success('Dados salvos com sucesso!');
      
      return leadData.id;
    } catch (error: any) {
      console.error('Error saving lead:', error);
      toast.error('Erro ao salvar dados. Tente novamente.', {
        description: error.message || 'Houve um problema ao salvar seus dados.'
      });
      return null;
    }
  };
  
  const updateLeadStatus = async (leadId: string, status: 'converted' | 'canceled', paymentId?: string) => {
    try {
      console.log('Updating lead status:', leadId, status);
      
      const { error } = await supabase
        .from('leads')
        .update({
          status,
          payment_id: paymentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);
        
      if (error) {
        console.error('Error updating lead status:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating lead status:', error);
      return false;
    }
  };
  
  return {
    saveLeadToDatabase,
    updateLeadStatus
  };
};
