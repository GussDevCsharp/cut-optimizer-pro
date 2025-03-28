
import { useState } from 'react';

export function useTransactionState() {
  const [transactionSteps, setTransactionSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // Start a new transaction with defined steps
  const startTransaction = (steps: string[]) => {
    setTransactionSteps(steps);
    setCurrentStep(0);
    setTransactionStatus('processing');
  };

  // Update the current transaction step
  const updateTransactionStep = (step: number, status: 'idle' | 'processing' | 'success' | 'error' = 'processing') => {
    setCurrentStep(step);
    setTransactionStatus(status);
  };

  // Reset transaction tracking
  const resetTransaction = () => {
    setTransactionSteps([]);
    setCurrentStep(0);
    setTransactionStatus('idle');
  };

  return {
    transactionSteps,
    currentStep,
    transactionStatus,
    startTransaction,
    updateTransactionStep,
    resetTransaction
  };
}
