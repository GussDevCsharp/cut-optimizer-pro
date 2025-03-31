
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserFormValues } from './CTAButtonLogic';
import AddressInput from './AddressInput';

interface UserRegistrationDialogProps {
  userDialogOpen: boolean;
  setUserDialogOpen: (open: boolean) => void;
  form: UseFormReturn<UserFormValues>;
  onSubmit: (data: UserFormValues) => void;
  isSubmitting?: boolean;
}

const UserRegistrationDialog: React.FC<UserRegistrationDialogProps> = ({
  userDialogOpen,
  setUserDialogOpen,
  form,
  onSubmit,
  isSubmitting = false
}) => {
  return (
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
            
            <AddressInput control={form.control} />
            
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Continuar para pagamento'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserRegistrationDialog;
