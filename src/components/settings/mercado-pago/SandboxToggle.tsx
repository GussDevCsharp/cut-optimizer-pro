
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { 
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { MercadoPagoFormValues } from "./types";

interface SandboxToggleProps {
  form: UseFormReturn<MercadoPagoFormValues>;
}

export function SandboxToggle({ form }: SandboxToggleProps) {
  return (
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
  );
}
