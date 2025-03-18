
import React from 'react';
import { Ruler, Compass, Grid } from 'lucide-react';

export const ArchitectureHeader = () => {
  return (
    <div className="w-full mb-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-dark/80 to-charcoal/70 z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=1200" 
        alt="Architectural background" 
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2">
          Arquitec
        </h1>
        <div className="flex items-center space-x-4 text-white/90 mb-3">
          <Ruler size={20} />
          <Compass size={20} />
          <Grid size={20} />
        </div>
        <p className="font-work-sans text-white/80 max-w-md">
          Planejamento e otimização de corte para seus projetos arquitetônicos
        </p>
      </div>
    </div>
  );
};
