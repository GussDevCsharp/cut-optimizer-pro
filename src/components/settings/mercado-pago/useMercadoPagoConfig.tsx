
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { MercadoPagoFormValues, DEFAULT_MP_CONFIG } from './types';

export function useMercadoPagoConfig() {
  const [config, setConfig] = useState<MercadoPagoFormValues>(DEFAULT_MP_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        const { data, error } = await supabase
          .from('system_settings')
          .select('settings')
          .eq('key', 'mercado_pago_config')
          .single();
          
        if (error) {
          if (error.code === '42P01') { // relation does not exist
            try {
              // Create the system_settings table
              await supabase.rpc('create_system_settings_table');
              
              // Insert default settings
              await supabase.from('system_settings').insert({
                key: 'mercado_pago_config',
                settings: DEFAULT_MP_CONFIG
              });
              
              // Default settings are already in the form
            } catch (createError) {
              console.error('Erro ao criar tabela system_settings:', createError);
              setHasError(true);
            }
          } else if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Erro ao carregar configurações do Mercado Pago:', error);
            setHasError(true);
          }
        } else if (data?.settings) {
          setConfig({
            publicKey: data.settings.publicKey || DEFAULT_MP_CONFIG.publicKey,
            accessToken: data.settings.accessToken || DEFAULT_MP_CONFIG.accessToken,
            isSandbox: data.settings.isSandbox !== false, // default to true
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do Mercado Pago:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfig();
  }, []);

  return { config, isLoading, hasError };
}
