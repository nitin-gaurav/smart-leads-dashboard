export type UserRole = "admin" | "sales";
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";
export type LeadSort = "latest" | "oldest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
}

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: LeadSort;
  page?: number;
}

export interface PaginatedLeads {
  leads: Lead[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
}
