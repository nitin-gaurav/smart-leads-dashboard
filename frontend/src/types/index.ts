// Shared frontend types.
export type UserRole = "admin" | "sales";
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";
export type LeadSort = "latest" | "oldest";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface IAuthResponse {
  token: string;
  user: IUser;
}

export interface IApiUser extends Omit<IUser, "id"> {
  id?: string;
  _id?: string;
}

export interface IApiAuthResponse extends Omit<IAuthResponse, "user"> {
  user: IApiUser;
}

export interface ILead {
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

export interface ILeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: LeadSort;
  page?: number;
}

export interface IPaginatedLeads {
  leads: ILead[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IApiError {
  message: string;
}

export type User = IUser;
export type AuthResponse = IAuthResponse;
export type ApiAuthResponse = IApiAuthResponse;
export type Lead = ILead;
export type LeadFilters = ILeadFilters;
export type PaginatedLeads = IPaginatedLeads;
export type ApiError = IApiError;
