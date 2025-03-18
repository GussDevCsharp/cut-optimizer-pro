
import React from "react";
import { Ruler, Compass, Grid3X3 } from "lucide-react";

export const ArchitecturalHeader = () => {
  return (
    <div className="w-full h-[40vh] md:h-[50vh] overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-dark/80 via-charcoal/70 to-transparent z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&q=80&w=1800" 
        alt="Architectural background" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Arquitetura & Precisão
        </h1>
        <div className="flex items-center space-x-6 text-white/90 mb-5">
          <Ruler className="h-6 w-6 md:h-8 md:w-8" />
          <Compass className="h-6 w-6 md:h-8 md:w-8" />
          <Grid3X3 className="h-6 w-6 md:h-8 md:w-8" />
        </div>
        <p className="font-work-sans text-white/80 max-w-xl text-lg md:text-xl">
          Transforme seus projetos arquitetônicos com soluções precisas de otimização de corte
        </p>
      </div>
    </div>
  );
};
