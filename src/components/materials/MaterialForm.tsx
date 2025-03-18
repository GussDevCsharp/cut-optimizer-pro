
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { Material } from "@/types/material";
import { useAuth } from "@/context/AuthContext";
import { materialSchema, MaterialFormValues } from "./schema/materialSchema";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { PricingSection } from "./form-sections/PricingSection";
import { DimensionsSection } from "./form-sections/DimensionsSection";
import { AttributesSection } from "./form-sections/AttributesSection";

interface MaterialFormProps {
  initialData?: Partial<Material>;
  onSubmit: (data: MaterialFormValues) => Promise<void>;
  onCancel: () => void;
}

export function MaterialForm({ initialData, onSubmit, onCancel }: MaterialFormProps) {
  const { user } = useAuth();
  
  // Define the form with react-hook-form and zod validation
  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      type: initialData?.type || "",
      price: initialData?.price || undefined,
      unit: initialData?.unit || "m²",
      thickness: initialData?.thickness || undefined,
      width: initialData?.width || undefined,
      height: initialData?.height || undefined,
      color: initialData?.color || "",
      stock_quantity: initialData?.stock_quantity || undefined,
      supplier: initialData?.supplier || "",
      availability: initialData?.availability || "Disponível",
    },
  });

  // Handle form submission
  const handleSubmit = async (values: MaterialFormValues) => {
    try {
      // Remove the color and availability fields from the data sent to the server
      // since they don't exist in the database yet
      const { availability, color, ...dataToSubmit } = values;
      await onSubmit(dataToSubmit as MaterialFormValues);
    } catch (error) {
      toast.error("Erro ao salvar material", {
        description: "Tente novamente mais tarde",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BasicInfoSection form={form} />
        <PricingSection form={form} />
        <DimensionsSection form={form} />
        <AttributesSection form={form} />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Atualizar" : "Criar"} Material
          </Button>
        </div>
      </form>
    </Form>
  );
}
