
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCPF, validateCPF } from "@/services/mercadoPago";

interface CustomerInfoFormProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  cpf: string;
  setCpf: (value: string) => void;
  errors: Record<string, string>;
  isLoading: boolean;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  cpf,
  setCpf,
  errors,
  isLoading
}) => {
  // Format CPF as user types
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  return (
    <div className="space-y-4 mb-6">
      <h4 className="font-medium">Dados pessoais</h4>
      
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome completo"
          disabled={isLoading}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          disabled={isLoading}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          value={cpf}
          onChange={handleCpfChange}
          placeholder="000.000.000-00"
          maxLength={14}
          disabled={isLoading}
        />
        {errors.cpf && <p className="text-xs text-destructive">{errors.cpf}</p>}
      </div>
    </div>
  );
};

export default CustomerInfoForm;
