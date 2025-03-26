
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router-dom';
import UserRegistrationCheckout from '../checkout/UserRegistrationCheckout';

interface CTAButtonProps {
  productId: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showCheckout?: boolean;
}

// Schema for validating user registration data
const userSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type UserFormValues = z.infer<typeof userSchema>;

const CTAButton: React.FC<CTAButtonProps> = ({ 
  productId,
  productName,
  productDescription,
  productPrice,
  buttonText = "Comprar agora",
  buttonVariant = "default",
  buttonSize = "lg",
  className,
  showCheckout = true
}) => {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [userCredentials, setUserCredentials] = useState<UserFormValues | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: UserFormValues) => {
    setUserCredentials(data);
    setUserDialogOpen(false);
    setCheckoutOpen(true);
  };

  const handleButtonClick = () => {
    if (!showCheckout) {
      navigate('/cadastro');
    } else {
      setUserDialogOpen(true);
    }
  };

  const handlePaymentComplete = (status: string, paymentId?: string) => {
    console.log('Payment completed with status:', status, 'and ID:', paymentId);
    
    if (status === 'approved') {
      // Redirect to dashboard after successful payment and registration
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    }
  };
  
  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        className={className}
        onClick={handleButtonClick}
      >
        {buttonText}
      </Button>
      
      {/* User data collection dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crie sua conta</DialogTitle>
            <DialogDescription>
              Registre-se para completar sua compra e acessar a plataforma.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        showPasswordToggle={true}
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
                        showPasswordToggle={true}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Continuar para pagamento</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Checkout dialog */}
      {userCredentials && (
        <UserRegistrationCheckout 
          isOpen={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          product={{
            id: productId,
            name: productName,
            description: productDescription,
            price: productPrice
          }}
          userCredentials={userCredentials}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </>
  );
};

export default CTAButton;
