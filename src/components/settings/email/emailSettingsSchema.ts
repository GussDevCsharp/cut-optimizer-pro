
import * as z from "zod";

export const emailSettingsSchema = z.object({
  emailService: z.string().min(1, { message: "Serviço de email é obrigatório" }),
  smtpServer: z.string().min(1, { message: "Servidor SMTP é obrigatório" }),
  smtpPort: z.string().min(1, { message: "Porta SMTP é obrigatória" }),
  username: z.string().min(1, { message: "Nome de usuário é obrigatório" }),
  password: z.string().min(1, { message: "Senha é obrigatória" }),
  fromEmail: z.string().email({ message: "Email inválido" }),
  fromName: z.string().min(1, { message: "Nome do remetente é obrigatório" }),
  useSSL: z.boolean().default(true),
});

export type EmailSettingsFormValues = z.infer<typeof emailSettingsSchema>;

export const defaultEmailSettings: EmailSettingsFormValues = {
  emailService: "",
  smtpServer: "",
  smtpPort: "",
  username: "",
  password: "",
  fromEmail: "",
  fromName: "",
  useSSL: true,
};
