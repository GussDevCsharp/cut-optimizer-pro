
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const ReportTemplate = () => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Relatório de Testes</h1>
        <p className="text-muted-foreground">Melhor Corte - Sistema de Otimização</p>
        <div className="mt-2">Data: {currentDate}</div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações do Teste</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Testador</p>
              <p className="font-medium">Nome do Testador</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Versão</p>
              <p className="font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ambiente</p>
              <p className="font-medium">Produção</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duração</p>
              <p className="font-medium">2 horas</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sumário de Resultados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <SummaryCard label="Total de Testes" value="78" />
            <SummaryCard label="Aprovados" value="72" variant="success" />
            <SummaryCard label="Falhas" value="4" variant="destructive" />
            <SummaryCard label="Pendentes" value="2" variant="warning" />
          </div>
          
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-primary h-full rounded-full" style={{ width: "92%" }} />
          </div>
          <div className="text-sm text-center text-muted-foreground">
            92% de aprovação
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalhes dos Testes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <TestCategory 
              name="Autenticação e Contas" 
              total={7}
              passed={7}
              comments="Todos os testes passaram com sucesso"
            />
            
            <Separator />
            
            <TestCategory 
              name="Dashboard e Navegação" 
              total={6}
              passed={6}
              comments="Interface responsiva e navegação fluida"
            />
            
            <Separator />
            
            <TestCategory 
              name="Configuração de Projeto" 
              total={5}
              passed={4}
              failed={1}
              comments="Problema identificado na persistência das configurações ao navegar entre telas"
            />
            
            <Separator />
            
            <TestCategory 
              name="Gerenciamento de Peças" 
              total={9}
              passed={8}
              failed={1}
              comments="Importação de Excel com formato incorreto não exibe mensagem de erro adequada"
            />
            
            <Separator />
            
            <TestCategory 
              name="Otimização de Corte" 
              total={7}
              passed={6}
              pending={1}
              comments="Otimização com muitas peças (>50) precisa ser verificada novamente"
            />
            
            <Separator />
            
            <TestCategory 
              name="Visualização e Navegação" 
              total={5}
              passed={5}
              comments="Funcionalidade implementada corretamente"
            />
            
            <Separator />
            
            <TestCategory 
              name="Compartilhamento e Exportação" 
              total={6}
              passed={5}
              failed={1}
              comments="Compartilhamento por email não está incluindo todas as chapas no relatório"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Observações Finais</h2>
        <p className="mb-2">
          O sistema apresenta boa estabilidade e desempenho geral. Foram identificados poucos problemas, 
          principalmente relacionados à exportação e persistência de dados.
        </p>
        <p>
          Recomenda-se correção das falhas identificadas antes do lançamento da versão final.
        </p>
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Este é um relatório gerado a partir da rotina de testes do Melhor Corte</p>
        <p>© {new Date().getFullYear()} Melhor Corte - Todos os direitos reservados</p>
      </div>
    </div>
  );
};

interface SummaryCardProps {
  label: string;
  value: string;
  variant?: "default" | "success" | "destructive" | "warning";
}

const SummaryCard = ({ label, value, variant = "default" }: SummaryCardProps) => {
  const getBgColor = () => {
    switch (variant) {
      case "success": return "bg-success/10 text-success";
      case "destructive": return "bg-destructive/10 text-destructive";
      case "warning": return "bg-warning/10 text-warning";
      default: return "bg-muted";
    }
  };
  
  return (
    <div className={`p-4 rounded-lg ${getBgColor()} text-center`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs mt-1">{label}</div>
    </div>
  );
};

interface TestCategoryProps {
  name: string;
  total: number;
  passed: number;
  failed?: number;
  pending?: number;
  comments: string;
}

const TestCategory = ({ name, total, passed, failed = 0, pending = 0, comments }: TestCategoryProps) => {
  const passRate = Math.round((passed / total) * 100);
  
  return (
    <div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{comments}</p>
        </div>
        <div className="flex gap-2">
          {passed > 0 && <Badge variant="outline" className="bg-success/10 text-success">{passed} aprovados</Badge>}
          {failed > 0 && <Badge variant="outline" className="bg-destructive/10 text-destructive">{failed} falhas</Badge>}
          {pending > 0 && <Badge variant="outline" className="bg-warning/10 text-warning">{pending} pendentes</Badge>}
        </div>
      </div>
      
      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
        <div className="bg-primary h-full rounded-full" style={{ width: `${passRate}%` }} />
      </div>
      <div className="text-xs text-right mt-1 text-muted-foreground">
        {passRate}% aprovação
      </div>
    </div>
  );
};

export default ReportTemplate;
