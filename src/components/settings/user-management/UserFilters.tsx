
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  expirationFilter: string;
  setExpirationFilter: (value: string) => void;
}

export function UserFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  expirationFilter,
  setExpirationFilter
}: UserFiltersProps) {
  return (
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
  );
}
