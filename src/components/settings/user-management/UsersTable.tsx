
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX, Clock, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

interface UserData {
  id: string;
  name?: string;
  email: string;
  isActive: boolean;
  planType?: string;
  expirationDate: Date | null;
  subscriptionId: string | null;
  autoRenew: boolean;
}

interface UsersTableProps {
  users: UserData[];
  openExtendDialog: (userId: string, subscriptionId: string | null) => void;
  openCancelDialog: (userId: string, subscriptionId: string | null) => void;
}

export function UsersTable({ users, openExtendDialog, openCancelDialog }: UsersTableProps) {
  // Get expiration status
  const getExpirationStatus = (expirationDate: Date | null) => {
    if (!expirationDate) return null;
    
    const today = new Date();
    const diffDays = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'expired', label: 'Expirado', component: <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Expirado</Badge> };
    } else if (diffDays <= 7) {
      return { status: 'warning', label: `Expira em ${diffDays} dias`, component: <Badge variant="outline" className="flex items-center gap-1 text-amber-500 border-amber-500"><Clock className="h-3 w-3" /> {diffDays} dias</Badge> };
    } else {
      return { status: 'ok', label: `${diffDays} dias restantes`, component: <Badge variant="outline" className="flex items-center gap-1 text-green-500 border-green-500"><CheckCircle className="h-3 w-3" /> {diffDays} dias</Badge> };
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Expiração</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => {
              const expirationStatus = getExpirationStatus(user.expirationDate);
              
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || '-'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                        <UserCheck className="mr-1 h-3 w-3" />
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400">
                        <UserX className="mr-1 h-3 w-3" />
                        Bloqueado
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{user.planType || 'Sem plano'}</TableCell>
                  <TableCell>
                    {user.expirationDate 
                      ? (
                        <div className="flex items-center gap-2">
                          {format(new Date(user.expirationDate), 'dd/MM/yyyy', { locale: ptBR })}
                          {expirationStatus?.component}
                        </div>
                      )
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => openExtendDialog(user.id, user.subscriptionId)}
                        disabled={!user.subscriptionId && !user.isActive}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Renovar
                      </Button>
                      
                      {user.subscriptionId && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-2 text-xs text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
                          onClick={() => openCancelDialog(user.id, user.subscriptionId)}
                        >
                          <UserX className="h-3 w-3 mr-1" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
