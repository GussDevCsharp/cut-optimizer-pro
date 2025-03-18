
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ErrorMessage } from './ErrorMessage';
import { TextInput } from './TextInput';
import { importProjectFromText } from '../../../utils/project';
import { FileFormatDocumentation } from './FileFormatDocumentation';
import { toast } from "sonner";

interface TextImportTabProps {
  onImportSuccess: (pieces: any[]) => void;
  onImportProject?: (projectData: any) => void;
}

export const TextImportTab = ({ onImportSuccess, onImportProject }: TextImportTabProps) => {
  const [textContent, setTextContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleSubmit = () => {
    try {
      if (!textContent.trim()) {
        setError('Nenhum texto inserido');
        return;
      }

      const projectData = importProjectFromText(textContent);
      
      if (!projectData || !projectData.pieces || projectData.pieces.length === 0) {
        setError('Formato de projeto inválido ou nenhuma peça encontrada');
        return;
      }
      
      if (onImportProject) {
        onImportProject(projectData);
        toast.success(`Projeto "${projectData.projectName}" importado com sucesso`);
      } else {
        onImportSuccess(projectData.pieces);
        toast.success(`${projectData.pieces.length} peças importadas do projeto`);
      }
      
      setTextContent('');
      setError(null);
    } catch (err) {
      setError(`Erro ao processar projeto: ${err instanceof Error ? err.message : 'Formato inválido'}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setError(null);
    
    try {
      const text = await file.text();
      setTextContent(text);
    } catch (err) {
      setError(`${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <TextInput 
        textContent={textContent}
        setTextContent={setTextContent}
        onFileUpload={handleFileUpload}
        clearError={clearError}
        placeholder="P;Meu Projeto;1.0;2023-06-25T12:30:45.000Z&#10;S;1220;2440;4;material-id&#10;R;500;300;2;true&#10;R;400;200;3;false"
        formatHint="Arquivo de projeto completo no formato linha por linha."
      />
      
      <div className="mt-4">
        <FileFormatDocumentation />
      </div>
      
      <ErrorMessage error={error} />
      <Button onClick={handleSubmit}>
        Importar Projeto
      </Button>
    </div>
  );
};
