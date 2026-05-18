// Modal wrapper for adding or editing a lead.
import { ReactElement } from "react";
import { LeadForm } from "./LeadForm";
import { Lead } from "../types";

interface ILeadModalProps {
  initialData?: Partial<Lead>;
  isLoading: boolean;
  mutationError: string;
  onCancel: () => void;
  onSubmit: (data: Partial<Lead>) => void;
}

export const LeadModal = ({
  initialData,
  isLoading,
  mutationError,
  onCancel,
  onSubmit,
}: ILeadModalProps): ReactElement => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <section className="auth-form-enter w-full max-w-lg rounded-[24px] bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl italic text-slate-700">
              {initialData ? "Edit Lead" : "Add Lead"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {initialData
                ? "Update lead details and pipeline stage."
                : "Capture a new lead for the sales team."}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Close
          </button>
        </div>
        {mutationError ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {mutationError}
          </div>
        ) : null}
        <LeadForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
};
