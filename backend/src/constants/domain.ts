// Shared backend domain constants.
import { LeadSource, LeadStatus, UserRole } from "../types";

export const LEAD_STATUSES: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];
export const LEAD_SOURCES: LeadSource[] = ["Website", "Instagram", "Referral"];
export const USER_ROLES: UserRole[] = ["admin", "sales"];
