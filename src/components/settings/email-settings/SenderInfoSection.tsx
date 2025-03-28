
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
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { EmailSettingsFormValues } from "./EmailSettingsSchema";

interface SenderInfoSectionProps {
  form: UseFormReturn<EmailSettingsFormValues>;
}

export function SenderInfoSection({ form }: SenderInfoSectionProps) {
  return (
    <>
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
    </>
  );
}
