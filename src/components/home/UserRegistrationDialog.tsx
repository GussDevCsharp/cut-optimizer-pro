
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UserFormValues } from "@/hooks/useLeadManagement";
import UserRegistrationFormFields from './UserRegistrationFormFields';

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
            <UserRegistrationFormFields control={form.control} />
            
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
