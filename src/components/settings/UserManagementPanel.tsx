
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Search, UserCheck, UserX } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { getAllUsers } from '@/services/userManagementService';
import { useAuth } from '@/context/AuthContext';

export function UserManagementPanel() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expirationFilter, setExpirationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Check if current user is master admin
  const isMasterAdmin = user?.email === "gustavo@softcomfortaleza.com.br";
  
  // Fetch all users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    enabled: isMasterAdmin, // Only fetch if master admin
  });

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
          Visualize e gerencie todos os usuários do sistema.
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
                  <TableHead>Data de Expiração</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers && paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
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
                      <TableCell>{user.planType || 'Básico'}</TableCell>
                      <TableCell>
                        {user.expirationDate 
                          ? format(new Date(user.expirationDate), 'dd/MM/yyyy')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-2 text-xs"
                        >
                          {user.isActive ? 'Bloquear' : 'Ativar'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
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
    </div>
  );
}
