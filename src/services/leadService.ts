
import { supabase } from "@/integrations/supabase/client";

interface LeadData {
  name: string;
  email: string;
  plan_id: string;
  plan_name: string;
  price: number;
  phone?: string;
  status?: 'new' | 'contacted' | 'converted' | 'lost';
}

/**
 * Register a new lead in the database
 */
export const registerLead = async (leadData: LeadData): Promise<void> => {
  try {
    // Set default status if not provided
    const data = {
      ...leadData,
      status: leadData.status || 'new',
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('leads')
      .insert([data]);
    
    if (error) {
      console.error("Error registering lead:", error);
      throw new Error(`Failed to register lead: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in registerLead:", error);
    throw error;
  }
};

/**
 * Update lead status
 */
export const updateLeadStatus = async (
  email: string, 
  status: 'new' | 'contacted' | 'converted' | 'lost'
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('leads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('email', email);
    
    if (error) {
      console.error("Error updating lead status:", error);
      throw new Error(`Failed to update lead status: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in updateLeadStatus:", error);
    throw error;
  }
};

/**
 * Get lead by email
 */
export const getLeadByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error("Error fetching lead:", error);
      throw new Error(`Failed to fetch lead: ${error.message}`);
    }
    
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error in getLeadByEmail:", error);
    throw error;
  }
};
