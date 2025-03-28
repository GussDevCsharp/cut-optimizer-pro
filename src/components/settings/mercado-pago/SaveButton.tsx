
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader, Save, Check } from 'lucide-react';

interface SaveButtonProps {
  isLoading: boolean;
  isSaved: boolean;
}

export function SaveButton({ isLoading, isSaved }: SaveButtonProps) {
  return (
    <Button 
      type="submit" 
      disabled={isLoading}
      className="w-full md:w-auto"
    >
      {isLoading ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Salvando...
        </>
      ) : isSaved ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Configurações Salvas
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </>
      )}
    </Button>
  );
}
