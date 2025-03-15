
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Ruler, Scissors } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { authService } from "@/services/auth-service";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailConfirmationNeeded, setEmailConfirmationNeeded] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setEmailConfirmationNeeded(false);
    
    try {
      await login(data.email, data.password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para o seu painel.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (authService.isEmailNotConfirmedError(error)) {
        setEmailConfirmationNeeded(true);
        toast({
          variant: "destructive",
          title: "Email não confirmado",
          description: "Por favor, verifique seu email e clique no link de confirmação antes de fazer login.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: error.message || "Email ou senha incorretos. Tente novamente.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  // If already authenticated, don't render the login form
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Left column with thematic image - hide on mobile */}
      {!isMobile && (
        <div className="hidden md:flex w-1/2 bg-primary/10 flex-col justify-center items-center p-8">
          <div className="max-w-md text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-4">Melhor Corte</h1>
            <p className="text-lg text-gray-700">Otimize seus cortes, economize material e aumente sua produtividade</p>
          </div>
          
          {/* Decorative elements for cutting plans */}
          <div className="relative w-full max-w-md aspect-square bg-white/80 rounded-lg shadow-lg p-6 flex items-center justify-center">
            <div className="absolute w-full h-full opacity-10 grid-pattern bg-size-[20px_20px]"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <Ruler className="h-20 w-20 text-primary mb-4" strokeWidth={1.5} />
              <div className="bg-white p-4 rounded-lg shadow-subtle mb-4 flex items-center gap-2">
                <div className="bg-primary/20 h-10 w-32 rounded"></div>
                <Scissors className="h-6 w-6 text-primary/60" />
              </div>
              
              <div className="flex gap-4 mb-4">
                <div className="bg-accent h-16 w-16 rounded flex items-center justify-center border border-primary/20">
                  <span className="text-sm font-medium">20×30</span>
                </div>
                <div className="bg-accent h-12 w-20 rounded flex items-center justify-center border border-primary/20">
                  <span className="text-sm font-medium">15×45</span>
                </div>
                <div className="bg-accent h-14 w-14 rounded flex items-center justify-center border border-primary/20">
                  <span className="text-sm font-medium">25×25</span>
                </div>
              </div>
              
              <div className="flex w-full justify-between items-center mt-2">
                <div className="h-2 w-full bg-primary/30 rounded-full"></div>
                <div className="mx-2 text-xs font-medium text-primary">89%</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Right column with login form */}
      <div className={`flex items-center justify-center ${isMobile ? 'w-full' : 'w-1/2'} p-4`}>
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar seu painel
            </CardDescription>
            
            {emailConfirmationNeeded && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                <p className="font-medium">Verificação de email necessária</p>
                <p>Você precisa confirmar seu email antes de fazer login. Por favor, verifique sua caixa de entrada.</p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <Input placeholder="******" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">Carregando...</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" /> Entrar
                    </span>
                  )}
                </Button>
              </form>
            </Form>
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
    </div>
  );
}
