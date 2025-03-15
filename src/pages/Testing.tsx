
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, Settings, Database, Users, RefreshCw } from "lucide-react";

export default function Testing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const runTest = async (testId: string, testName: string) => {
    setLoading(prev => ({ ...prev, [testId]: true }));
    
    // Simulate a test running
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Teste Concluído",
      description: `O teste "${testName}" foi executado com sucesso.`,
      variant: "default"
    });
    
    setLoading(prev => ({ ...prev, [testId]: false }));
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Ambiente de Testes</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                <span>Banco de Dados</span>
              </CardTitle>
              <CardDescription>Verificar conexão e tabelas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Executa testes de conexão com o banco de dados e verifica a integridade das tabelas.</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => runTest("db", "Banco de Dados")} 
                disabled={loading["db"]}
                className="w-full"
              >
                {loading["db"] ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Executar Teste
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <span>Autenticação</span>
              </CardTitle>
              <CardDescription>Verificar sistema de login</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Testa o sistema de autenticação, verificação de emails e recuperação de senha.</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => runTest("auth", "Autenticação")} 
                disabled={loading["auth"]}
                className="w-full"
              >
                {loading["auth"] ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Executar Teste
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-500" />
                <span>Sistema</span>
              </CardTitle>
              <CardDescription>Verificar componentes do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Executa diagnósticos gerais do sistema e verifica a integridade dos componentes.</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => runTest("system", "Sistema")}
                disabled={loading["system"]}
                className="w-full"
              >
                {loading["system"] ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Executar Teste
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
