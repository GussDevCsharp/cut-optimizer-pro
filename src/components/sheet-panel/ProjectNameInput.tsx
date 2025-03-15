
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useSheetData } from '../../hooks/useSheetData';

export const ProjectNameInput = () => {
  const { projectName, setProjectName, saveProject } = useSheetData();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2">
        <Label htmlFor="project-name">Nome do Projeto</Label>
        <div className="flex gap-2">
          <Input
            id="project-name"
            placeholder="Digite o nome do projeto"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={saveProject} size="icon" title="Salvar Projeto">
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Clique no botão salvar para guardar suas alterações no projeto.
      </div>
    </div>
  );
};
