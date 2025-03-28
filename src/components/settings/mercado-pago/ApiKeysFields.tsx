
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Key, CreditCard } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";
import { MercadoPagoFormValues } from "./types";

interface ApiKeysFieldsProps {
  form: UseFormReturn<MercadoPagoFormValues>;
}

export function ApiKeysFields({ form }: ApiKeysFieldsProps) {
  return (
    <>
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
                  placeholder="TEST-abcd1234-5678-... ou APP_USR-abcd1234-5678-..." 
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
              {!field.value.startsWith('TEST-') && field.value && (
                <span className="block mt-1 text-green-600">
                  Esta parece ser uma chave de produção.
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
                  placeholder="APP_USR-1234567890abcdef-... ou TEST-1234567890abcdef-..." 
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
              {!field.value.startsWith('TEST-') && field.value && (
                <span className="block mt-1 text-green-600">
                  Este parece ser um token de produção.
                </span>
              )}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
