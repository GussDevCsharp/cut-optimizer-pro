
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader, FileText } from 'lucide-react';
import { CustomerInfoForm } from "../../payment-methods/customer-info";
import { CustomerData } from "@/services/mercadoPago";

interface BoletoFormProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  cpf: string;
  setCpf: (value: string) => void;
  errors: Record<string, string>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const BoletoForm: React.FC<BoletoFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  cpf,
  setCpf,
  errors,
  isLoading,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <CustomerInfoForm
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        cpf={cpf}
        setCpf={setCpf}
        errors={errors}
        isLoading={isLoading}
      />
      
      <Button 
        type="submit" 
        className="w-full mt-6" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Gerando boleto...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Gerar boleto
          </>
        )}
      </Button>
    </form>
  );
};

export default BoletoForm;
