
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { EmailSettingsForm } from './email/EmailSettingsForm';
import { EmailSettingsFormValues, defaultEmailSettings } from './email/emailSettingsSchema';

export function EmailSettings() {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [settings, setSettings] = useState<EmailSettingsFormValues>(defaultEmailSettings);
  
  useEffect(() => {
    // Load saved settings from localStorage if available
    const savedSettings = localStorage.getItem('emailSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing saved email settings:', error);
      }
    }
  }, []);

  const onSubmit = (data: EmailSettingsFormValues) => {
    // Save settings to localStorage
    localStorage.setItem('emailSettings', JSON.stringify(data));
    
    toast({
      title: "Configurações salvas",
      description: "As configurações de email foram salvas com sucesso."
    });
  };

  const handleTestEmail = async () => {
    const values = settings;
    setIsTesting(true);
    
    try {
      // In a real app, this would send a test email using the configured settings
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      toast({
        title: "Email de teste enviado",
        description: "O email de teste foi enviado com sucesso para " + values.fromEmail
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar email de teste",
        description: "Verifique suas configurações e tente novamente."
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações de Email</h3>
        <p className="text-sm text-muted-foreground">
          Configure as credenciais SMTP para envio de emails com os planos de corte.
        </p>
      </div>
      
      <EmailSettingsForm
        initialValues={settings}
        onSubmit={onSubmit}
        onTestEmail={handleTestEmail}
        isTesting={isTesting}
      />
    </div>
  );
}
