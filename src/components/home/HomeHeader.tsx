
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Scissors } from "lucide-react";

export const HomeHeader = () => {
  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">
            Melhor Corte
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Recursos
          </a>
          <a href="#benefits" className="text-sm font-medium hover:text-primary transition-colors">
            Benefícios
          </a>
          <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Preços
          </a>
          <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
            Depoimentos
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/cadastro">
            <Button>
              Começar Agora
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
