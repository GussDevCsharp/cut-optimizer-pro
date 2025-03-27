
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Search, 
  UserCheck, 
  UserX, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Calendar
} from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { getAllUsers } from '@/services/userManagementService';
import { extendUserSubscription, cancelUserSubscription } from '@/services/subscriptionService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function UserManagementPanel() {
  const { user, hasMasterAccess } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expirationFilter, setExpirationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [renewalDays, setRenewalDays] = useState('30'); // Default to 30 days
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();
  
  // Check if current user has master access
  const isMasterAdmin = hasMasterAccess;
  
  // Fetch all users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    enabled: isMasterAdmin, // Only fetch if master admin
  });

  // Mutation for extending subscription
  const extendSubscriptionMutation = useMutation({
    mutationFn: ({subscriptionId, days}: {subscriptionId: string, days: number}) => 
      extendUserSubscription(subscriptionId, days),
    onSuccess: () => {
      toast.success('Assinatura renovada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsExtendDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error extending subscription:', error);
      toast.error('Erro ao renovar assinatura. Tente novamente.');
    }
  });

  // Mutation for canceling subscription
  const cancelSubscriptionMutation = useMutation({
    mutationFn: (subscriptionId: string) => cancelUserSubscription(subscriptionId),
    onSuccess: () => {
      toast.success('Assinatura cancelada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCancelDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error canceling subscription:', error);
      toast.error('Erro ao cancelar assinatura. Tente novamente.');
    }
  });

  const handleExtendSubscription = () => {
    if (selectedSubscriptionId && renewalDays) {
      extendSubscriptionMutation.mutate({
        subscriptionId: selectedSubscriptionId,
        days: parseInt(renewalDays)
      });
    }
  };

  const handleCancelSubscription = () => {
    if (selectedSubscriptionId) {
      cancelSubscriptionMutation.mutate(selectedSubscriptionId);
    }
  };

  // Setup for renewal dialog
  const openExtendDialog = (userId: string, subscriptionId: string | null) => {
    if (!subscriptionId) {
      toast.error('Este usuário não possui uma assinatura ativa.');
      return;
    }
    setSelectedUserId(userId);
    setSelectedSubscriptionId(subscriptionId);
    setIsExtendDialogOpen(true);
  };

  // Setup for cancel dialog
  const openCancelDialog = (userId: string, subscriptionId: string | null) => {
    if (!subscriptionId) {
      toast.error('Este usuário não possui uma assinatura ativa.');
      return;
    }
    setSelectedUserId(userId);
    setSelectedSubscriptionId(subscriptionId);
    setIsCancelDialogOpen(true);
  };

  if (!isMasterAdmin) {
    return (
      <div className="p-4 border rounded-md bg-muted/20">
        <p className="text-center text-muted-foreground">
          Acesso restrito ao administrador master.
        </p>
      </div>
    );
  }
  
  // Filter users based on search term and filters
  const filteredUsers = users ? users.filter(user => {
    // Search filter
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) || 
      (statusFilter === 'blocked' && !user.isActive);
    
    // Expiration filter
    let matchesExpiration = true;
    if (expirationFilter !== 'all' && user.expirationDate) {
      const expDate = new Date(user.expirationDate);
      const today = new Date();
      const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (expirationFilter === 'expired') {
        matchesExpiration = diffDays < 0;
      } else if (expirationFilter === 'soon') {
        matchesExpiration = diffDays >= 0 && diffDays <= 7;
      } else if (expirationFilter === 'future') {
        matchesExpiration = diffDays > 7;
      }
    }
    
    return matchesSearch && matchesStatus && matchesExpiration;
  }) : [];
  
  // Pagination logic
  const totalPages = Math.ceil((filteredUsers?.length || 0) / itemsPerPage);
  const paginatedUsers = filteredUsers?.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Gerenciamento de Usuários</h3>
        <p className="text-sm text-muted-foreground">
          Visualize e gerencie todos os usuários do sistema e suas assinaturas.
        </p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="blocked">Bloqueados</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={expirationFilter} onValueChange={setExpirationFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Expiração" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Datas</SelectItem>
            <SelectItem value="expired">Expirados</SelectItem>
            <SelectItem value="soon">Expira em 7 dias</SelectItem>
            <SelectItem value="future">Expira após 7 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Users Table */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
          <p>Erro ao carregar usuários. Tente novamente mais tarde.</p>
        </div>
      ) : (
        <>
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
                {paginatedUsers && paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => {
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
          
          {/* Pagination */}
          {filteredUsers && filteredUsers.length > itemsPerPage && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={currentPage === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* Extension Dialog */}
      <Dialog open={isExtendDialogOpen} onOpenChange={setIsExtendDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Renovar Assinatura</DialogTitle>
            <DialogDescription>
              Defina um novo período de validade para a assinatura do usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Select 
                value={renewalDays} 
                onValueChange={setRenewalDays}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 dias (1 mês)</SelectItem>
                  <SelectItem value="90">90 dias (3 meses)</SelectItem>
                  <SelectItem value="180">180 dias (6 meses)</SelectItem>
                  <SelectItem value="365">365 dias (1 ano)</SelectItem>
                </SelectContent>
              </Select>
              {renewalDays && (
                <p className="text-sm text-muted-foreground">
                  Nova data de expiração: {format(addDays(new Date(), parseInt(renewalDays)), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsExtendDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleExtendSubscription}
              disabled={extendSubscriptionMutation.isPending}
            >
              {extendSubscriptionMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar Renovação'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancelar Assinatura</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar esta assinatura? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsCancelDialogOpen(false)}
            >
              Voltar
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={cancelSubscriptionMutation.isPending}
            >
              {cancelSubscriptionMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar Cancelamento'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
