
import React from "react";
import { CheckCircle2 } from "lucide-react";
import CheckoutButton from "../checkout/CheckoutButton";

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
          {/* Basic Plan */}
          <div className="flex flex-col p-6 bg-card rounded-lg shadow-sm border border-border relative overflow-hidden">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold">Básico</h3>
              <div className="mt-3">
                <span className="text-3xl font-bold">R$29,90</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Para profissionais individuais
              </p>
            </div>
            <ul className="space-y-3 mb-6 flex-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">1 projeto simultâneo</span>
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
            <CheckoutButton 
              productId="basic-monthly"
              productName="Plano Básico Mensal"
              productDescription="Acesso a 1 projeto simultâneo"
              productPrice={29.90}
              buttonText="Assinar agora"
              buttonVariant="outline"
              className="w-full"
            />
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
                <span className="text-3xl font-bold">R$49,90</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Ideal para pequenas marcenarias
              </p>
            </div>
            <ul className="space-y-3 mb-6 flex-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Até 3 projetos simultâneos</span>
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
            <CheckoutButton 
              productId="pro-monthly"
              productName="Plano Profissional Mensal"
              productDescription="Acesso a até 3 projetos simultâneos"
              productPrice={49.90}
              buttonText="Assinar agora"
              buttonVariant="default"
              className="w-full"
            />
            <p className="text-xs text-center text-muted-foreground mt-3">
              7 dias grátis, sem compromisso
            </p>
          </div>
          
          {/* Business Plan */}
          <div className="flex flex-col p-6 bg-card rounded-lg shadow-sm border border-border relative overflow-hidden">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold">Empresarial</h3>
              <div className="mt-3">
                <span className="text-3xl font-bold">R$129,00</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Para empresas e indústrias
              </p>
            </div>
            <ul className="space-y-3 mb-6 flex-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Até 6 projetos simultâneos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Tudo do plano Profissional</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">6 usuários</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Suporte dedicado</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Treinamento personalizado</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">API para integração</span>
              </li>
            </ul>
            <CheckoutButton 
              productId="business-monthly"
              productName="Plano Empresarial Mensal"
              productDescription="Acesso a até 6 projetos simultâneos"
              productPrice={129.00}
              buttonText="Assinar agora"
              buttonVariant="outline"
              className="w-full"
            />
            <p className="text-xs text-center text-muted-foreground mt-3">
              7 dias grátis, sem compromisso
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
