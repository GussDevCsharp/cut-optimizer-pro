
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Ruler } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-charcoal-dark to-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 grid-pattern bg-size-[30px_30px]"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-8">
          <Ruler className="h-12 w-12 text-lilac mb-2" strokeWidth={1.5} />
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-playfair text-white">
            Eleve seu Projeto Arquitetônico
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-light md:text-xl font-work-sans">
            Junte-se a centenas de arquitetos e profissionais que já transformaram 
            seu fluxo de trabalho com nossas soluções de precisão.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link to="/cadastro">
              <Button size="lg" className="px-8 bg-lilac hover:bg-lilac-dark text-white">
                Iniciar Meu Projeto
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-gray-light text-gray-light hover:bg-white/10">
              Agendar Demonstração
            </Button>
          </div>
          <div className="pt-4 flex flex-wrap justify-center items-center gap-2 text-sm text-gray-light">
            <CheckCircle2 className="h-4 w-4 text-lilac" />
            <span>7 dias de teste grátis</span>
            <span className="mx-2 hidden sm:inline">•</span>
            <CheckCircle2 className="h-4 w-4 text-lilac" />
            <span>Sem cartão de crédito</span>
            <span className="mx-2 hidden sm:inline">•</span>
            <CheckCircle2 className="h-4 w-4 text-lilac" />
            <span>Cancele quando quiser</span>
          </div>
        </div>
      </div>
    </section>
  );
};
