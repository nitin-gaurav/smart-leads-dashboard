// Dashboard lead filters, table, and pagination.
import { ReactElement } from "react";
import { Filters } from "./Filters";
import { LeadTable } from "./LeadTable";
import { Pagination } from "./Pagination";
import { Lead, LeadFilters } from "../types";

interface IDashboardLeadSectionProps {
  filters: LeadFilters;
  isAdmin: boolean;
  isInitialLoading: boolean;
  leads: Lead[];
  leadsError: string;
  mutationError: string;
  onDelete: (id: string) => void;
  onEdit: (lead: Lead) => void;
  onFiltersChange: (filters: LeadFilters) => void;
  onPageChange: (page: number) => void;
  page: number;
  totalPages: number;
}

export const DashboardLeadSection = ({
  filters,
  isAdmin,
  isInitialLoading,
  leads,
  leadsError,
  mutationError,
  onDelete,
  onEdit,
  onFiltersChange,
  onPageChange,
  page,
  totalPages,
}: IDashboardLeadSectionProps): ReactElement => {
  return (
    <>
      <div className="shrink-0 space-y-3 px-6 py-3">
        <Filters filters={filters} onChange={onFiltersChange} />

        {leadsError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {leadsError}
          </div>
        ) : null}

        {mutationError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {mutationError}
          </div>
        ) : null}

        {isInitialLoading ? (
          <div className="flex items-center gap-2 rounded-[18px] border border-[#d7e4dc] bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
            Loading leads
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-6 pb-3">
        <div className="h-full overflow-y-auto">
          <LeadTable
            leads={leads}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
            isLoading={isInitialLoading}
          />
        </div>
      </div>

      <div className="px-6 py-2">
        <div className="rounded-xl border border-[#d7e4dc] bg-white px-3 py-2 shadow-sm">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
};
