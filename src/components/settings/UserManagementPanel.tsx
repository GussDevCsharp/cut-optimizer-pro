
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { getAllUsers } from '@/services/userManagementService';
import { extendUserSubscription, cancelUserSubscription } from '@/services/subscriptionService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  UserFilters,
  UsersTable,
  ExtendSubscriptionDialog,
  CancelSubscriptionDialog,
  UserPagination
} from './user-management';

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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Gerenciamento de Usuários</h3>
        <p className="text-sm text-muted-foreground">
          Visualize e gerencie todos os usuários do sistema e suas assinaturas.
        </p>
      </div>
      
      {/* Filters */}
      <UserFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        expirationFilter={expirationFilter}
        setExpirationFilter={setExpirationFilter}
      />
      
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
          <UsersTable 
            users={paginatedUsers || []}
            openExtendDialog={openExtendDialog}
            openCancelDialog={openCancelDialog}
          />
          
          {/* Pagination */}
          <UserPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      )}

      {/* Extension Dialog */}
      <ExtendSubscriptionDialog 
        isOpen={isExtendDialogOpen}
        onOpenChange={setIsExtendDialogOpen}
        renewalDays={renewalDays}
        setRenewalDays={setRenewalDays}
        handleExtendSubscription={handleExtendSubscription}
        isPending={extendSubscriptionMutation.isPending}
      />

      {/* Cancel Subscription Dialog */}
      <CancelSubscriptionDialog 
        isOpen={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        handleCancelSubscription={handleCancelSubscription}
        isPending={cancelSubscriptionMutation.isPending}
      />
    </div>
  );
}
