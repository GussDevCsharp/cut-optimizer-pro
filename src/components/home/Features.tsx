
import React from "react";
import { Ruler, Compass, Grid3X3, Layers, Scale, PenTool } from "lucide-react";

export const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-gradient-to-r from-gray-50 to-gray-100/50">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-playfair text-charcoal-dark">
            Ferramentas de Precisão Arquitetônica
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-work-sans">
            Recursos desenvolvidos por arquitetos para arquitetos e profissionais que exigem excelência em cada corte.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-light/50">
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-lilac-light/30 mb-4">
              <Compass className="h-6 w-6 text-lilac-dark" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-playfair">Precisão Milimétrica</h3>
            <p className="text-muted-foreground flex-1 font-work-sans">
              Algoritmo baseado em princípios arquitetônicos que otimiza cada corte com precisão de 0.1mm.
            </p>
          </div>
          <div className="flex flex-col p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-light/50">
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-lilac-light/30 mb-4">
              <Layers className="h-6 w-6 text-lilac-dark" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-playfair">Visualização em Camadas</h3>
            <p className="text-muted-foreground flex-1 font-work-sans">
              Veja cada camada do seu projeto em tempo real, facilitando a compreensão espacial de cada corte.
            </p>
          </div>
          <div className="flex flex-col p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-light/50">
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-lilac-light/30 mb-4">
              <Grid3X3 className="h-6 w-6 text-lilac-dark" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-playfair">Grade Paramétrica</h3>
            <p className="text-muted-foreground flex-1 font-work-sans">
              Utilize grades paramêtricas para otimizar ainda mais seus projetos, criando padrões eficientes de corte.
            </p>
          </div>
          <div className="flex flex-col p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-light/50">
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-lilac-light/30 mb-4">
              <Ruler className="h-6 w-6 text-lilac-dark" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-playfair">Especificações Técnicas</h3>
            <p className="text-muted-foreground flex-1 font-work-sans">
              Documente cada especificação técnica de corte, garantindo que sua equipe execute com exatidão.
            </p>
          </div>
          <div className="flex flex-col p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-light/50">
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-lilac-light/30 mb-4">
              <PenTool className="h-6 w-6 text-lilac-dark" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-playfair">Detalhamento Arquitetônico</h3>
            <p className="text-muted-foreground flex-1 font-work-sans">
              Crie detalhamentos precisos para cada projeto, facilitando a comunicação com fornecedores e clientes.
            </p>
          </div>
          <div className="flex flex-col p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-light/50">
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-lilac-light/30 mb-4">
              <Scale className="h-6 w-6 text-lilac-dark" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-playfair">Otimização de Recursos</h3>
            <p className="text-muted-foreground flex-1 font-work-sans">
              Maximize o uso de cada material, reduzindo desperdícios e aumentando a sustentabilidade dos seus projetos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
