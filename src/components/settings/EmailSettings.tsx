import React, { useState, useEffect } from 'react';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Save } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const emailSettingsSchema = z.object({
  emailService: z.string().min(1, { message: "Serviço de email é obrigatório" }),
  smtpServer: z.string().min(1, { message: "Servidor SMTP é obrigatório" }),
  smtpPort: z.string().min(1, { message: "Porta SMTP é obrigatória" }),
  username: z.string().min(1, { message: "Nome de usuário é obrigatório" }),
  password: z.string().min(1, { message: "Senha é obrigatória" }),
  fromEmail: z.string().email({ message: "Email inválido" }),
  fromName: z.string().min(1, { message: "Nome do remetente é obrigatório" }),
  useSSL: z.boolean().default(true),
});

type EmailSettingsFormValues = z.infer<typeof emailSettingsSchema>;

export function EmailSettings() {
  const [isTesting, setIsTesting] = useState(false);
  
  // Initialize form with default values or values from localStorage
  const form = useForm<EmailSettingsFormValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      emailService: "",
      smtpServer: "",
      smtpPort: "",
      username: "",
      password: "",
      fromEmail: "",
      fromName: "",
      useSSL: true,
    }
  });

  useEffect(() => {
    // Load saved settings from localStorage if available
    const savedSettings = localStorage.getItem('emailSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        form.reset(parsedSettings);
      } catch (error) {
        console.error('Error parsing saved email settings:', error);
      }
    }
  }, [form]);

  const onSubmit = (data: EmailSettingsFormValues) => {
    // Save settings to localStorage
    localStorage.setItem('emailSettings', JSON.stringify(data));
    
    toast.success("Configurações salvas", {
      description: "As configurações de email foram salvas com sucesso."
    });
  };

  const handleTestEmail = async () => {
    const values = form.getValues();
    setIsTesting(true);
    
    try {
      // In a real app, this would send a test email using the configured settings
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      toast.success("Email de teste enviado", {
        description: "O email de teste foi enviado com sucesso para " + values.fromEmail
      });
    } catch (error) {
      toast.error("Erro ao enviar email de teste", {
        description: "Verifique suas configurações e tente novamente."
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações de Email</h3>
        <p className="text-sm text-muted-foreground">
          Configure as credenciais SMTP para envio de emails com os planos de corte.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="emailService"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviço de Email</FormLabel>
                <FormControl>
                  <Input placeholder="Gmail, Outlook, etc." {...field} />
                </FormControl>
                <FormDescription>
                  Nome do provedor de email que você está utilizando.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="smtpServer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servidor SMTP</FormLabel>
                  <FormControl>
                    <Input placeholder="smtp.gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="smtpPort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Porta SMTP</FormLabel>
                  <FormControl>
                    <Input placeholder="587" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome de Usuário</FormLabel>
                  <FormControl>
                    <Input placeholder="seu.email@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="fromEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email do Remetente</FormLabel>
                  <FormControl>
                    <Input placeholder="seu.email@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="fromName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Remetente</FormLabel>
                  <FormControl>
                    <Input placeholder="Melhor Corte" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="useSSL"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Usar SSL/TLS</FormLabel>
                  <FormDescription>
                    Habilitar conexão segura para o servidor SMTP.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <div className="flex flex-col gap-2 sm:flex-row pt-2">
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Salvar Configurações
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTestEmail}
              disabled={isTesting}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              {isTesting ? "Enviando..." : "Enviar Email de Teste"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
