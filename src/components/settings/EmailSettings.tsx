
import React from 'react';
import { Form } from "@/components/ui/form";
import { ServerSettings } from './email/ServerSettings';
import { AuthSettings } from './email/AuthSettings';
import { SenderSettings } from './email/SenderSettings';
import { EmailFormActions } from './email/EmailFormActions';
import { useEmailSettings } from './email/useEmailSettings';

export function EmailSettings() {
  const { form, isTesting, onSubmit, handleTestEmail } = useEmailSettings();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações de Email</h3>
        <p className="text-sm text-muted-foreground">
          Configure as credenciais SMTP para envio de emails com os planos de corte.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ServerSettings form={form} />
          <AuthSettings form={form} />
          <SenderSettings form={form} />
          <EmailFormActions isTesting={isTesting} onTestEmail={handleTestEmail} />
        </form>
      </Form>
    </div>
  );
}
