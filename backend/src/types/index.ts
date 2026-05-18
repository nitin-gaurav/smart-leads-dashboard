import { Request } from "express";
import { Types } from "mongoose";

export type UserRole = "admin" | "sales";
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface ILead {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  createdBy: Types.ObjectId;
}

export interface JwtPayload {
  id: string;
  role: UserRole;
}

export interface LeadQuery {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: "latest" | "oldest";
  page?: string;
  limit?: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
