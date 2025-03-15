
import React from "react";
import { Button } from "@/components/ui/button";

export const DemoSection = () => {
  return (
    <section id="demo" className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Veja como funciona
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Uma breve demonstração de como o Melhor Corte pode transformar seu fluxo de trabalho
          </p>
        </div>
        
        <div className="mx-auto max-w-4xl border rounded-lg shadow-lg bg-card p-2 relative aspect-video overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
            <Button size="lg" className="gap-2">
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
                className="h-5 w-5"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Ver Demonstração
            </Button>
          </div>
          <img 
            src="/placeholder.svg" 
            alt="Demonstração do Melhor Corte" 
            className="w-full h-full object-cover rounded"
          />
        </div>
      </div>
    </section>
  );
};
