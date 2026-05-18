// Shared backend types.
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

export interface ISafeUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
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

export interface IJwtPayload {
  id: string;
  role: UserRole;
}

export interface IAuthBody {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface ILeadBody {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

export interface ILeadQuery {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: "latest" | "oldest";
  page?: string;
  limit?: string;
}

export interface IPopulatedCreatedBy {
  name?: string;
  email?: string;
}

export interface IHttpError extends Error {
  status?: number;
  statusCode?: number;
}

export interface ICSVParser<T extends object> {
  parse(data: T[]): string;
}

export interface IJson2CSVModule {
  Parser: new <T extends object>(options: { fields: string[] }) => ICSVParser<T>;
}

export interface IAuthRequest extends Request {
  user?: IJwtPayload;
}

export type AuthRequest = IAuthRequest;
export type JwtPayload = IJwtPayload;
export type LeadQuery = ILeadQuery;
