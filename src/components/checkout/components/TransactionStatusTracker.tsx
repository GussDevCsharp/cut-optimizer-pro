
import React from 'react';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { usePayment } from '../context/PaymentContext';

export const TransactionStatusTracker: React.FC = () => {
  const { 
    transactionSteps, 
    currentStep, 
    transactionStatus 
  } = usePayment();

  // If no transaction is in progress, don't show anything
  if (!transactionSteps.length) {
    return null;
  }

  return (
    <div className="w-full bg-secondary/20 rounded-lg p-4 mb-4 animate-fade-in">
      <h3 className="text-sm font-medium mb-2">Status da transação</h3>
      
      <Progress 
        value={(currentStep / transactionSteps.length) * 100} 
        className="h-2 mb-4" 
      />
      
      <div className="space-y-3">
        {transactionSteps.map((step, index) => {
          // Determine step status
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isPending = index > currentStep;
          
          // Visual indicators based on status
          let StatusIcon = Clock;
          let statusColor = "text-muted-foreground";
          
          if (isActive) {
            StatusIcon = Loader2;
            statusColor = "text-primary";
          } else if (isCompleted) {
            StatusIcon = CheckCircle;
            statusColor = "text-success";
          }
          
          // If there's an error and this is the active step
          if (isActive && transactionStatus === 'error') {
            StatusIcon = AlertCircle;
            statusColor = "text-destructive";
          }
          
          return (
            <div 
              key={index} 
              className={`flex items-center gap-3 ${isActive ? 'animate-pulse' : ''}`}
            >
              <StatusIcon 
                className={`h-5 w-5 ${statusColor} ${isActive && transactionStatus !== 'error' ? 'animate-spin' : ''}`}
              />
              <span 
                className={`text-sm ${isActive ? 'font-medium' : isPending ? 'text-muted-foreground' : ''}`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionStatusTracker;
