
import { Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function MaterialsCard() {
  const navigate = useNavigate();
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Layers size={20} />
          <span>Materiais</span>
        </CardTitle>
        <CardDescription>
          Cadastre e gerencie materiais para seus planos de corte
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">
          Cadastre chapas de MDF, MDP, compensados e outros materiais com suas dimensões e espessuras.
        </p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Registre os materiais disponíveis</li>
          <li>Defina espessuras e dimensões</li>
          <li>Organize seu estoque virtual</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => navigate('/materials')}>
          Gerenciar Materiais
        </Button>
      </CardFooter>
    </Card>
  );
}
