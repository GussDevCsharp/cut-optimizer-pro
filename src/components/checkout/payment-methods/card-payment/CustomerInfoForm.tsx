
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerInfoFormProps {
  name: string;
  email: string;
  cpf: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onCpfChange: (value: string) => void;
  errors: Record<string, string>;
  isLoading: boolean;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  name,
  email,
  cpf,
  onNameChange,
  onEmailChange,
  onCpfChange,
  errors,
  isLoading
}) => {
  return (
    <div className="space-y-4 mb-6">
      <h4 className="font-medium">Dados pessoais</h4>
      
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
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
          onChange={(e) => onEmailChange(e.target.value)}
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
          onChange={(e) => onCpfChange(e.target.value)}
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
