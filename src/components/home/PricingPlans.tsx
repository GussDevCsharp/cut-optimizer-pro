
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const PricingPlans = () => {
  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Planos que cabem no seu bolso
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Escolha o plano ideal para o seu negócio e comece a economizar hoje mesmo
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <div className="flex flex-col p-6 bg-card rounded-lg shadow-sm border border-border relative overflow-hidden">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold">Iniciante</h3>
              <div className="mt-3">
                <span className="text-3xl font-bold">R$59</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Perfeito para pequenas marcenarias
              </p>
            </div>
            <ul className="space-y-3 mb-6 flex-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Até 10 projetos por mês</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Otimização básica</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Exportação em PDF</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">1 usuário</span>
              </li>
            </ul>
            <Link to="/cadastro" className="w-full">
              <Button className="w-full" variant="outline">
                Começar Teste Grátis
              </Button>
            </Link>
            <p className="text-xs text-center text-muted-foreground mt-3">
              7 dias grátis, sem compromisso
            </p>
          </div>
          
          {/* Pro Plan */}
          <div className="flex flex-col p-6 bg-card rounded-lg shadow-md border-2 border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0">
              <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                Mais Popular
              </div>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold">Profissional</h3>
              <div className="mt-3">
                <span className="text-3xl font-bold">R$99</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Ideal para marcenarias em crescimento
              </p>
            </div>
            <ul className="space-y-3 mb-6 flex-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Projetos ilimitados</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Otimização avançada</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Exportação em PDF e Excel</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">3 usuários</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Compartilhamento por email</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Suporte prioritário</span>
              </li>
            </ul>
            <Link to="/cadastro" className="w-full">
              <Button className="w-full">
                Começar Teste Grátis
              </Button>
            </Link>
            <p className="text-xs text-center text-muted-foreground mt-3">
              7 dias grátis, sem compromisso
            </p>
          </div>
          
          {/* Enterprise Plan */}
          <div className="flex flex-col p-6 bg-card rounded-lg shadow-sm border border-border relative overflow-hidden">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold">Empresarial</h3>
              <div className="mt-3">
                <span className="text-3xl font-bold">R$199</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Para empresas e indústrias
              </p>
            </div>
            <ul className="space-y-3 mb-6 flex-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Tudo do plano Profissional</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">10 usuários</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Suporte dedicado</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Treinamento personalizado</span>
              </li>
            </ul>
            <Link to="/cadastro" className="w-full">
              <Button className="w-full" variant="outline">
                Falar com Consultor
              </Button>
            </Link>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Demonstração personalizada
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
