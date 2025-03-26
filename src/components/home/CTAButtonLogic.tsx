
import { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router-dom';
import { PaymentStatus } from '../checkout/CheckoutModal';

// Schema for validating user registration data
const userSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

export type UserFormValues = z.infer<typeof userSchema>;

interface CTAButtonLogicProps {
  productId: string;
  showCheckout: boolean;
}

const CTAButtonLogic = ({ productId, showCheckout }: CTAButtonLogicProps) => {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [userCredentials, setUserCredentials] = useState<{
    name: string; 
    email: string; 
    password: string;
  } | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: UserFormValues) => {
    // Only extract the needed fields for userCredentials
    setUserCredentials({
      name: data.name,
      email: data.email,
      password: data.password
    });
    setUserDialogOpen(false);
    setCheckoutOpen(true);
  };

  const handleButtonClick = () => {
    if (!showCheckout) {
      navigate('/cadastro');
    } else {
      setUserDialogOpen(true);
    }
  };

  const handlePaymentComplete = (status: PaymentStatus, paymentId?: string) => {
    console.log('Payment completed with status:', status, 'and ID:', paymentId);
    
    if (status === 'approved') {
      // Redirect to dashboard after successful payment and registration
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    }
  };

  return {
    userDialogOpen,
    setUserDialogOpen,
    checkoutOpen,
    setCheckoutOpen,
    userCredentials,
    handleButtonClick,
    handlePaymentComplete,
    form,
    onSubmit
  };
};

export default CTAButtonLogic;
