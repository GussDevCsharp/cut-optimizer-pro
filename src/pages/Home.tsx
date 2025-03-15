import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle2, 
  LayoutDashboard, 
  Scissors, 
  Target, 
  Zap, 
  Clock
} from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">
              Melhor Corte
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Recursos
            </a>
            <a href="#benefits" className="text-sm font-medium hover:text-primary transition-colors">
              Benefícios
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Preços
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Depoimentos
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/cadastro">
              <Button>
                Começar Agora
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Recursos Poderosos para seu Negócio
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Transforme a maneira como você planeja seus cortes e maximize o aproveitamento de material.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Otimização Inteligente</h3>
              <p className="text-muted-foreground flex-1">
                Algoritmo avançado que encontra a melhor distribuição de peças para minimizar desperdício.
              </p>
            </div>
            <div className="flex flex-col p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visualização em Tempo Real</h3>
              <p className="text-muted-foreground flex-1">
                Veja instantaneamente como suas peças serão dispostas na chapa, facilitando o planejamento.
              </p>
            </div>
            <div className="flex flex-col p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cálculos Automáticos</h3>
              <p className="text-muted-foreground flex-1">
                Esqueça planilhas complexas. Nosso sistema calcula tudo para você, incluindo custos e economia.
              </p>
            </div>
            <div className="flex flex-col p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Economize Tempo</h3>
              <p className="text-muted-foreground flex-1">
                Reduza drasticamente o tempo gasto planejando cortes manualmente e foque no que importa.
              </p>
            </div>
            <div className="flex flex-col p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
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
                  className="h-6 w-6 text-primary"
                >
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Exportação Profissional</h3>
              <p className="text-muted-foreground flex-1">
                Gere relatórios detalhados e envie diretamente para sua equipe ou clientes.
              </p>
            </div>
            <div className="flex flex-col p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
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
                  className="h-6 w-6 text-primary"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Colaboração em Equipe</h3>
              <p className="text-muted-foreground flex-1">
                Compartilhe projetos facilmente entre sua equipe e mantenha todos alinhados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section with Social Proof */}
      <section id="benefits" className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Por que profissionais escolhem Melhor Corte?
              </h2>
              <p className="text-muted-foreground md:text-xl">
                Junte-se a centenas de profissionais que já transformaram seus negócios.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="rounded-full w-8 h-8 flex items-center justify-center bg-primary/10 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Redução de até 30% no desperdício</h3>
                    <p className="text-muted-foreground">
                      Nossos clientes relatam economia significativa de material desde o primeiro projeto.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full w-8 h-8 flex items-center justify-center bg-primary/10 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Aumento de produtividade em 45%</h3>
                    <p className="text-muted-foreground">
                      Menos tempo planejando, mais tempo produzindo. Automatize o processo tedioso de planejar cortes.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full w-8 h-8 flex items-center justify-center bg-primary/10 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Maior satisfação do cliente</h3>
                    <p className="text-muted-foreground">
                      Apresente orçamentos mais precisos e prazos mais confiáveis para seus clientes.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full w-8 h-8 flex items-center justify-center bg-primary/10 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Retorno sobre investimento rápido</h3>
                    <p className="text-muted-foreground">
                      O valor economizado em material nos primeiros projetos já cobre o investimento na ferramenta.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
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
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm/relaxed text-muted-foreground">
                      "Desde que começamos a usar o Melhor Corte, conseguimos reduzir o desperdício de MDF em quase 25%. A economia financeira é real e significativa para nossa marcenaria."
                    </p>
                    <div>
                      <p className="font-semibold text-sm">Roberto Silva</p>
                      <p className="text-xs text-muted-foreground">
                        Proprietário, Silva Marcenaria
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
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
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm/relaxed text-muted-foreground">
                      "A visualização em tempo real mudou completamente nossa forma de trabalhar. Conseguimos mostrar aos clientes exatamente como será o aproveitamento do material antes mesmo de iniciar a produção."
                    </p>
                    <div>
                      <p className="font-semibold text-sm">Ana Oliveira</p>
                      <p className="text-xs text-muted-foreground">
                        Gerente de Produção, Móveis Personalizados
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                    JS
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                    TM
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                    RB
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                    +
                  </div>
                </div>
                <div className="text-sm text-muted-foreground text-center sm:text-left">
                  Junte-se a mais de <span className="font-bold text-primary">500+ profissionais</span> que confiam no Melhor Corte diariamente
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
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

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Planos que cabem no seu bolso
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Escolha o plano ideal para o seu negócio e comece a economizar hoje mesmo
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="flex flex-col p-6 bg-card rounded-lg shadow-sm border border-border relative overflow-hidden">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">Iniciante</h3>
                <div className="mt-3">
                  <span className="text-3xl font-bold">R$59</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Perfeito para pequenas marcenarias
                </p>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">Até 10 projetos por mês</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">Otimização básica</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">Exportação em PDF</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">1 usuário</span>
                </li>
              </ul>
              <Link to="/cadastro" className="w-full">
                <Button className="w-full" variant="outline">
                  Começar Teste Grátis
                </Button>
              </Link>
              <p className="text-xs text-center text-muted-foreground mt-3">
                7 dias grátis, sem compromisso
              </p>
            </div>
            
            {/* Pro Plan */}
            <div className="flex flex-col p-6 bg-card rounded-lg shadow-md border-2 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                  Mais Popular
                </div>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">Profissional</h3>
                <div className="mt-3">
                  <span className="text-3xl font-bold">R$99</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Ideal para marcenarias em crescimento
                </p>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">Projetos ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">Otimização avançada</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">Exportação em PDF e Excel</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">3 usuários</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">Compartilhamento por email</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">Suporte prioritário</span>
                </li>
              </ul>
              <Link to="/cadastro" className="w-full">
                <Button className="w-full">
                  Começar Teste Grátis
                </Button>
              </Link>
              <p className="text-xs text-center text-muted-foreground mt-3">
                7 dias grátis, sem compromisso
              </p>
            </div>
            
            {/* Enterprise Plan */}
            <div className="flex flex-col p-6 bg-card rounded-lg shadow-sm border border-border relative overflow-hidden">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">Empresarial</h3>
                <div className="mt-3">
                  <span className="text-3xl font-bold">R$199</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Para empresas e indústrias
                </p>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">Tudo do plano Profissional</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">10 usuários</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">Suporte dedicado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">Treinamento personalizado</span>
                </li>
              </ul>
              <Link to="/cadastro" className="w-full">
                <Button className="w-full" variant="outline">
                  Falar com Consultor
                </Button>
              </Link>
              <p className="text-xs text-center text-muted-foreground mt-3">
                Demonstração personalizada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container px-4 py-12 md:px-6 md:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="h-6
