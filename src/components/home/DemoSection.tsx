
import React from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export const DemoSection = () => {
  return (
    <section id="demo" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute left-0 top-0 w-full h-32 bg-gradient-to-b from-gray-100/50 to-transparent"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-playfair text-charcoal-dark">
            Precisão em Ação
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-work-sans">
            Observe como nossa solução transforma complexos projetos arquitetônicos em planos de corte precisos
          </p>
        </div>
        
        <div className="mx-auto max-w-4xl border border-gray-light/30 rounded-lg shadow-lg bg-white p-2 relative aspect-video overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal-dark/40 backdrop-blur-sm z-10">
            <Button size="lg" className="gap-2 bg-lilac hover:bg-lilac-dark">
              <Play className="h-5 w-5" />
              Ver Demonstração
            </Button>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1542739674-b440b9098b53?auto=format&fit=crop&q=80&w=1200" 
            alt="Demonstração do Melhor Corte para Arquitetura" 
            className="w-full h-full object-cover rounded"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="font-playfair text-4xl font-bold text-lilac mb-2">93%</div>
            <p className="text-muted-foreground font-work-sans">Redução de erros em projetos arquitetônicos</p>
          </div>
          <div className="p-4">
            <div className="font-playfair text-4xl font-bold text-lilac mb-2">78%</div>
            <p className="text-muted-foreground font-work-sans">Economia de tempo na fase de planejamento</p>
          </div>
          <div className="p-4">
            <div className="font-playfair text-4xl font-bold text-lilac mb-2">25%</div>
            <p className="text-muted-foreground font-work-sans">Economia média de materiais por projeto</p>
          </div>
        </div>
      </div>
    </section>
  );
};
