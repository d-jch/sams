// User types
export type UserRole = 'researcher' | 'technician' | 'lab_manager' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password_hash?: string;
  created_at: Date;
  updated_at: Date;
}

// Sequencing request types
export type SequencingType = 'WGS' | 'WES' | 'RNA-seq' | 'amplicon' | 'ChIP-seq';
export type RequestStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
export type PriorityLevel = 'low' | 'normal' | 'high' | 'urgent';

export interface SequencingRequest {
  id: string;
  user_id: string;
  project_name: string;
  sequencing_type: SequencingType;
  status: RequestStatus;
  priority: PriorityLevel;
  estimated_cost?: number;
  actual_cost?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// Sample types
export type SampleType = 'DNA' | 'RNA' | 'Protein' | 'Cell';
export type QCStatus = 'pending' | 'passed' | 'failed' | 'retest';

export interface Sample {
  id: string;
  request_id: string;
  name: string;
  type: SampleType;
  barcode?: string;
  concentration?: number;
  volume?: number;
  qc_status: QCStatus;
  storage_location?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface JWTPayload {
  user_id: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
}

// API Response types
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown[];
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}