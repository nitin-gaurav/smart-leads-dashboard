// Scrollable lead table.
import { ReactElement } from "react";
import { Lead, LeadStatus } from "../types";

interface ILeadTableProps {
  leads: Lead[];
  isAdmin: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const STATUS_CLASSES: Record<LeadStatus, string> = {
  New: "bg-cyan-50 text-cyan-700 ring-cyan-600/15",
  Contacted: "bg-amber-50 text-amber-700 ring-amber-600/15",
  Qualified: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Lost: "bg-rose-50 text-rose-700 ring-rose-600/15",
};

const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const LeadTable = ({
  leads,
  isAdmin,
  onEdit,
  onDelete,
  isLoading,
}: ILeadTableProps): ReactElement => {
  return (
    <div className="table-scroll-stable h-full overflow-x-auto overflow-y-auto rounded-[18px] border border-[#d7e4dc] bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="sticky top-0 z-10 bg-[#f3f8f5]">
          <tr>
            {["Name", "Email", "Status", "Source", "Created At", "Actions"].map(
              (heading) => (
                <th
                  key={heading}
                  scope="col"
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#6f9281] ${
                    heading === "Actions" ? "w-44 text-right" : "text-left"
                  }`}
                >
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {isLoading
            ? Array.from({ length: 5 }, (_, index) => (
                <tr key={index} className="animate-pulse">
                  {Array.from({ length: 6 }, (_, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-4">
                      <div className="h-4 rounded bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))
            : null}

          {!isLoading && leads.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center">
                <div className="mx-auto max-w-sm">
                  <p className="text-sm font-semibold text-slate-900">No leads found</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try clearing filters or add a new lead to start building the pipeline.
                  </p>
                </div>
              </td>
            </tr>
          ) : null}

          {!isLoading
            ? leads.map((lead) => (
                <tr key={lead._id} className="transition hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-2.5 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#eef7f2] text-xs font-semibold text-emerald-700">
                        {lead.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="font-semibold text-slate-950">{lead.name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-sm text-slate-600">
                    {lead.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-sm">
                    <span
                      className={`inline-flex w-20 justify-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STATUS_CLASSES[lead.status]}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-sm text-slate-600">
                    {lead.source}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-sm text-slate-600">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="w-44 whitespace-nowrap px-4 py-2.5 text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(lead)}
                        className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      {isAdmin ? (
                        <button
                          type="button"
                          onClick={() => onDelete(lead._id)}
                          className="rounded-full border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
};
