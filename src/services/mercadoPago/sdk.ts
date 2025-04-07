
// MercadoPago SDK initialization

// Use a testing public key for development
export const PUBLIC_KEY = 'TEST-2e3e0f19-990a-4323-b2b6-85c7e1684917';

let mp: any = null;

export const getMercadoPagoInstance = async () => {
  if (mp) {
    console.log("MercadoPago SDK already loaded");
    return mp;
  }

  try {
    // Load the SDK dynamically
    await loadMercadoPagoSDK();
    
    // Initialize the SDK with the public key
    mp = new window.MercadoPago(PUBLIC_KEY);
    console.log("MercadoPago SDK initialized");
    return mp;
  } catch (error) {
    console.error("Error initializing MercadoPago SDK:", error);
    return null;
  }
};

export const initMercadoPago = async () => {
  try {
    await loadMercadoPagoSDK();
    window.MercadoPago(PUBLIC_KEY);
    console.log("MercadoPago SDK loaded successfully");
    return true;
  } catch (error) {
    console.error("Error loading MercadoPago SDK:", error);
    return false;
  }
};

// Helper function to load the SDK script
const loadMercadoPagoSDK = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.MercadoPago) {
      console.log("MercadoPago SDK already loaded");
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => {
      console.log("MercadoPago SDK loaded successfully");
      resolve();
    };
    script.onerror = () => {
      reject(new Error("Failed to load MercadoPago SDK"));
    };
    document.body.appendChild(script);
  });
};

// Add MercadoPago to the window object for TypeScript
declare global {
  interface Window {
    MercadoPago: any;
  }
}
