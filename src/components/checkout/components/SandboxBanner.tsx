
import React from 'react';

interface SandboxBannerProps {
  isSandbox: boolean;
}

const SandboxBanner: React.FC<SandboxBannerProps> = ({ isSandbox }) => {
  if (!isSandbox) return null;
  
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 text-xs p-2 text-center">
      Ambiente de teste (sandbox) ativo. Pagamentos não serão reais.
    </div>
  );
};

export default SandboxBanner;
