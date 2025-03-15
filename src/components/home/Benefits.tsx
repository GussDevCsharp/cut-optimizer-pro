
import React from "react";
import { CheckCircle2 } from "lucide-react";

export const Benefits = () => {
  return (
    <section id="benefits" className="py-16 md:py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Por que profissionais escolhem Melhor Corte?
            </h2>
            <p className="text-muted-foreground md:text-xl">
              Junte-se a centenas de profissionais que já transformaram seus negócios.
            </p>
            <ul className="space-y-4">
              <BenefitItem 
                title="Redução de até 30% no desperdício"
                description="Nossos clientes relatam economia significativa de material desde o primeiro projeto."
              />
              <BenefitItem 
                title="Aumento de produtividade em 45%"
                description="Menos tempo planejando, mais tempo produzindo. Automatize o processo tedioso de planejar cortes."
              />
              <BenefitItem 
                title="Maior satisfação do cliente"
                description="Apresente orçamentos mais precisos e prazos mais confiáveis para seus clientes."
              />
              <BenefitItem 
                title="Retorno sobre investimento rápido"
                description="O valor economizado em material nos primeiros projetos já cobre o investimento na ferramenta."
              />
            </ul>
          </div>
          <div className="space-y-6">
            <TestimonialCard 
              text="Desde que começamos a usar o Melhor Corte, conseguimos reduzir o desperdício de MDF em quase 25%. A economia financeira é real e significativa para nossa marcenaria."
              author="Roberto Silva"
              company="Proprietário, Silva Marcenaria"
            />
            <TestimonialCard 
              text="A visualização em tempo real mudou completamente nossa forma de trabalhar. Conseguimos mostrar aos clientes exatamente como será o aproveitamento do material antes mesmo de iniciar a produção."
              author="Ana Oliveira"
              company="Gerente de Produção, Móveis Personalizados"
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                  JS
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                  TM
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                  RB
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                  +
                </div>
              </div>
              <div className="text-sm text-muted-foreground text-center sm:text-left">
                Junte-se a mais de <span className="font-bold text-primary">500+ profissionais</span> que confiam no Melhor Corte diariamente
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface BenefitItemProps {
  title: string;
  description: string;
}

const BenefitItem = ({ title, description }: BenefitItemProps) => {
  return (
    <li className="flex items-start gap-4">
      <div className="rounded-full w-8 h-8 flex items-center justify-center bg-primary/10 mt-0.5">
        <CheckCircle2 className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </li>
  );
};

interface TestimonialCardProps {
  text: string;
  author: string;
  company: string;
}

const TestimonialCard = ({ text, author, company }: TestimonialCardProps) => {
  return (
    <div className="rounded-lg bg-card p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-primary/10 p-2">
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
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-sm/relaxed text-muted-foreground">{text}</p>
          <div>
            <p className="font-semibold text-sm">{author}</p>
            <p className="text-xs text-muted-foreground">{company}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
