// File: components/CRM/types.ts

export interface Comment {
  id: string;
  text: string;
  image?: string;
  username: string;
  avatar?: string;
}

export interface Task {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
  comments: Comment[];
} 

export interface User {
  id: number;
  organisation_id: number;
  name: string;
  email: string;
  phone: string;
  device_id: string | null;
  profile_pic: string | null;
  role: string;
  disabled: number;
  password: string | null;
  two_factor_secret: string | null;
  two_factor_recovery_codes: string | null;
  email_verified_at: string | null;
  otp: string | null;
  is_fixed_otp: number;
  otp_generated_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Lead {
  id: number;
  service_id: number | null;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  zipcode: string;
  page: string;
  status: 'NEW' | string;
  extra: any;
  organisation_id: number | null;
  assignee: number;
  created_at: string;
  updated_at: string;
  user: User;
  service: any;
  comments: Comment[];
}
