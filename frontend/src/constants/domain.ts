// Shared frontend domain constants.
import { LeadSource, LeadStatus, LeadSort } from "../types";

export const LEAD_STATUSES: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];
export const LEAD_SOURCES: LeadSource[] = ["Website", "Instagram", "Referral"];
export const LEAD_SORTS: { label: string; value: LeadSort }[] = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
];
