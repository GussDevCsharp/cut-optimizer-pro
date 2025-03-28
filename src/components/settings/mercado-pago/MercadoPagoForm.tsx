
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MercadoPagoFormValues, mercadoPagoSchema } from './types';
import { SandboxToggle } from './SandboxToggle';
import { ApiKeysFields } from './ApiKeysFields';
import { ConfigAlerts } from './ConfigAlerts';
import { SaveButton } from './SaveButton';

interface MercadoPagoFormProps {
  initialValues: MercadoPagoFormValues;
}

export function MercadoPagoForm({ initialValues }: MercadoPagoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Initialize the form
  const form = useForm<MercadoPagoFormValues>({
    resolver: zodResolver(mercadoPagoSchema),
    defaultValues: initialValues,
  });

  // Detect if production mode conflicts with test keys
  const productionModeWithTestKeys = 
    !form.watch('isSandbox') && 
    (form.watch('publicKey')?.startsWith('TEST-') || form.watch('accessToken')?.startsWith('TEST-'));

  // Detect if both keys are production keys
  const hasProductionKeys = 
    form.watch('publicKey') && 
    !form.watch('publicKey').startsWith('TEST-') && 
    form.watch('accessToken') && 
    !form.watch('accessToken').startsWith('TEST-');

  // Save configurations
  const onSubmit = async (values: MercadoPagoFormValues) => {
    try {
      setIsLoading(true);
      
      // Check for production mode with test keys
      if (!values.isSandbox && (values.publicKey.startsWith('TEST-') || values.accessToken.startsWith('TEST-'))) {
        const confirmed = window.confirm(
          'ATENÇÃO: Você está tentando usar o modo de produção com chaves de teste. ' +
          'Isso não funcionará corretamente para processar pagamentos reais. ' +
          '\n\nRecomendamos que você:\n' +
          '1. Mantenha o modo de homologação (sandbox) ATIVO enquanto estiver usando chaves de teste, OU\n' +
          '2. Configure chaves de produção válidas para usar o modo de produção.\n\n' +
          'Deseja continuar mesmo assim?'
        );
        
        if (!confirmed) {
          setIsLoading(false);
          return;
        }
      }
      
      // Check if a record already exists
      const { data: existingConfig, error: checkError } = await supabase
        .from('system_settings')
        .select('id')
        .eq('key', 'mercado_pago_config')
        .maybeSingle();
      
      if (checkError && checkError.code === '42P01') {
        // Table doesn't exist, try to create it
        await supabase.rpc('create_system_settings_table');
        
        // Insert new record
        const { error: insertError } = await supabase
          .from('system_settings')
          .insert({
            key: 'mercado_pago_config',
            settings: values,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (insertError) throw insertError;
      } else if (checkError) {
        throw checkError;
      } else {
        let saveError;
        
        // Update or insert
        if (existingConfig) {
          const { error } = await supabase
            .from('system_settings')
            .update({ 
              settings: values,
              updated_at: new Date().toISOString()
            })
            .eq('key', 'mercado_pago_config');
            
          saveError = error;
        } else {
          const { error } = await supabase
            .from('system_settings')
            .insert({
              key: 'mercado_pago_config',
              settings: values,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          saveError = error;
        }
        
        if (saveError) throw saveError;
      }
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      
      // Mostrar mensagem específica se estiver ativando o modo de produção corretamente
      if (!values.isSandbox && hasProductionKeys) {
        toast.success('Modo de produção ativado com sucesso', {
          description: 'O sistema está configurado para processar pagamentos reais.'
        });
      } else {
        toast.success('Configurações do Mercado Pago salvas com sucesso');
      }
      
      // Reload the page to reinitialize the Mercado Pago SDK
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar configurações do Mercado Pago:', error);
      toast.error('Não foi possível salvar as configurações');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ConfigAlerts 
          productionModeWithTestKeys={productionModeWithTestKeys}
          hasProductionKeys={hasProductionKeys}
          isSandbox={form.watch('isSandbox')}
        />

        <SandboxToggle form={form} />
        
        <ApiKeysFields form={form} />
        
        <div className="pt-4">
          <SaveButton isLoading={isLoading} isSaved={isSaved} />
        </div>
      </form>
    </Form>
  );
}
