import { useState, useEffect } from "react";
import { registerUser } from "@/services/authService";
import { createSubscription } from "@/services/subscriptionService";
import RegistrationSuccess from "./RegistrationSuccess";
import CheckoutContainer from "./CheckoutContainer";
import { UserCredentials, UserRegistrationCheckoutProps } from "./types";

const UserRegistrationCheckout = ({
  isOpen,
  onOpenChange,
  planId,
  userCredentials,
  onPaymentComplete
}: UserRegistrationCheckoutProps) => {
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [registrationStatus, setRegistrationStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // When the dialog is opened, reset states
  useEffect(() => {
    if (isOpen) {
      setPaymentStatus("idle");
      setRegistrationStatus("idle");
      setErrorMessage(null);
      setPaymentId(null);
      setUserId(null);
    }
  }, [isOpen]);

  // Register the user
  const handleRegisterUser = async (credentials: UserCredentials) => {
    try {
      setRegistrationStatus("processing");
      
      // Register the user
      const { name, email, password } = credentials;
      const result = await registerUser(name, email, password);
      
      // Check if registration was successful
      if (result && result.user && result.user.id) {
        setUserId(result.user.id);
        setRegistrationStatus("completed");
        return result.user.id;
      } else {
        // Handle registration failure
        setRegistrationStatus("failed");
        setErrorMessage("Falha ao criar conta de usuário");
        return null;
      }
    } catch (error: any) {
      setRegistrationStatus("failed");
      
      // Extract error message
      const message = error && error.message 
        ? error.message 
        : "Erro ao registrar usuário";
        
      setErrorMessage(message);
      return null;
    }
  };

  // Handle payment completion
  const handlePaymentComplete = async (status: string, payment_id?: string) => {
    try {
      // If we don't have a userId, try to register the user first
      let userIdentifier = userId;
      if (!userIdentifier) {
        userIdentifier = await handleRegisterUser(userCredentials);
        if (!userIdentifier) {
          throw new Error("Falha ao criar conta de usuário");
        }
      }

      // Save payment ID if provided
      if (payment_id) {
        setPaymentId(payment_id);
      }

      // Update payment status based on the response
      if (status === "approved") {
        setPaymentStatus("completed");
        
        // Create subscription record in the database
        await createSubscription(userIdentifier, planId, payment_id || "");
        
        // Notify parent component
        if (onPaymentComplete) {
          onPaymentComplete(status, payment_id);
        }
      } else if (status === "rejected") {
        setPaymentStatus("failed");
        setErrorMessage("Pagamento rejeitado. Por favor, tente novamente.");
        
        // Notify parent component
        if (onPaymentComplete) {
          onPaymentComplete(status, payment_id);
        }
      } else {
        // Handle pending status
        setPaymentStatus("processing");
        
        // Notify parent component
        if (onPaymentComplete) {
          onPaymentComplete(status, payment_id);
        }
      }
    } catch (error: any) {
      setPaymentStatus("failed");
      setErrorMessage(error?.message || "Erro no processamento do pagamento");
      
      // Notify parent component with error
      if (onPaymentComplete) {
        onPaymentComplete("error");
      }
    }
  };

  // If registration has failed, show error
  if (registrationStatus === "failed") {
    return (
      <CheckoutContainer 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        title="Erro no registro"
      >
        <div className="p-6 text-center">
          <div className="mb-4 text-red-500 font-semibold">
            Ocorreu um erro ao registrar sua conta
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            {errorMessage || "Por favor, tente novamente mais tarde."}
          </div>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </button>
        </div>
      </CheckoutContainer>
    );
  }

  // If payment is completed, show success screen
  if (paymentStatus === "completed") {
    return (
      <CheckoutContainer
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        title="Pagamento concluído"
      >
        <RegistrationSuccess onClose={() => onOpenChange(false)} />
      </CheckoutContainer>
    );
  }

  // Otherwise, show the checkout form
  return (
    <CheckoutContainer 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      title="Complete sua compra"
    >
      <div className="p-6">
        {/* Registration status info */}
        {registrationStatus === "processing" && (
          <div className="mb-4 text-sm text-amber-600">
            Criando sua conta...
          </div>
        )}
        
        {/* Payment form */}
        <div className="space-y-6">
          {/* Here you would integrate your payment form */}
          <button 
            className="w-full px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => handlePaymentComplete("approved", "mock-payment-" + Date.now())}
            disabled={paymentStatus === "processing"}
          >
            {paymentStatus === "processing" ? "Processando..." : "Simular pagamento bem-sucedido"}
          </button>
          
          <button 
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={() => handlePaymentComplete("rejected")}
            disabled={paymentStatus === "processing"}
          >
            Simular pagamento rejeitado
          </button>
        </div>
        
        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 text-sm text-red-500">
            {errorMessage}
          </div>
        )}
      </div>
    </CheckoutContainer>
  );
};

export default UserRegistrationCheckout;
