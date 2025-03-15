
import React from "react";
import { Scissors } from "lucide-react";

export const HomeFooter = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Scissors className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Melhor Corte</span>
            </div>
            <p className="text-muted-foreground max-w-md mb-4">
              A solução completa para otimização de cortes de materiais, 
              ajudando profissionais a economizar tempo e dinheiro todos os dias.
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Metacom Soluções. Todos os direitos reservados.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Produto</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Preços
                </a>
              </li>
              <li>
                <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Demonstração
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Atualizações
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Tutoriais
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Suporte
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Sobre nós
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
