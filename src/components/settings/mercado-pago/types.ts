
import * as z from "zod";

// Validation schema for the form fields
export const mercadoPagoSchema = z.object({
  publicKey: z.string().min(1, "Chave pública é obrigatória"),
  accessToken: z.string().min(1, "Token de acesso é obrigatório"),
  isSandbox: z.boolean().default(true),
});

export type MercadoPagoFormValues = z.infer<typeof mercadoPagoSchema>;

export const DEFAULT_MP_CONFIG: MercadoPagoFormValues = {
  publicKey: 'TEST-743d3338-610c-4c0c-b612-8a9a5a9158ca',
  accessToken: 'TEST-4308462599599565-022917-9343d6c28269cc4a693dfb9f0a6c7db6-458831007',
  isSandbox: true,
};
