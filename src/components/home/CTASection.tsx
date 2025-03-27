
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import CTAButton from './CTAButton';

const CTASection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Comece a Otimizar Seus Projetos Hoje
        </h2>
        <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
          Escolha o plano ideal e transforme a forma como você gerencia seus projetos de marcenaria.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Plano Profissional</h3>
            <p className="text-3xl font-bold text-primary mb-2">R$49,90<span className="text-sm text-gray-500 font-normal">/mês</span></p>
            <p className="text-sm text-gray-600 mb-4">Ideal para pequenas marcenarias</p>
            
            <ul className="text-left space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Até 3 projetos simultâneos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Otimização avançada</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">3 usuários</span>
              </li>
            </ul>
            
            <CTAButton 
              productId="pro-monthly"
              productName="Plano Profissional Mensal"
              productDescription="Acesso a até 3 projetos simultâneos"
              productPrice={49.90}
              buttonText="Assinar Agora"
              buttonVariant="default"
              className="w-full"
              showCheckout={true}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 flex-1 border-2 border-primary relative">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
              <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full shadow-md">
                Mais Popular
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Plano Empresarial</h3>
            <p className="text-3xl font-bold text-primary mb-2">R$129,00<span className="text-sm text-gray-500 font-normal">/mês</span></p>
            <p className="text-sm text-gray-600 mb-4">Para empresas e indústrias</p>
            
            <ul className="text-left space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Até 6 projetos simultâneos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">6 usuários</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">Suporte dedicado</span>
              </li>
            </ul>
            
            <CTAButton 
              productId="business-monthly"
              productName="Plano Empresarial Mensal"
              productDescription="Acesso a até 6 projetos simultâneos"
              productPrice={129.00}
              buttonText="Economize com o plano anual"
              buttonVariant="default"
              className="w-full"
              showCheckout={true}
            />
          </div>
        </div>
        
        <p className="text-white/80 text-sm mt-6">
          7 dias de garantia. Cancele quando quiser.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
