
export type SubscriptionPlanType = 'Básico' | 'Profissional' | 'Empresarial';

export interface SubscriptionPlan {
  id: string;
  name: SubscriptionPlanType;
  description: string;
  price: number;
  duration_days: number;
  features: string[];
  is_active: boolean;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'expired';
  start_date: string;
  expiration_date: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentHistory {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  payment_method: 'pix' | 'card' | 'boleto';
  payment_status: 'pending' | 'approved' | 'rejected' | 'error';
  payment_id: string;
  created_at: string;
}

// Update Database type to include our new tables
export type Database = {
  public: {
    Tables: {
      subscription_plans: {
        Row: SubscriptionPlan;
        Insert: Omit<SubscriptionPlan, 'id' | 'created_at'>;
        Update: Partial<Omit<SubscriptionPlan, 'id' | 'created_at'>>;
      };
      user_subscriptions: {
        Row: UserSubscription;
        Insert: Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>>;
      };
      payment_history: {
        Row: PaymentHistory;
        Insert: Omit<PaymentHistory, 'id' | 'created_at'>;
        Update: Partial<Omit<PaymentHistory, 'id' | 'created_at'>>;
      };
      // Add other existing tables here
    };
  };
};
