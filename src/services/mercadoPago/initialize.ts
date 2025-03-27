
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
      
      // Caso a tabela não exista, criar a tabela
      if (error.code === '42P01') { // relation does not exist
        try {
          // Criar a tabela system_settings
          await supabase.rpc('create_system_settings_table');
          
          // Inserir as configurações padrão
          await supabase.from('system_settings').insert({
            key: 'mercado_pago_config',
            settings: {
              publicKey: 'TEST-743d3338-610c-4c0c-b612-8a9a5a9158ca',
              accessToken: 'TEST-4308462599599565-022917-9343d6c28269cc4a693dfb9f0a6c7db6-458831007',
              isSandbox: true
            }
          });
          
          // Retornar as configurações padrão
          return {
            publicKey: 'TEST-743d3338-610c-4c0c-b612-8a9a5a9158ca',
            accessToken: 'TEST-4308462599599565-022917-9343d6c28269cc4a693dfb9f0a6c7db6-458831007',
            isSandbox: true
          };
        } catch (createError) {
          console.error('Erro ao criar tabela system_settings:', createError);
          toast.error('Erro ao configurar o Mercado Pago. Entre em contato com o suporte.');
        }
      }
      
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
        isSandbox: data.settings.isSandbox !== false
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

// Initialize Mercado Pago SDK
export const initMercadoPago = async (): Promise<void> => {
  if (window.MercadoPago) return Promise.resolve();
  
  return new Promise(async (resolve, reject) => {
    try {
      // Obter a chave pública das configurações
      const config = await getMercadoPagoConfig();
      const publicKey = config.publicKey;
      
      // Create script element
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.type = 'text/javascript';
      script.onload = () => {
        if (window.MercadoPago) {
          const mp = new window.MercadoPago(publicKey);
          window.mercadoPagoInstance = mp;
          resolve();
        } else {
          reject(new Error('MercadoPago SDK failed to load'));
        }
      };
      script.onerror = () => {
        reject(new Error('Failed to load MercadoPago SDK'));
      };
      document.body.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
};

// Get Mercado Pago instance
export const getMercadoPagoInstance = async () => {
  if (!window.mercadoPagoInstance) {
    await initMercadoPago();
  }
  
  return window.mercadoPagoInstance;
};

// Create payment preference (would be called from your backend)
// This is a mock function. In a real implementation, this would make a call to your backend
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
