
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-primary/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Pronto para transformar seu negócio?
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Junte-se a centenas de profissionais que estão economizando tempo, 
            material e aumentando seus lucros com o Melhor Corte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link to="/cadastro">
              <Button size="lg" className="px-8">
                Começar Agora
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Agendar Demonstração
            </Button>
          </div>
          <div className="pt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>7 dias de teste grátis</span>
            <span className="mx-2">•</span>
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Sem cartão de crédito</span>
            <span className="mx-2">•</span>
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Cancele quando quiser</span>
          </div>
        </div>
      </div>
    </section>
  );
};
