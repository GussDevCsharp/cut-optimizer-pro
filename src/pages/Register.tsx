
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { RegisterForm, RegisterFormValues } from "@/components/auth/RegisterForm";
import { RegisterSuccess } from "@/components/auth/RegisterSuccess";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    try {
      await register(data.name, data.email, data.password);
      setUserEmail(data.email);
      setRegistrationSuccess(true);
      toast({
        title: "Link de confirmação enviado!",
        description: `Enviamos um email para ${data.email} com link de confirmação.`,
      });
      // Don't navigate automatically - wait for confirmation
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer cadastro",
        description: error.message || "Houve um problema ao criar sua conta. Tente novamente.",
      });
      console.error("Erro durante o registro:", error);
    } finally {
      setIsLoading(false);
    }
  }
  
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
  
  // If already authenticated, don't render the register form
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Criar uma conta</CardTitle>
          <CardDescription className="text-center">
            Preencha os campos abaixo para se cadastrar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registrationSuccess ? (
            <RegisterSuccess email={userEmail} />
          ) : (
            <RegisterForm onSubmit={onSubmit} isLoading={isLoading} />
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Entre aqui
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
