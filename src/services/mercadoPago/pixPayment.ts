
import { ProductInfo, CustomerData, PaymentStatus } from './types';

// Generate Pix payment (mock implementation)
export const generatePixPayment = async (product: ProductInfo, customer: CustomerData) => {
  console.log('Generating Pix payment:', { product, customer });
  
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock Pix response
      resolve({
        status: 'pending' as PaymentStatus,
        paymentId: `MOCK_PIX_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQMAAACXljzdAAAABlBMVEX///8AAABVwtN+AAABX0lEQVRYw+2YS47DMAxDfYFeoEfz0T2ajyYXqCXK+bWTTDB1UbctIOuxBEuUQtqypS3Df2REp6xtXzJPXi3N5DBx7rLQOa/lwZw1G8rWYyF/0qQtr4Y8mzMuW7/EceS9MR5EnUZz+3kwx01Dybs5VzZq++U6Z8Phuc6/Y1U4A9hsBPjL5mGPcNSsOf5suzgM35vj55hT+25OXDk+Rd9xPD00Z89L7eaIatuU7b05fgx0yGl7lhmDyw4j45KryFGzv2YWjDNuDJFrC+fNwRlUWYJjbxfOJuXQTBhnME6J2zPAMXNw2+LE4Dhv4UgsbMxpn6e5M47jdkF+86Jtbn4ezmCcYnW7jDzk6ONBC8eNx7k8cO5uE4fY0hyVE/Zws1rnPYcVnFhXD86bmXOqs2FNz67cGefGm26Mh1F2aK9aLhYfjtqWu3cLyiRmzOFamDN5tSTnVh2aWW3ptLFE5tSrNUdm+L/2AVJXvUVHpOd7AAAAAElFTkSuQmCC',
        qrCodeBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQMAAACXljzdAAAABlBMVEX///8AAABVwtN+AAABX0lEQVRYw+2YS47DMAxDfYFeoEfz0T2ajyYXqCXK+bWTTDB1UbctIOuxBEuUQtqypS3Df2REp6xtXzJPXi3N5DBx7rLQOa/lwZw1G8rWYyF/0qQtr4Y8mzMuW7/EceS9MR5EnUZz+3kwx01Dybs5VzZq++U6Z8Phuc6/Y1U4A9hsBPjL5mGPcNSsOf5suzgM35vj55hT+25OXDk+Rd9xPD00Z89L7eaIatuU7b05fgx0yGl7lhmDyw4j45KryFGzv2YWjDNuDJFrC+fNwRlUWYJjbxfOJuXQTBhnME6J2zPAMXNw2+LE4Dhv4UgsbMxpn6e5M47jdkF+86Jtbn4ezmCcYnW7jDzk6ONBC8eNx7k8cO5uE4fY0hyVE/Zws1rnPYcVnFhXD86bmXOqs2FNz67cGefGm26Mh1F2aK9aLhYfjtqWu3cLyiRmzOFamDN5tSTnVh2aWW3ptLFE5tSrNUdm+L/2AVJXvUVHpOd7AAAAAElFTkSuQmCC',
        qrCodeText: '00020126580014br.gov.bcb.pix0136.0ae94857-c1bd-4782-9682-45b579795e395204000053039865802BR5921Merchant Name Example6009SAO PAULO61080540900062070503***63044C2C',
        expirationDate: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
      });
    }, 1500);
  });
};
