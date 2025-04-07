
// Preference creation functionality
import { ProductInfo, CustomerData } from './types';
import { convertToMPProductInfo } from './utils';

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

// Create a preference to use with Checkout Bricks or Standard Checkout
export const createCheckoutPreference = async (
  product: ProductInfo,
  customerData?: CustomerData
): Promise<{ preferenceId: string }> => {
  // In a real implementation, you would call your backend API
  // For this example, we are simulating a successful response
  console.log('Creating checkout preference for product:', product);
  
  if (customerData) {
    console.log('Customer data:', customerData);
  }
  
  // Ensure we're using the proper format expected by Mercado Pago API
  const standardizedProduct = convertToMPProductInfo(product);
  
  // Create preference data object in the format Mercado Pago expects
  const preferenceData = {
    items: [{
      id: standardizedProduct.id,
      title: standardizedProduct.title,
      description: standardizedProduct.description || '',
      unit_price: standardizedProduct.unit_price,
      quantity: standardizedProduct.quantity || 1,
      currency_id: standardizedProduct.currency_id || 'BRL'
    }],
    payer: customerData ? {
      name: customerData.name,
      email: customerData.email,
      identification: {
        type: customerData.identificationType,
        number: customerData.identificationNumber
      },
      first_name: customerData.firstName || customerData.name.split(' ')[0],
      last_name: customerData.lastName || customerData.name.split(' ').slice(1).join(' ')
    } : undefined,
    back_urls: {
      success: window.location.origin + "/payment-success",
      failure: window.location.origin + "/payment-failure",
      pending: window.location.origin + "/payment-pending"
    },
    auto_return: "approved",
    statement_descriptor: "Melhor Corte",
    external_reference: `ORDER_${Date.now()}`,
    expires: true,
    expiration_date_from: new Date().toISOString(),
    expiration_date_to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days
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
