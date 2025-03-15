
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { emailSettingsSchema, EmailSettingsFormValues } from './emailSettingsSchema';

export const useEmailSettings = () => {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  
  // Initialize form with default values
  const form = useForm<EmailSettingsFormValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      emailService: "",
      smtpServer: "",
      smtpPort: "",
      username: "",
      password: "",
      fromEmail: "",
      fromName: "",
      useSSL: true,
    }
  });

  useEffect(() => {
    // Load saved settings from localStorage if available
    const savedSettings = localStorage.getItem('emailSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        form.reset(parsedSettings);
      } catch (error) {
        console.error('Error parsing saved email settings:', error);
      }
    }
  }, [form]);

  const onSubmit = (data: EmailSettingsFormValues) => {
    // Save settings to localStorage
    localStorage.setItem('emailSettings', JSON.stringify(data));
    
    toast({
      title: "Configurações salvas",
      description: "As configurações de email foram salvas com sucesso."
    });
  };

  const handleTestEmail = async () => {
    const values = form.getValues();
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

  return {
    form,
    isTesting,
    onSubmit,
    handleTestEmail
  };
};
