
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
          <PricingCard
            title="Iniciante"
            price="59"
            description="Perfeito para pequenas marcenarias"
            features={[
              "Até 10 projetos por mês",
              "Otimização básica",
              "Exportação em PDF",
              "1 usuário"
            ]}
            isPrimary={false}
            popularBadge={false}
          />
          
          <PricingCard
            title="Profissional"
            price="99"
            description="Ideal para marcenarias em crescimento"
            features={[
              "Projetos ilimitados",
              "Otimização avançada",
              "Exportação em PDF e Excel",
              "3 usuários",
              "Compartilhamento por email",
              "Suporte prioritário"
            ]}
            isPrimary={true}
            popularBadge={true}
          />
          
          <PricingCard
            title="Empresarial"
            price="199"
            description="Para empresas e indústrias"
            features={[
              "Tudo do plano Profissional",
              "10 usuários",
              "Suporte dedicado",
              "Treinamento personalizado"
            ]}
            isPrimary={false}
            popularBadge={false}
            buttonText="Falar com Consultor"
            footerText="Demonstração personalizada"
          />
        </div>
      </div>
    </section>
  );
};

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPrimary: boolean;
  popularBadge: boolean;
  buttonText?: string;
  footerText?: string;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  isPrimary,
  popularBadge,
  buttonText = "Começar Teste Grátis",
  footerText = "7 dias grátis, sem compromisso"
}: PricingCardProps) => {
  return (
    <div className={`flex flex-col p-6 bg-card rounded-lg shadow-sm ${isPrimary ? 'border-2 border-primary' : 'border border-border'} relative overflow-hidden`}>
      {popularBadge && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
            Mais Popular
          </div>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="mt-3">
          <span className="text-3xl font-bold">R${price}</span>
          <span className="text-muted-foreground">/mês</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {description}
        </p>
      </div>
      <ul className="space-y-3 mb-6 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Link to="/cadastro" className="w-full">
        <Button className="w-full" variant={isPrimary ? "default" : "outline"}>
          {buttonText}
        </Button>
      </Link>
      <p className="text-xs text-center text-muted-foreground mt-3">
        {footerText}
      </p>
    </div>
  );
};
