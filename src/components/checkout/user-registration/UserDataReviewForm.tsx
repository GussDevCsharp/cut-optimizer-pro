
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserCredentials } from './types';

// Schema para validar os dados do usuário
const userSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type UserDataReviewFormProps = {
  initialData: UserCredentials;
  onSubmit: (data: UserCredentials) => void;
};

const UserDataReviewForm: React.FC<UserDataReviewFormProps> = ({ initialData, onSubmit }) => {
  // Inicializar o formulário com os dados do usuário
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData.name,
      email: initialData.email,
      password: initialData.password,
      confirmPassword: initialData.password,
    },
  });

  const handleSubmit = (data: z.infer<typeof userSchema>) => {
    onSubmit({
      name: data.name,
      email: data.email,
      password: data.password
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="border p-4 rounded-md space-y-3">
          <h3 className="text-lg font-medium">Seus dados</h3>
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu Nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="seu@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="******" 
                    type="password" 
                    showPasswordToggle
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirme a senha</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="******" 
                    type="password" 
                    showPasswordToggle
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit"
          className="w-full"
          size="lg"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Prosseguir para pagamento
        </Button>
      </form>
    </Form>
  );
};

export default UserDataReviewForm;
