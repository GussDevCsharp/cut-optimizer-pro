
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader, Save, CreditCard, Check, Key } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MercadoPagoFormValues, mercadoPagoSchema } from './types';

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

  // Save configurations
  const onSubmit = async (values: MercadoPagoFormValues) => {
    try {
      setIsLoading(true);
      
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
      
      toast.success('Configurações do Mercado Pago salvas com sucesso');
      
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
        <FormField
          control={form.control}
          name="isSandbox"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Modo de homologação (Sandbox)</FormLabel>
                <FormDescription>
                  Ative para usar em ambiente de testes. Desative apenas em produção.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="publicKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave Pública</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="TEST-abcd1234-5678-..." 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormDescription>
                A chave pública (public key) utilizada para inicializar o SDK do Mercado Pago.
                {field.value.startsWith('TEST-') && (
                  <span className="block mt-1 text-amber-600">
                    Esta é uma chave de teste (homologação).
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="accessToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token de Acesso</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="APP_USR-1234567890abcdef-..." 
                    type="password" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormDescription>
                O token de acesso (access token) para autenticar requisições à API do Mercado Pago.
                {field.value.startsWith('TEST-') && (
                  <span className="block mt-1 text-amber-600">
                    Este é um token de teste (homologação).
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : isSaved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Configurações Salvas
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
