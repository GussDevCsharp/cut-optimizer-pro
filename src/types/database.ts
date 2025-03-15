
export interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Sheet {
  id: string;
  project_id: string;
  width: number;
  height: number;
  cut_width: number;
  created_at: string;
}

export interface Piece {
  id: string;
  project_id: string;
  width: number;
  height: number;
  quantity: number;
  can_rotate: boolean;
  color?: string;
  created_at: string;
}

export interface PlacedPiece {
  id: string;
  project_id: string;
  piece_id: string;
  sheet_index: number;
  x: number;
  y: number;
  rotated: boolean;
  created_at: string;
}

export interface EmailSettings {
  id: string;
  user_id: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
  sender_email: string;
  created_at: string;
  updated_at: string;
}
