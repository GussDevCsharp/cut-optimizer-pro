
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Scissors } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Otimizador de Corte Profissional
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Economize Material e{" "}
              <span className="text-primary">Aumente seus Lucros</span>
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A ferramenta definitiva para profissionais de marcenaria e indústria que desejam 
              otimizar seus projetos de corte, reduzir desperdicios e aumentar a produtividade.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/cadastro">
                <Button size="lg" className="px-8">
                  Experimente Grátis por 7 Dias
                </Button>
              </Link>
              <a href="#demo">
                <Button variant="outline" size="lg">
                  Ver Demonstração
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-md overflow-hidden rounded-lg bg-white/80 backdrop-blur p-6 shadow-lg relative">
            <div className="absolute w-full h-full opacity-10 grid-pattern bg-size-[20px_20px]"></div>
            <div className="relative z-10 flex flex-col items-center">
              <Scissors className="h-16 w-16 text-primary mb-4" strokeWidth={1.5} />
              <div className="bg-white p-4 rounded-lg shadow-subtle mb-4 w-full">
                <div className="flex items-center justify-between">
                  <div className="bg-primary/20 h-8 w-24 rounded"></div>
                  <Scissors className="h-5 w-5 text-primary/60" />
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mb-4 justify-center">
                <div className="bg-accent h-14 w-14 rounded flex items-center justify-center border border-primary/20">
                  <span className="text-sm font-medium">20×30</span>
                </div>
                <div className="bg-accent h-10 w-16 rounded flex items-center justify-center border border-primary/20">
                  <span className="text-sm font-medium">15×45</span>
                </div>
                <div className="bg-accent h-12 w-12 rounded flex items-center justify-center border border-primary/20">
                  <span className="text-sm font-medium">25×25</span>
                </div>
                <div className="bg-accent h-16 w-10 rounded flex items-center justify-center border border-primary/20">
                  <span className="text-sm font-medium">40×10</span>
                </div>
              </div>
              <div className="flex w-full justify-between items-center mt-2">
                <div className="h-2 w-full bg-primary/30 rounded-full overflow-hidden">
                  <div className="h-full w-[89%] bg-primary rounded-full"></div>
                </div>
                <div className="ml-2 text-xs font-medium text-primary">89%</div>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Aproveitamento de material
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
