
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { downloadExampleProjectFile } from "../../../utils/project";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { exportDocumentationToPdf } from "../../../utils/project/documentationExport";

export const FileFormatDocumentation: React.FC = () => {
  return (
    <div className="space-y-4">
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertTitle>Formato de Arquivo</AlertTitle>
        <AlertDescription>
          Formato para importação e exportação de projetos
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={exportDocumentationToPdf}
        >
          <FileText size={16} />
          Documentação PDF
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={downloadExampleProjectFile}
        >
          <Download size={16} />
          Baixar Exemplo
        </Button>
      </div>
    </div>
  );
};
