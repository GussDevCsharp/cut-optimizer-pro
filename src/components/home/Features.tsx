
import React from "react";
import { LayoutDashboard, Target, Zap, Clock } from "lucide-react";

export const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Recursos Poderosos para seu Negócio
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Transforme a maneira como você planeja seus cortes e maximize o aproveitamento de material.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Target className="h-6 w-6 text-primary" />}
            title="Otimização Inteligente"
            description="Algoritmo avançado que encontra a melhor distribuição de peças para minimizar desperdício."
          />
          <FeatureCard 
            icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
            title="Visualização em Tempo Real"
            description="Veja instantaneamente como suas peças serão dispostas na chapa, facilitando o planejamento."
          />
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="Cálculos Automáticos"
            description="Esqueça planilhas complexas. Nosso sistema calcula tudo para você, incluindo custos e economia."
          />
          <FeatureCard 
            icon={<Clock className="h-6 w-6 text-primary" />}
            title="Economize Tempo"
            description="Reduza drasticamente o tempo gasto planejando cortes manualmente e foque no que importa."
          />
          <FeatureCard 
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
              </svg>
            }
            title="Exportação Profissional"
            description="Gere relatórios detalhados e envie diretamente para sua equipe ou clientes."
          />
          <FeatureCard 
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            title="Colaboração em Equipe"
            description="Compartilhe projetos facilmente entre sua equipe e mantenha todos alinhados."
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="flex flex-col p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground flex-1">{description}</p>
    </div>
  );
};
