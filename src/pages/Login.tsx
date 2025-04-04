
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoginForm } from "@/components/auth/LoginForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { LoginDecoration } from "@/components/auth/LoginDecoration";
import { EmailVerificationAlert } from "@/components/auth/EmailVerificationAlert";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [redirectDialogOpen, setRedirectDialogOpen] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const verifiedParam = searchParams.get('verified');
  const emailParam = searchParams.get('email');
  const resetParam = searchParams.get('reset');
  const fromFailedLoginParam = searchParams.get('fromFailedLogin');
  
  // Check for verification parameter
  useEffect(() => {
    if (verifiedParam === 'true' && emailParam) {
      toast({
        title: "Email confirmado com sucesso!",
        description: "Sua conta foi ativada. Agora você pode fazer login.",
        variant: "default",
      });
    }
    
    if (resetParam === 'true') {
      toast({
        title: "Redefinição de senha",
        description: "Você pode agora definir uma nova senha. Verifique seu email.",
        variant: "default",
      });
    }
    
    if (fromFailedLoginParam === 'true') {
      setRedirectDialogOpen(true);
    }
  }, [verifiedParam, emailParam, resetParam, fromFailedLoginParam, toast]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleRedirectToPurchase = () => {
    navigate("/home");
    setRedirectDialogOpen(false);
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
          <div className="h-4 w-32 bg-primary/20 rounded"></div>
        </div>
      </div>
    );
  }

  // If already authenticated, don't render the login form
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Left column with thematic image - hide on mobile */}
      {!isMobile && <LoginDecoration />}
      
      {/* Right column with login form */}
      <div className={`flex items-center justify-center ${isMobile ? 'w-full' : 'w-1/2'} p-4`}>
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar seu painel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmailVerificationAlert verified={verifiedParam === 'true'} />
            <LoginForm 
              defaultEmail={emailParam || ""} 
              onResetPasswordClick={() => setResetPasswordOpen(true)} 
              onLoginFailure={() => setRedirectDialogOpen(true)}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link to="/cadastro" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Esqueceu a senha?</DialogTitle>
            <DialogDescription>
              Digite seu email abaixo para receber um link de redefinição de senha.
            </DialogDescription>
          </DialogHeader>
          <ResetPasswordForm onCancel={() => setResetPasswordOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Redirect to Purchase Dialog */}
      <Dialog open={redirectDialogOpen} onOpenChange={setRedirectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Acesso não encontrado</DialogTitle>
            <DialogDescription>
              Você ainda não possui acesso à plataforma. Para começar a usar nossos serviços, é necessário adquirir uma assinatura.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 mt-4">
            <Alert>
              <AlertDescription>
                Ao fazer a compra, você criará automaticamente seu acesso à plataforma com o email e senha informados.
              </AlertDescription>
            </Alert>
            <div className="flex justify-between mt-2">
              <Button variant="outline" onClick={() => setRedirectDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleRedirectToPurchase}>
                Ver planos e preços
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
