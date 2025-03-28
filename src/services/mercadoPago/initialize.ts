
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

// Initialize Mercado Pago SDK
export const initMercadoPago = async (): Promise<void> => {
  try {
    const config = await getMercadoPagoConfig();
    
    // Verifica se o script já foi carregado
    if (document.getElementById('mercadopago-script')) {
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = 'mercadopago-script';
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.type = 'text/javascript';
      
      script.onload = () => {
        try {
          if (window.MercadoPago) {
            window.mercadoPagoInstance = new window.MercadoPago(config.publicKey, {
              locale: 'pt-BR'
            });
            console.log('Mercado Pago SDK inicializado com sucesso');
            resolve();
          } else {
            console.error('Mercado Pago SDK não disponível após carregamento');
            reject(new Error('Mercado Pago SDK not available after loading'));
          }
        } catch (err) {
          console.error('Erro ao inicializar Mercado Pago SDK:', err);
          reject(err);
        }
      };
      
      script.onerror = (error) => {
        console.error('Erro ao carregar script do Mercado Pago:', error);
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('Erro ao inicializar Mercado Pago:', error);
    return Promise.reject(error);
  }
};

// Get Mercado Pago instance 
export const getMercadoPagoInstance = async () => {
  // Se já temos uma instância, retorna ela
  if (window.mercadoPagoInstance) {
    return window.mercadoPagoInstance;
  }
  
  // Caso contrário, inicializa o SDK
  await initMercadoPago();
  return window.mercadoPagoInstance;
};

// Create payment preference (would normally be called from your backend)
export const createPaymentPreference = async (
  product: import('./types').ProductInfo, 
  paymentMethod: 'pix' | 'card' | 'boleto'
): Promise<{ preferenceId: string }> => {
  try {
    // Em um ambiente real, isso seria uma chamada para seu backend
    // que interage com a API do Mercado Pago para criar a preferência
    const response = await fetch('/api/create-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product,
        paymentMethod
      }),
    });
    
    if (!response.ok) {
      throw new Error('Falha ao criar preferência de pagamento');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    
    // Fallback para simulação em ambiente de desenvolvimento
    return {
      preferenceId: `TEST-PREFERENCE-${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };
  }
};
