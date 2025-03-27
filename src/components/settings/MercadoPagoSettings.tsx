
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useAuth } from '@/context/AuthContext';

// Esquema de validação dos campos
const mercadoPagoSchema = z.object({
  publicKey: z.string().min(1, "Chave pública é obrigatória"),
  accessToken: z.string().min(1, "Token de acesso é obrigatório"),
  isSandbox: z.boolean().optional(),
});

type MercadoPagoFormValues = z.infer<typeof mercadoPagoSchema>;

export function MercadoPagoSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { isMasterAdmin } = useAuth();

  // Inicializar o formulário
  const form = useForm<MercadoPagoFormValues>({
    resolver: zodResolver(mercadoPagoSchema),
    defaultValues: {
      publicKey: '',
      accessToken: '',
      isSandbox: true,
    },
  });

  // Carregar configurações existentes
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('system_settings')
          .select('settings')
          .eq('key', 'mercado_pago_config')
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data?.settings) {
          form.reset({
            publicKey: data.settings.publicKey || '',
            accessToken: data.settings.accessToken || '',
            isSandbox: data.settings.isSandbox !== false, // default para true
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do Mercado Pago:', error);
        toast.error('Não foi possível carregar as configurações');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isMasterAdmin) {
      loadConfig();
    }
  }, [form, isMasterAdmin]);

  // Salvar configurações
  const onSubmit = async (values: MercadoPagoFormValues) => {
    if (!isMasterAdmin) {
      toast.error('Apenas administradores principais podem salvar estas configurações');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Verificar se já existe um registro
      const { data: existingConfig, error: checkError } = await supabase
        .from('system_settings')
        .select('id')
        .eq('key', 'mercado_pago_config')
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      let saveError;
      
      // Atualizar ou inserir
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
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      
      toast.success('Configurações do Mercado Pago salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar configurações do Mercado Pago:', error);
      toast.error('Não foi possível salvar as configurações');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMasterAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Configuração do Mercado Pago</h3>
          <p className="text-sm text-muted-foreground">
            Você não tem permissão para acessar estas configurações.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configuração do Mercado Pago</h3>
        <p className="text-sm text-muted-foreground">
          Configure as chaves de API do Mercado Pago para processar pagamentos.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
    </div>
  );
}
