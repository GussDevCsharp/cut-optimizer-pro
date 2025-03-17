
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { useState } from 'react';
import { createAndDownloadExampleFile, loadXLSXLibrary } from '../../../utils/excel';
import { ErrorMessage } from './ErrorMessage';

export const ExampleDownloader = () => {
  const [error, setError] = useState<string | null>(null);

  const downloadExampleFile = async () => {
    try {
      await loadXLSXLibrary();
      createAndDownloadExampleFile();
      setError(null);
    } catch (err) {
      setError(`Erro ao gerar exemplo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  return (
    <div>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2" 
        onClick={downloadExampleFile}
      >
        <Download className="h-4 w-4" />
        Baixar exemplo
      </Button>
      <ErrorMessage error={error} />
    </div>
  );
};
