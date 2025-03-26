
import React from 'react';
import CTAButton from './CTAButton';

const CTASection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Comece Agora Mesmo
        </h2>
        <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
          Experimente nossa solução completa e transforme a forma como você gerencia seus projetos.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <CTAButton 
            productId="premium-monthly"
            productName="Plano Premium Mensal"
            productDescription="Acesso completo a todas as funcionalidades por 1 mês"
            productPrice={49.90}
            buttonText="Assinar agora"
            buttonVariant="default"
            className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700"
          />
          
          <CTAButton 
            productId="premium-yearly"
            productName="Plano Premium Anual"
            productDescription="Acesso completo a todas as funcionalidades por 12 meses (2 meses grátis)"
            productPrice={499.00}
            buttonText="Economize com o plano anual"
            buttonVariant="outline"
            className="border-white text-white hover:bg-white/10"
          />
        </div>
        
        <p className="text-white/80 text-sm mt-6">
          7 dias de garantia. Cancele quando quiser.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
