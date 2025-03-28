
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EmailSettingsFormValues } from "./EmailSettingsSchema";

interface ServerConfigSectionProps {
  form: UseFormReturn<EmailSettingsFormValues>;
}

export function ServerConfigSection({ form }: ServerConfigSectionProps) {
  return (
    <>
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
    </>
  );
}
