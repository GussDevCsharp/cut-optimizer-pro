
import { Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EmailVerificationAlertProps {
  verified: boolean;
}

export function EmailVerificationAlert({ verified }: EmailVerificationAlertProps) {
  if (!verified) {
    return null;
  }

  return (
    <Alert className="mb-4 bg-accent text-accent-foreground border-primary/20">
      <Check className="h-5 w-5 text-green-500" />
      <AlertTitle className="text-green-600 font-semibold">Email confirmado!</AlertTitle>
      <AlertDescription>
        Sua conta foi ativada com sucesso. Agora você pode fazer login.
      </AlertDescription>
    </Alert>
  );
}
