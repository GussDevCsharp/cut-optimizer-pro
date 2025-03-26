
import React from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSettingsSchema, EmailSettingsFormValues } from './emailSettingsSchema';

interface EmailSettingsFormProps {
  initialValues: EmailSettingsFormValues;
  onSubmit: (data: EmailSettingsFormValues) => void;
  onTestEmail: () => void;
  isTesting: boolean;
}

export function EmailSettingsForm({ initialValues, onSubmit, onTestEmail, isTesting }: EmailSettingsFormProps) {
  const form = useForm<EmailSettingsFormValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: initialValues
  });

  return (
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
            onClick={onTestEmail}
            disabled={isTesting}
            className="gap-2"
          >
            <Mail className="h-4 w-4" />
            {isTesting ? "Enviando..." : "Enviar Email de Teste"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
