
import React from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailSettings } from './EmailSettings';
import { MasterPanelManual } from './MasterPanelManual';
import { Mail, User, FileText } from 'lucide-react';

interface SettingsContainerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsContainer({ open, onOpenChange }: SettingsContainerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>
            Gerencie suas configurações de usuário e da aplicação.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Manual</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <EmailSettings />
          </TabsContent>
          
          <TabsContent value="profile">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Perfil</h3>
                <p className="text-sm text-muted-foreground">
                  Gerencie suas informações de perfil.
                </p>
              </div>
              <p className="text-muted-foreground">
                As configurações de perfil serão implementadas em breve.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="manual">
            <MasterPanelManual />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
