
// Inicialização do SDK do Mercado Pago
import { supabase } from "@/integrations/supabase/client";

// Obter a chave pública das configurações
export const getMercadoPagoConfig = async () => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('settings')
      .eq('key', 'mercado_pago_config')
      .single();
      
    if (error) {
      console.error('Erro ao carregar configurações do Mercado Pago:', error);
      return {
        publicKey: 'TEST-8f683d0c-1025-48db-8f1e-dae8d7f94a15', // Chave de teste padrão
        isSandbox: true
      };
    }
    
    if (data?.settings) {
      return {
        publicKey: data.settings.publicKey,
        accessToken: data.settings.accessToken,
        isSandbox: data.settings.isSandbox !== false
      };
    }
    
    return {
      publicKey: 'TEST-8f683d0c-1025-48db-8f1e-dae8d7f94a15', // Chave de teste padrão
      isSandbox: true
    };
  } catch (error) {
    console.error('Erro ao obter configurações do Mercado Pago:', error);
    return {
      publicKey: 'TEST-8f683d0c-1025-48db-8f1e-dae8d7f94a15', // Chave de teste padrão
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
          window.MercadoPago.setPublishableKey(publicKey);
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
  if (!window.MercadoPago) {
    await initMercadoPago();
  }
  
  const config = await getMercadoPagoConfig();
  return new window.MercadoPago(config.publicKey);
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
        preferenceId: `MOCK_PREFERENCE_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      });
    }, 1000);
  });
};
