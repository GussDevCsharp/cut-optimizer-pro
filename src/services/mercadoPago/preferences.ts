
// Preference creation functionality
import { ProductInfo, CustomerData } from './types';

// Create payment preference (would be called from your backend)
// This is a mock function. In a real implementation, this would make a call to your backend
export const createPaymentPreference = async (
  product: ProductInfo, 
  paymentMethod: 'pix' | 'card' | 'boleto'
): Promise<{ preferenceId: string }> => {
  // In a real implementation, you would call your backend API that interacts with Mercado Pago's API
  // For this example, we're simulating a successful response
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve({
        preferenceId: `MOCK_PREFERENCE_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      });
    }, 1000);
  });
};

// Create a preference to use with Checkout Bricks
export const createCheckoutPreference = async (
  product: ProductInfo, // Using the proper ProductInfo type
  customerData?: CustomerData
): Promise<{ preferenceId: string }> => {
  // In a real implementation, you would call your backend API
  // For this example, we are simulating a successful response
  console.log('Creating checkout preference for product:', product);
  
  if (customerData) {
    console.log('Customer data:', customerData);
  }
  
  // Ensure we're using the right fields
  const preferenceData = {
    items: [{
      id: product.id,
      title: product.title || product.name || '',
      description: product.description || '',
      unit_price: product.unit_price || product.price || 0,
      quantity: product.quantity || 1,
      currency_id: product.currency_id || 'BRL'
    }],
    payer: customerData ? {
      name: customerData.name,
      email: customerData.email,
      identification: {
        type: customerData.identificationType,
        number: customerData.identificationNumber
      }
    } : undefined
  };
  
  console.log('Creating preference with data:', preferenceData);
  
  // In a real implementation, this would be a call to your API
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const preferenceId = `TEST-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      console.log(`Created mock preference ID: ${preferenceId}`);
      resolve({
        preferenceId
      });
    }, 1000);
  });
};
