
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ClipboardCheck, Bug, RefreshCw, Workflow, FileText } from "lucide-react";
import Layout from "@/components/Layout";
import ReportTemplate from "./ReportTemplate";

export const TestingRoutine = () => {
  const [openReport, setOpenReport] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Rotina de Testes - Melhor Corte</h1>
            <p className="text-muted-foreground">
              Use este guia para verificar todas as funcionalidades do sistema
            </p>
          </div>
          <Dialog open={openReport} onOpenChange={setOpenReport}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Ver exemplo de relatório</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <ReportTemplate />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="functional">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="functional">Testes Funcionais</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="responsive">Responsividade</TabsTrigger>
            <TabsTrigger value="backup">Procedimentos</TabsTrigger>
          </TabsList>

          <TabsContent value="functional" className="space-y-6">
            <TestSection 
              title="Autenticação e Contas" 
              tests={[
                { id: "auth-1", description: "Criação de nova conta com email e senha" },
                { id: "auth-2", description: "Login com credenciais válidas" },
                { id: "auth-3", description: "Recuperação de senha através do email" },
                { id: "auth-4", description: "Validação de formulários (erros para entradas inválidas)" },
                { id: "auth-5", description: "Logout da aplicação" },
                { id: "auth-6", description: "Persistência de login entre sessões" },
                { id: "auth-7", description: "Redirecionamento para áreas protegidas quando não autenticado" },
              ]}
            />

            <TestSection 
              title="Dashboard e Navegação" 
              tests={[
                { id: "dash-1", description: "Carregamento correto do dashboard com projetos existentes" },
                { id: "dash-2", description: "Criação de novo projeto a partir do dashboard" },
                { id: "dash-3", description: "Upload de imagem para preview do projeto" },
                { id: "dash-4", description: "Navegação entre projetos existentes" },
                { id: "dash-5", description: "Limitação do número de projetos no plano Iniciante (máximo 20)" },
                { id: "dash-6", description: "Menu de usuário funcional (acesso ao perfil, configurações, logout)" },
              ]}
            />

            <TestSection 
              title="Configuração de Projeto" 
              tests={[
                { id: "proj-1", description: "Definir nome do projeto" },
                { id: "proj-2", description: "Ajuste das dimensões da chapa (largura e altura)" },
                { id: "proj-3", description: "Configuração da espessura da serra de corte" },
                { id: "proj-4", description: "Persistência das configurações ao navegar entre telas" },
                { id: "proj-5", description: "Salvamento automático das configurações" },
              ]}
            />

            <TestSection 
              title="Gerenciamento de Peças" 
              tests={[
                { id: "piece-1", description: "Adição de peças individuais (nome, largura, altura, quantidade)" },
                { id: "piece-2", description: "Opção de rotação de peças" },
                { id: "piece-3", description: "Edição de peças existentes" },
                { id: "piece-4", description: "Remoção de peças" },
                { id: "piece-5", description: "Importação de peças via texto (formato correto)" },
                { id: "piece-6", description: "Importação de peças via texto (formato incorreto - tratamento de erros)" },
                { id: "piece-7", description: "Importação de peças via Excel (formato correto)" },
                { id: "piece-8", description: "Importação de peças via Excel (formato incorreto - tratamento de erros)" },
                { id: "piece-9", description: "Download do modelo de exemplo para Excel" },
              ]}
            />

            <TestSection 
              title="Otimização de Corte" 
              tests={[
                { id: "opt-1", description: "Otimização com poucas peças (< 10)" },
                { id: "opt-2", description: "Otimização com muitas peças (> 50)" },
                { id: "opt-3", description: "Otimização com peças que não cabem em uma única chapa" },
                { id: "opt-4", description: "Feedback visual do resultado da otimização" },
                { id: "opt-5", description: "Exibição correta das estatísticas (área utilizada, desperdício, eficiência)" },
                { id: "opt-6", description: "Limpeza da visualização" },
                { id: "opt-7", description: "Salvamento do resultado da otimização" },
              ]}
            />

            <TestSection 
              title="Visualização e Navegação de Chapas" 
              tests={[
                { id: "sheet-1", description: "Navegação entre múltiplas chapas (quando há mais de uma)" },
                { id: "sheet-2", description: "Miniaturas das chapas são exibidas corretamente" },
                { id: "sheet-3", description: "Peças são exibidas com cores distintas" },
                { id: "sheet-4", description: "Zoom in/out na visualização da chapa" },
                { id: "sheet-5", description: "Indicador de escala da visualização" },
              ]}
            />

            <TestSection 
              title="Compartilhamento e Exportação" 
              tests={[
                { id: "export-1", description: "Impressão do plano de corte" },
                { id: "export-2", description: "Exportação para PDF" },
                { id: "export-3", description: "Compartilhamento por email" },
                { id: "export-4", description: "Inclusão de todas as chapas na exportação" },
                { id: "export-5", description: "Inclusão da lista de peças no relatório" },
                { id: "export-6", description: "Cabeçalho com nome do projeto no relatório" },
              ]}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <TestSection 
              title="Desempenho da Aplicação" 
              tests={[
                { id: "perf-1", description: "Tempo de carregamento inicial (< 3s)" },
                { id: "perf-2", description: "Tempo de resposta para otimização com 10 peças (< 1s)" },
                { id: "perf-3", description: "Tempo de resposta para otimização com 50 peças (< 3s)" },
                { id: "perf-4", description: "Tempo de resposta para otimização com 100 peças (< 5s)" },
                { id: "perf-5", description: "Uso de memória durante otimização grande (monitorar vazamentos)" },
                { id: "perf-6", description: "Tempo de geração de PDF (< 2s)" },
                { id: "perf-7", description: "Animações fluidas durante navegação" },
              ]}
            />

            <TestSection 
              title="Cache e Armazenamento" 
              tests={[
                { id: "cache-1", description: "Funcionamento correto do modo offline (PWA)" },
                { id: "cache-2", description: "Restauração do estado após perda de conexão" },
                { id: "cache-3", description: "Tamanho do cache local (< 5MB por projeto)" },
                { id: "cache-4", description: "Tempo de salvamento de projeto (< 1s)" },
                { id: "cache-5", description: "Recuperação de projetos salvos (tempo e precisão)" },
              ]}
            />
          </TabsContent>

          <TabsContent value="responsive" className="space-y-6">
            <TestSection 
              title="Responsividade em Dispositivos" 
              tests={[
                { id: "resp-1", description: "Desktop (1920×1080)" },
                { id: "resp-2", description: "Laptop (1366×768)" },
                { id: "resp-3", description: "Tablet (iPad - 768×1024)" },
                { id: "resp-4", description: "Smartphone grande (iPhone 12 - 390×844)" },
                { id: "resp-5", description: "Smartphone pequeno (iPhone SE - 375×667)" },
                { id: "resp-6", description: "Ultrawide (3440×1440)" },
              ]}
            />

            <TestSection 
              title="Interação em Touch Devices" 
              tests={[
                { id: "touch-1", description: "Funcionalidade de zoom com pinça" },
                { id: "touch-2", description: "Navegação por swipe nas chapas" },
                { id: "touch-3", description: "Inputs funcionais em teclados virtuais" },
                { id: "touch-4", description: "Tamanho adequado de alvos touch (botões, etc)" },
              ]}
            />
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <TestSection 
              title="Procedimentos de Backup" 
              tests={[
                { id: "backup-1", description: "Backup manual de projeto (exportação)" },
                { id: "backup-2", description: "Importação de projeto a partir de backup" },
                { id: "backup-3", description: "Recuperação após falha (teste de resiliência)" },
              ]}
            />

            <TestSection 
              title="Planos e Limites" 
              tests={[
                { id: "plans-1", description: "Plano Iniciante: limite de 20 projetos" },
                { id: "plans-2", description: "Plano Profissional: projetos ilimitados" },
                { id: "plans-3", description: "Plano Profissional: acesso a 3 usuários" },
                { id: "plans-4", description: "Plano Empresarial: acesso a 10 usuários" },
                { id: "plans-5", description: "Expiração correta do período de teste gratuito (7 dias)" },
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface TestItemProps {
  id: string;
  description: string;
}

interface TestSectionProps {
  title: string;
  tests: TestItemProps[];
}

const TestSection: React.FC<TestSectionProps> = ({ title, tests }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full max-h-80">
          <div className="space-y-2">
            {tests.map((test) => (
              <div key={test.id} className="flex items-start space-x-2">
                <Checkbox id={test.id} />
                <label
                  htmlFor={test.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {test.description}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TestingRoutine;
