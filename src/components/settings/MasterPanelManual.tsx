
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileDown, Shield, Users, CreditCard, Settings, Lock } from 'lucide-react';
import { generateMasterManual } from '@/utils/masterManual';
import { useAuth } from '@/context/AuthContext';

export function MasterPanelManual() {
  const { user, isAdmin } = useAuth();
  const isMasterUser = user?.email === "gustavo@softcomfortaleza.com.br";
  
  const handleDownloadManual = () => {
    generateMasterManual();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Manual do Painel Master</h3>
          <p className="text-sm text-muted-foreground">
            Documentação completa para administradores do sistema.
          </p>
        </div>
        <Button 
          onClick={handleDownloadManual}
          className="flex items-center gap-2"
          disabled={!isAdmin && !isMasterUser}
        >
          <FileDown className="h-4 w-4" />
          <span>Baixar Manual PDF</span>
        </Button>
      </div>

      {!isAdmin && !isMasterUser ? (
        <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Acesso Restrito</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  O Manual do Painel Master está disponível apenas para administradores do sistema. 
                  Entre em contato com o suporte para mais informações.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Conteúdo do Manual</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Ícone</TableHead>
                  <TableHead>Seção</TableHead>
                  <TableHead className="text-right">Páginas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Shield className="h-5 w-5 text-primary" />
                  </TableCell>
                  <TableCell>Acesso ao Sistema</TableCell>
                  <TableCell className="text-right">1-2</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Users className="h-5 w-5 text-primary" />
                  </TableCell>
                  <TableCell>Gestão de Usuários</TableCell>
                  <TableCell className="text-right">3-5</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <CreditCard className="h-5 w-5 text-primary" />
                  </TableCell>
                  <TableCell>Controle Financeiro</TableCell>
                  <TableCell className="text-right">6-7</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Settings className="h-5 w-5 text-primary" />
                  </TableCell>
                  <TableCell>Configurações Globais</TableCell>
                  <TableCell className="text-right">8-9</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Lock className="h-5 w-5 text-primary" />
                  </TableCell>
                  <TableCell>Segurança e Acesso</TableCell>
                  <TableCell className="text-right">10-12</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Acesso exclusivo para Master</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Como usuário Master, você possui acesso a todas as funcionalidades do sistema, 
                    incluindo a capacidade de gerenciar outros administradores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
