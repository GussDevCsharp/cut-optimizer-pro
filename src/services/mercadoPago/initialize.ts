
// Inicialização do SDK do Mercado Pago
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Obter a chave pública das configurações
export const getMercadoPagoConfig = async () => {
  try {
    // Tentar obter as configurações do Mercado Pago do banco de dados
    const { data, error } = await supabase
      .from('system_settings')
      .select('settings')
      .eq('key', 'mercado_pago_config')
      .single();
      
    if (error) {
      console.error('Erro ao carregar configurações do Mercado Pago:', error);
      
      // Retornar as chaves de teste padrão
      return {
        publicKey: 'TEST-743d3338-610c-4c0c-b612-8a9a5a9158ca',
        accessToken: 'TEST-4308462599599565-022917-9343d6c28269cc4a693dfb9f0a6c7db6-458831007',
        isSandbox: true
      };
    }
    
    if (data?.settings) {
      return {
        publicKey: data.settings.publicKey || 'TEST-743d3338-610c-4c0c-b612-8a9a5a9158ca',
        accessToken: data.settings.accessToken || 'TEST-4308462599599565-022917-9343d6c28269cc4a693dfb9f0a6c7db6-458831007',
        isSandbox: data.settings.isSandbox !== false // Se for undefined, assumir true
      };
    }
    
    return {
      publicKey: 'TEST-743d3338-610c-4c0c-b612-8a9a5a9158ca',
      accessToken: 'TEST-4308462599599565-022917-9343d6c28269cc4a693dfb9f0a6c7db6-458831007',
      isSandbox: true
    };
  } catch (error) {
    console.error('Erro ao obter configurações do Mercado Pago:', error);
    return {
      publicKey: 'TEST-743d3338-610c-4c0c-b612-8a9a5a9158ca',
      accessToken: 'TEST-4308462599599565-022917-9343d6c28269cc4a693dfb9f0a6c7db6-458831007',
      isSandbox: true
    };
  }
};

// Initialize Mercado Pago SDK - simplified version
export const initMercadoPago = async (): Promise<void> => {
  // For now, just return a resolved promise
  // This avoids the SDK loading issues
  return Promise.resolve();
};

// Get Mercado Pago instance - simplified version
export const getMercadoPagoInstance = async () => {
  // Return a simple mock instance for now
  return {
    checkout: () => {
      console.log('Mock checkout called');
      return { render: () => console.log('Mock render called') };
    }
  };
};

// Create payment preference (would be called from your backend)
export const createPaymentPreference = async (
  product: import('./types').ProductInfo, 
  paymentMethod: 'pix' | 'card' | 'boleto'
): Promise<{ preferenceId: string }> => {
  // In a real implementation, you would call your backend API that interacts with Mercado Pago's API
  // For this example, we're simulating a successful response
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve({
        preferenceId: `TEST-PREFERENCE-${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      });
    }, 1000);
  });
};
