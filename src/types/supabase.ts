
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      materials: {
        Row: {
          id: string
          user_id: string
          description: string
          thickness: number
          width: number
          height: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          description: string
          thickness: number
          width: number
          height: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          description?: string
          thickness?: number
          width?: number
          height?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          data: Json
          created_at: string
          updated_at: string
          is_public: boolean
          access_token: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          data: Json
          created_at?: string
          updated_at?: string
          is_public?: boolean
          access_token?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          data?: Json
          created_at?: string
          updated_at?: string
          is_public?: boolean
          access_token?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
          role: string
          is_email_verified: boolean
        }
        Insert: {
          id: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
          role?: string
          is_email_verified?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
          role?: string
          is_email_verified?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper to extract the Row type from a table
export type TableRow<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

// Helper to extract the Insert type from a table
export type TableInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];

// Helper to extract the Update type from a table
export type TableUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];
