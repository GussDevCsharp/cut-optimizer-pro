
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EmailSettingsFormValues } from './emailSettingsSchema';

interface ServerSettingsProps {
  form: UseFormReturn<EmailSettingsFormValues>;
}

export const ServerSettings: React.FC<ServerSettingsProps> = ({ form }) => {
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
};
