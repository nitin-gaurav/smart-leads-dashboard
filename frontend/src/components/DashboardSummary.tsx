// Dashboard summary cards and actions.
import { ReactElement } from "react";

interface IDashboardSummaryProps {
  activeCount: number;
  isAdmin: boolean;
  onAddLead: () => void;
  onExportCSV: () => void;
  qualifiedCount: number;
  totalLeads: number;
}

export const DashboardSummary = ({
  activeCount,
  isAdmin,
  onAddLead,
  onExportCSV,
  qualifiedCount,
  totalLeads,
}: IDashboardSummaryProps): ReactElement => {
  return (
    <>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8aa79a]">
            Sales pipeline
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-800">
            Leads
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review, filter, and update opportunities from one place.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onAddLead}
            className="rounded-full bg-[#666666] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#565656] hover:shadow-lg"
          >
            Add Lead
          </button>
          {isAdmin ? (
            <button
              type="button"
              onClick={onExportCSV}
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
            >
              Export CSV
            </button>
          ) : null}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#d7e4dc] bg-white px-5 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Total Leads
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-700">{totalLeads}</p>
        </div>
        <div className="rounded-2xl border border-[#d7e4dc] bg-white px-5 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Qualified
          </p>
          <p className="mt-1 text-xl font-semibold text-emerald-600">
            {qualifiedCount}
          </p>
        </div>
        <div className="rounded-2xl border border-[#d7e4dc] bg-white px-5 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Active
          </p>
          <p className="mt-1 text-xl font-semibold text-cyan-600">{activeCount}</p>
        </div>
      </section>
    </>
  );
};
