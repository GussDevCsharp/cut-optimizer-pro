
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentStatus } from '../checkout/CheckoutModal';
import { useUserRegistration } from '@/hooks/useUserRegistration';
import { useLeadManagement, UserFormValues } from '@/hooks/useLeadManagement';
import { useUserForm } from '@/hooks/useUserForm';

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
    address: string;
    password: string;
  } | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useUserForm();
  const { saveLeadToDatabase, updateLeadStatus } = useLeadManagement();
  const { registerUserAfterPayment } = useUserRegistration();

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Save lead to database first
      const id = await saveLeadToDatabase(data);
      
      if (id) {
        setLeadId(id);
        
        // Only extract the needed fields for userCredentials
        setUserCredentials({
          name: data.name,
          email: data.email,
          address: data.address,
          password: data.password
        });
        
        setUserDialogOpen(false);
        setCheckoutOpen(true);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonClick = () => {
    if (!showCheckout) {
      navigate('/cadastro');
    } else {
      setUserDialogOpen(true);
    }
  };

  const handlePaymentComplete = async (status: PaymentStatus, paymentId?: string) => {
    console.log('Payment completed with status:', status, 'and ID:', paymentId);
    
    if (status === 'approved' && userCredentials && leadId) {
      try {
        // Update lead status to converted
        await updateLeadStatus(leadId, 'converted', paymentId);
        
        // Register the user after successful payment
        await registerUserAfterPayment(userCredentials, productId, paymentId);
      } catch (error: any) {
        console.error('Error in payment completion process:', error);
      }
    } else if (status === 'rejected' || status === 'error') {
      // Update lead status to canceled
      if (leadId) {
        await updateLeadStatus(leadId, 'canceled');
      }
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
    onSubmit,
    isSubmitting
  };
};

export default CTAButtonLogic;
