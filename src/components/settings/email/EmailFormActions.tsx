
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, Mail } from "lucide-react";

interface EmailFormActionsProps {
  isTesting: boolean;
  onTestEmail: () => void;
}

export const EmailFormActions: React.FC<EmailFormActionsProps> = ({ isTesting, onTestEmail }) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row pt-2">
      <Button type="submit" className="gap-2">
        <Save className="h-4 w-4" />
        Salvar Configurações
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onTestEmail}
        disabled={isTesting}
        className="gap-2"
      >
        <Mail className="h-4 w-4" />
        {isTesting ? "Enviando..." : "Enviar Email de Teste"}
      </Button>
    </div>
  );
};
