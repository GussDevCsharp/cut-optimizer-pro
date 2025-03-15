
import { motion } from "framer-motion";
import { ArrowRight, Check, ExternalLink, Mail, MousePointerClick, Ruler, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header Section */}
      <header className="w-full px-4 py-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-primary-foreground"></div>
            </div>
            <span className="font-bold text-xl">Melhor Corte</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link to="/cadastro">
              <Button size="sm">Experimente Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
        <motion.div 
          className="md:w-1/2 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Otimize seus cortes e <span className="text-primary">maximize seus lucros</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            O software que <span className="font-semibold">revoluciona</span> a forma como você planeja seus cortes, 
            reduzindo desperdício e aumentando sua produtividade em até 30%.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/cadastro">
              <Button size="lg" className="w-full sm:w-auto">
                Comece Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Já tenho uma conta
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Um produto da <span className="font-semibold">Metacom Soluções</span> • Experimente gratuitamente por 14 dias
          </p>
        </motion.div>
        <motion.div 
          className="md:w-1/2 relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative bg-white p-4 rounded-xl shadow-glass border border-gray-100 aspect-video">
            <div className="absolute w-full h-full opacity-10 grid grid-cols-12 grid-rows-12 divide-x divide-y divide-gray-300"></div>
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
                    <div className="w-3 h-3 border-[1.5px] border-primary-foreground"></div>
                  </div>
                  <span className="font-medium text-sm">Plano de Corte #1024</span>
                </div>
                <div className="text-xs font-medium text-primary bg-primary/10 py-1 px-2 rounded-full">
                  Eficiência: 94%
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-3 gap-3">
                <div className="relative bg-primary/5 rounded-lg border border-primary/20 p-2 flex flex-col">
                  <div className="absolute top-1 right-1 text-[10px] font-medium text-primary/70">Placa 1</div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-accent h-12 aspect-video rounded flex items-center justify-center border border-primary/20">
                      <span className="text-[10px] font-medium">30×45</span>
                    </div>
                    <div className="bg-accent h-12 aspect-video rounded flex items-center justify-center border border-primary/20">
                      <span className="text-[10px] font-medium">30×45</span>
                    </div>
                    <div className="bg-accent h-16 aspect-square rounded flex items-center justify-center border border-primary/20">
                      <span className="text-[10px] font-medium">40×40</span>
                    </div>
                    <div className="bg-accent h-6 w-14 rounded flex items-center justify-center border border-primary/20">
                      <span className="text-[10px] font-medium">20×15</span>
                    </div>
                  </div>
                </div>
                <div className="relative bg-primary/5 rounded-lg border border-primary/20 p-2 flex flex-col">
                  <div className="absolute top-1 right-1 text-[10px] font-medium text-primary/70">Placa 2</div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-accent h-20 aspect-square rounded flex items-center justify-center border border-primary/20">
                      <span className="text-[10px] font-medium">50×50</span>
                    </div>
                    <div className="bg-accent h-10 aspect-video rounded flex items-center justify-center border border-primary/20">
                      <span className="text-[10px] font-medium">25×30</span>
                    </div>
                  </div>
                </div>
                <div className="relative bg-primary/5 rounded-lg border border-primary/20 p-2 flex flex-col">
                  <div className="absolute top-1 right-1 text-[10px] font-medium text-primary/70">Placa 3</div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-accent h-14 aspect-video rounded flex items-center justify-center border border-primary/20">
                      <span className="text-[10px] font-medium">35×20</span>
                    </div>
                    <div className="bg-accent h-8 aspect-video rounded flex items-center justify-center border border-primary/20">
                      <span className="text-[10px] font-medium">15×25</span>
                    </div>
                    <div className="bg-accent h-12 aspect-square rounded flex items-center justify-center border border-primary/20">
                      <span className="text-[10px] font-medium">30×30</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex w-full justify-between items-center mt-3">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "94%" }}></div>
                </div>
                <div className="ml-2 text-xs font-medium text-primary">94%</div>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="absolute -top-4 -right-4 bg-white shadow-glass border border-gray-100 p-3 rounded-lg"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Scissors className="h-5 w-5 text-primary" />
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-4 -left-4 bg-white shadow-glass border border-gray-100 p-3 rounded-lg"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
          >
            <Ruler className="h-5 w-5 text-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Recursos que transformam sua produção</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nosso software foi desenvolvido pensando nas necessidades reais dos fabricantes de móveis, 
              oferecendo soluções inteligentes para cada etapa do processo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-sm transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Scissors className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Algoritmo Avançado</CardTitle>
                <CardDescription>
                  Otimização inteligente que reduz o desperdício de material em até 30%.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Nosso algoritmo proprietário calcula o melhor arranjo possível das peças, 
                  economizando material e reduzindo custos.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-sm transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <MousePointerClick className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Interface Intuitiva</CardTitle>
                <CardDescription>
                  Simples de usar, sem necessidade de treinamento extensivo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Desenvolvida para ser extremamente amigável, permitindo que qualquer membro da equipe possa 
                  operar o sistema com facilidade.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-sm transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Relatórios Detalhados</CardTitle>
                <CardDescription>
                  Visualize e compartilhe relatórios completos com sua equipe.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Gere relatórios precisos que podem ser enviados diretamente para a produção, 
                  com todas as medidas e instruções de corte.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Por que escolher o Melhor Corte?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 rounded-full p-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Reduza o desperdício</h3>
                    <p className="text-gray-600">Economize até 30% de material com nosso algoritmo de otimização avançado.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 rounded-full p-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Aumente a produtividade</h3>
                    <p className="text-gray-600">Planeje seus cortes em minutos, não em horas, liberando tempo para outras tarefas.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 rounded-full p-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Minimize erros</h3>
                    <p className="text-gray-600">Elimine erros humanos no planejamento de cortes e reduza o retrabalho.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 rounded-full p-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Controle de custos</h3>
                    <p className="text-gray-600">Acompanhe o uso de material e otimize seus custos de produção.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold">Aumento médio de eficiência</h3>
                  <p className="text-gray-600">Baseado em dados reais de nossos clientes</p>
                </div>
                
                <div className="relative h-40 mb-8">
                  <div className="absolute bottom-0 left-0 w-1/3 h-20 bg-gray-200 rounded-t-lg flex items-end justify-center">
                    <div className="absolute bottom-2 text-sm font-medium">Antes</div>
                    <div className="absolute -top-6 text-sm font-medium">70%</div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-1/3 h-32 bg-primary rounded-t-lg flex items-end justify-center">
                    <div className="absolute bottom-2 text-sm font-medium text-primary-foreground">Depois</div>
                    <div className="absolute -top-6 text-sm font-medium">94%</div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-primary">
                    +24%
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Com o Melhor Corte, nossos clientes conseguem um aproveitamento médio de 94% dos materiais, comparado com 70% usando métodos tradicionais.
                  </p>
                  <Link to="/cadastro">
                    <Button>
                      Experimente Gratuitamente
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Planos que cabem no seu orçamento</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Escolha o plano ideal para o tamanho do seu negócio. Todos os planos incluem acesso completo às funcionalidades.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle>Básico</CardTitle>
                <CardDescription>Para pequenas marcenarias</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$99</span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Até 10 projetos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">1 usuário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Suporte por email</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Exportação em PDF</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Selecionar plano</Button>
              </CardFooter>
            </Card>
            
            <Card className="border-2 border-primary shadow-md relative">
              <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-full">
                Mais popular
              </div>
              <CardHeader>
                <CardTitle>Profissional</CardTitle>
                <CardDescription>Para marcenarias em crescimento</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$199</span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Projetos ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Até 5 usuários</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Suporte prioritário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Exportação em PDF e CSV</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Importação de Excel</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Selecionar plano</Button>
              </CardFooter>
            </Card>
            
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle>Empresarial</CardTitle>
                <CardDescription>Para grandes empresas</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$349</span>
                  <span className="text-gray-500">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Projetos ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Usuários ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Suporte 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Todos os formatos de exportação</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">API para integração</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Selecionar plano</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Pronto para maximizar sua produtividade?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais que estão economizando tempo e material com o Melhor Corte.
              Comece hoje mesmo com nosso período de avaliação gratuito.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastro">
                <Button size="lg">
                  Comece gratuitamente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Agende uma demonstração
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-primary-foreground"></div>
                </div>
                <span className="font-bold">Melhor Corte</span>
              </div>
              <p className="text-sm text-gray-500">
                Um produto da Metacom Soluções.
                <br />
                Otimizando sua produção desde 2023.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Produto</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary">Recursos</a></li>
                <li><a href="#" className="hover:text-primary">Preços</a></li>
                <li><a href="#" className="hover:text-primary">Depoimentos</a></li>
                <li><a href="#" className="hover:text-primary">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary">Sobre nós</a></li>
                <li><a href="#" className="hover:text-primary">Contato</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Carreiras</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary">Termos de Serviço</a></li>
                <li><a href="#" className="hover:text-primary">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-primary">Cookies</a></li>
                <li><a href="#" className="hover:text-primary">Licenças</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Metacom Soluções. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
