
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RegisterSuccessProps {
  email: string;
}

export function RegisterSuccess({ email }: RegisterSuccessProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Alert className="bg-accent text-accent-foreground border-primary/20">
        <Mail className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-semibold">Verifique seu email</AlertTitle>
        <AlertDescription>
          Enviamos um link de confirmação para o seu email. Por favor, verifique sua caixa de entrada 
          (e também a pasta de spam) e clique no link para ativar sua conta.
        </AlertDescription>
      </Alert>
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => navigate("/login")}>
          Ir para o login
        </Button>
      </div>
    </div>
  );
}
