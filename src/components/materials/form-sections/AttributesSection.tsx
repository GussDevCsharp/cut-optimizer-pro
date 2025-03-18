
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MaterialFormValues } from "../schema/materialSchema";

interface AttributesSectionProps {
  form: UseFormReturn<MaterialFormValues>;
}

export function AttributesSection({ form }: AttributesSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Color */}
      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cor</FormLabel>
            <FormControl>
              <Input placeholder="Branco, Preto, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Supplier */}
      <FormField
        control={form.control}
        name="supplier"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fornecedor</FormLabel>
            <FormControl>
              <Input placeholder="Nome do fornecedor" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
