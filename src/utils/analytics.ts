
// Simple analytics utility to track checkout events

export interface CheckoutEvent {
  step: 'view' | 'start' | 'payment_method_selected' | 'form_completed' | 'payment_processing' | 
        'payment_success' | 'payment_error' | 'payment_abandoned';
  paymentMethod?: 'pix' | 'card' | 'boleto';
  productId?: string;
  value?: number;
  timestamp: number;
}

// Storage key for checkout events
const CHECKOUT_EVENTS_STORAGE_KEY = 'checkout_events';

// Track a checkout event
export const trackCheckoutEvent = (event: Omit<CheckoutEvent, 'timestamp'>) => {
  try {
    // Add timestamp
    const eventWithTimestamp: CheckoutEvent = {
      ...event,
      timestamp: Date.now()
    };
    
    // Get existing events or initialize empty array
    const existingEvents = getStoredEvents();
    
    // Add new event
    existingEvents.push(eventWithTimestamp);
    
    // Store updated events
    localStorage.setItem(CHECKOUT_EVENTS_STORAGE_KEY, JSON.stringify(existingEvents));
    
    // If you have an actual analytics service, you would send the event here
    console.log('Checkout event tracked:', eventWithTimestamp);
    
    return true;
  } catch (error) {
    console.error('Failed to track checkout event:', error);
    return false;
  }
};

// Get stored checkout events
export const getStoredEvents = (): CheckoutEvent[] => {
  try {
    const storedEvents = localStorage.getItem(CHECKOUT_EVENTS_STORAGE_KEY);
    return storedEvents ? JSON.parse(storedEvents) : [];
  } catch (error) {
    console.error('Failed to get stored checkout events:', error);
    return [];
  }
};

// Clear stored checkout events
export const clearStoredEvents = (): boolean => {
  try {
    localStorage.removeItem(CHECKOUT_EVENTS_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear stored checkout events:', error);
    return false;
  }
};

// Calculate checkout abandonment rate
export const getAbandonmentRate = (): number => {
  const events = getStoredEvents();
  
  const starts = events.filter(e => e.step === 'start').length;
  const completions = events.filter(e => e.step === 'payment_success').length;
  
  if (starts === 0) return 0;
  
  return parseFloat(((starts - completions) / starts * 100).toFixed(2));
};

// Get conversion rate by payment method
export const getConversionRateByMethod = (): Record<string, number> => {
  const events = getStoredEvents();
  
  const methodSelections: Record<string, number> = {
    pix: 0,
    card: 0,
    boleto: 0
  };
  
  const methodCompletions: Record<string, number> = {
    pix: 0,
    card: 0,
    boleto: 0
  };
  
  events.forEach(event => {
    if (event.step === 'payment_method_selected' && event.paymentMethod) {
      methodSelections[event.paymentMethod] = (methodSelections[event.paymentMethod] || 0) + 1;
    }
    
    if (event.step === 'payment_success' && event.paymentMethod) {
      methodCompletions[event.paymentMethod] = (methodCompletions[event.paymentMethod] || 0) + 1;
    }
  });
  
  const result: Record<string, number> = {};
  
  Object.keys(methodSelections).forEach(method => {
    if (methodSelections[method] === 0) {
      result[method] = 0;
    } else {
      result[method] = parseFloat(
        ((methodCompletions[method] / methodSelections[method]) * 100).toFixed(2)
      );
    }
  });
  
  return result;
};
