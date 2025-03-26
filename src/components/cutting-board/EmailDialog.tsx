
import React, { useState } from 'react';
import { 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { MailWarning } from 'lucide-react';

interface EmailDialogProps {
  onSendEmail: (email: string) => Promise<boolean>;
}

export const EmailDialog = ({ onSendEmail }: EmailDialogProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if email settings are configured
  const emailSettings = localStorage.getItem('emailSettings');
  const isEmailConfigured = emailSettings !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um endereço de email válido.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await onSendEmail(email);
      
      if (success) {
        toast({
          title: "Email enviado",
          description: "O plano de corte foi enviado para o seu email.",
        });
      } else {
        toast({
          title: "Erro ao enviar",
          description: "Não foi possível enviar o email. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um problema ao enviar o email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEmailConfigured) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurações de Email</DialogTitle>
          <DialogDescription>
            É necessário configurar as credenciais de email antes de enviar planos de corte.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
          <div className="bg-muted p-3 rounded-full">
            <MailWarning className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium">Email não configurado</p>
          <p className="text-sm text-muted-foreground">
            Configure suas credenciais de email nas configurações da conta para utilizar essa funcionalidade.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
            Ir para configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Enviar por Email</DialogTitle>
        <DialogDescription>
          Insira o endereço de email para receber o plano de corte em PDF.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              placeholder="seu@email.com"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
