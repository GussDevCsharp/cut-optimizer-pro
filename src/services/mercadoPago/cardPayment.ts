
import { ProductInfo, PaymentStatus, CardData, CustomerData } from './types';
import { getMercadoPagoInstance } from './initialize';

// Process card payment
export const processCardPayment = async (
  product: ProductInfo,
  cardData: CardData,
  customer: CustomerData
): Promise<{ status: PaymentStatus; paymentId?: string }> => {
  try {
    // Obter a instância do Mercado Pago
    const mercadoPago = await getMercadoPagoInstance();
    
    // Em uma implementação real, você enviaria os dados para o seu backend,
    // que processaria o pagamento com o Mercado Pago
    // Para o modo sandbox, simulamos o processamento
    
    console.log('Processando pagamento com cartão:', { product, cardData, customer });
    
    // Simular resposta da API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular pagamento com base no nome do titular
        if (cardData.cardholderName === 'APRO') {
          // Pagamento aprovado
          resolve({
            status: 'approved',
            paymentId: `TEST_PAYMENT_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
          });
        } else if (cardData.cardholderName === 'OTHE') {
          // Erro de processamento
          resolve({
            status: 'error',
            paymentId: `TEST_PAYMENT_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
          });
        } else if (cardData.cardholderName === 'CONT') {
          // Pagamento pendente
          resolve({
            status: 'pending',
            paymentId: `TEST_PAYMENT_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
          });
        } else if (cardData.cardholderName === 'CALL') {
          // Pagamento recusado
          resolve({
            status: 'rejected',
            paymentId: `TEST_PAYMENT_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
          });
        } else {
          // Padrão - aprovar
          resolve({
            status: 'approved',
            paymentId: `TEST_PAYMENT_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
          });
        }
      }, 2000);
    });
  } catch (error) {
    console.error('Erro ao processar pagamento com cartão:', error);
    return {
      status: 'error'
    };
  }
};
