
import * as z from "zod";

// Schema for material form validation
export const materialSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  type: z.string().min(1, "Selecione um tipo de material"),
  price: z.coerce.number().min(0, "Preço não pode ser negativo").optional(),
  unit: z.string().min(1, "Unidade é obrigatória"),
  thickness: z.coerce.number().min(0).optional(),
  width: z.coerce.number().min(0).optional(),
  height: z.coerce.number().min(0).optional(),
  color: z.string().optional(),
  stock_quantity: z.coerce.number().min(0).optional(),
  supplier: z.string().optional(),
});

export type MaterialFormValues = z.infer<typeof materialSchema>;
