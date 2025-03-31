
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PricingPlans from "@/components/home/PricingPlans";

export default function Register() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  // Show loading state
  if (isLoading) {
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
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-lg">CutOptimizer</span>
            </Link>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center">
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground mr-4"
            >
              Já tenho uma conta
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Escolha seu plano</h1>
            <p className="text-muted-foreground mt-2">
              Selecione o plano ideal para o seu negócio e comece a otimizar seus projetos hoje mesmo.
            </p>
          </div>

          <PricingPlans />
        </div>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:h-16 items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} CutOptimizer. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
