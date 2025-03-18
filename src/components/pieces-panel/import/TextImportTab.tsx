import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Piece } from '../../../hooks/useSheetData';
import { ErrorMessage } from './ErrorMessage';
import { TextInput } from './TextInput';
import { processTextContent, readTextFile } from '../../../utils/textImportUtils';
import { FileFormatDocumentation } from './FileFormatDocumentation';
import { importProjectFromText, readProjectFile } from '../../../utils/projectExportUtils';
import { toast } from "sonner";

interface TextImportTabProps {
  onImportSuccess: (pieces: Piece[]) => void;
  onImportProject?: (projectData: any) => void;
}

export const TextImportTab = ({ onImportSuccess, onImportProject }: TextImportTabProps) => {
  const [textContent, setTextContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [textFile, setTextFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<'simple' | 'project'>('simple');

  const clearError = () => setError(null);

  const handleSubmit = () => {
    if (importMode === 'simple') {
      handleSimpleImport();
    } else {
      handleProjectImport();
    }
  };

  const handleSimpleImport = () => {
    try {
      if (!textContent.trim()) {
        setError('Nenhum texto inserido');
        return;
      }

      const { importedPieces, invalidLines } = processTextContent(textContent);
      
      if (importedPieces.length === 0) {
        setError('Nenhuma peça válida encontrada');
        return;
      }
      
      if (invalidLines.length > 0) {
        console.warn('Linhas inválidas:', invalidLines);
      }
      
      onImportSuccess(importedPieces);
      setTextContent('');
      setTextFile(null);
      setError(null);
    } catch (err) {
      setError(`Erro ao processar texto: ${err instanceof Error ? err.message : 'Formato inválido'}`);
    }
  };

  const handleProjectImport = () => {
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
      setTextFile(null);
      setError(null);
    } catch (err) {
      setError(`Erro ao processar projeto: ${err instanceof Error ? err.message : 'Formato inválido'}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setTextFile(file);
    setError(null);
    
    try {
      const text = await readTextFile(file);
      setTextContent(text);
    } catch (err) {
      setError(`${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={importMode} onValueChange={(v) => setImportMode(v as 'simple' | 'project')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple">Peças Simples</TabsTrigger>
          <TabsTrigger value="project">Projeto Completo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simple" className="py-4">
          <TextInput 
            textContent={textContent}
            setTextContent={setTextContent}
            onFileUpload={handleFileUpload}
            clearError={clearError}
            placeholder="100x200 (3)&#10;150x300&#10;400 600 5"
            formatHint={
              <>
                Formatos aceitos por linha:
                <br />• 100x200 (3) - largura x altura (quantidade)
                <br />• 100 200 3 - largura altura quantidade
              </>
            }
          />
        </TabsContent>
        
        <TabsContent value="project" className="py-4">
          <TextInput 
            textContent={textContent}
            setTextContent={setTextContent}
            onFileUpload={handleFileUpload}
            clearError={clearError}
            placeholder="#PROJECT_INFO&#10;NAME=Meu Projeto&#10;...&#10;&#10;#SHEET_DATA&#10;WIDTH=1220&#10;HEIGHT=2440&#10;..."
            formatHint="Arquivo de projeto completo no formato documentado."
          />
          
          {importMode === 'project' && (
            <div className="mt-4">
              <FileFormatDocumentation />
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <ErrorMessage error={error} />
      <Button onClick={handleSubmit}>
        {importMode === 'simple' ? 'Importar Peças' : 'Importar Projeto'}
      </Button>
    </div>
  );
};
