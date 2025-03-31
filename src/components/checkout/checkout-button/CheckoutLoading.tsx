
import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import TopLoadingBar from '@/components/ui/top-loading-bar';
import { Card, CardContent } from '@/components/ui/card';

interface CheckoutLoadingProps {
  message?: string;
  autoProgress?: boolean;
}

const CheckoutLoading: React.FC<CheckoutLoadingProps> = ({ 
  message,
  autoProgress = true
}) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message || "Inicializando o checkout...");

  const loadingMessages = [
    "Inicializando o checkout...",
    "Preparando formulários de pagamento...",
    "Conectando aos serviços de pagamento...",
    "Quase pronto...",
    "Finalizando configurações..."
  ];

  useEffect(() => {
    if (!autoProgress) return;

    let timer: ReturnType<typeof setTimeout>;
    let progressInterval: ReturnType<typeof setInterval>;

    // Start progress animation
    progressInterval = setInterval(() => {
      setProgress(prevProgress => {
        // Slow down as we approach 100%
        const increment = prevProgress < 50 ? 2 : prevProgress < 80 ? 1 : 0.5;
        const newProgress = Math.min(prevProgress + increment, 95);
        
        // Update message based on progress
        const messageIndex = Math.min(
          Math.floor(newProgress / 20),
          loadingMessages.length - 1
        );
        
        if (message) {
          // If custom message is provided, don't change it
          setCurrentMessage(message);
        } else {
          setCurrentMessage(loadingMessages[messageIndex]);
        }
        
        return newProgress;
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [autoProgress, message, loadingMessages]);

  return (
    <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
      <CardContent className="p-6">
        <TopLoadingBar isLoading={true} progress={progress} />
        
        <div className="flex flex-col items-center py-8">
          <div className="relative mb-6">
            <Loader className="h-8 w-8 text-primary animate-spin" />
            <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-primary animate-pulse"></div>
          </div>
          
          <h3 className="text-lg font-medium mb-4 text-center">
            {currentMessage}
          </h3>
          
          <div className="w-full max-w-md mb-2">
            <Progress value={progress} className="h-2" />
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Isso pode levar alguns segundos...
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutLoading;
