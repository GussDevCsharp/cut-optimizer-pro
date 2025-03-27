
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Loader, Save, CreditCard, Check, Key, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Esquema de validação dos campos
const mercadoPagoSchema = z.object({
  publicKey: z.string().min(1, "Chave pública é obrigatória"),
  accessToken: z.string().min(1, "Token de acesso é obrigatório"),
  isSandbox: z.boolean().default(true),
});

type MercadoPagoFormValues = z.infer<typeof mercadoPagoSchema>;

export function MercadoPagoSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { isMasterAdmin } = useAuth();

  // Inicializar o formulário
  const form = useForm<MercadoPagoFormValues>({
    resolver: zodResolver(mercadoPagoSchema),
    defaultValues: {
      publicKey: 'TEST-743d3338-610c-4c0c-b612-8a9a5a9158ca',
      accessToken: 'TEST-4308462599599565-022917-9343d6c28269cc4a693dfb9f0a6c7db6-458831007',
      isSandbox: true,
    },
  });

  // Carregar configurações existentes
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
              
              // Configurações padrão já estão no formulário
            } catch (createError) {
              console.error('Erro ao criar tabela system_settings:', createError);
              setHasError(true);
            }
          } else if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Erro ao carregar configurações do Mercado Pago:', error);
            setHasError(true);
          }
        } else if (data?.settings) {
          form.reset({
            publicKey: data.settings.publicKey || 'TEST-743d3338-610c-4c0c-b612-8a9a5a9158ca',
            accessToken: data.settings.accessToken || 'TEST-4308462599599565-022917-9343d6c28269cc4a693dfb9f0a6c7db6-458831007',
            isSandbox: data.settings.isSandbox !== false, // default para true
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do Mercado Pago:', error);
        setHasError(true);
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
      
      if (checkError && checkError.code === '42P01') {
        // Tabela não existe, tentar criar
        await supabase.rpc('create_system_settings_table');
        
        // Inserir novo registro
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
      }
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      
      toast.success('Configurações do Mercado Pago salvas com sucesso');
      
      // Recarregar a página para reinicializar o SDK do Mercado Pago
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
      
      {hasError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar configurações</AlertTitle>
          <AlertDescription>
            Não foi possível carregar as configurações do Mercado Pago. Tente novamente ou entre em contato com o suporte.
          </AlertDescription>
        </Alert>
      )}
      
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
      
      <div className="mt-8 p-4 border rounded-lg bg-muted/50">
        <h4 className="font-medium mb-2">Informações para teste</h4>
        <p className="text-sm mb-2">
          Para testar o Mercado Pago em modo sandbox, use os seguintes dados:
        </p>
        <div className="text-sm space-y-1">
          <p><strong>Cartão de teste:</strong> 5031 4332 1540 6351</p>
          <p><strong>Data de validade:</strong> 11/25</p>
          <p><strong>Código de segurança:</strong> 123</p>
          <p><strong>Titular:</strong> APRO (para pagamentos aprovados) ou OTHE (para erros de processamento)</p>
        </div>
      </div>
    </div>
  );
}
