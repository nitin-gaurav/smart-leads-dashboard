// Styled confirmation dialog for deleting a lead.
import { ReactElement } from "react";
import { Lead } from "../types";

interface IDeleteLeadDialogProps {
  lead: Lead;
  isDeleting: boolean;
  mutationError: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteLeadDialog = ({
  lead,
  isDeleting,
  mutationError,
  onCancel,
  onConfirm,
}: IDeleteLeadDialogProps): ReactElement => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-lead-title"
        className="auth-form-enter w-full max-w-md rounded-[22px] bg-white p-6 shadow-2xl"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-500">
            Delete lead
          </p>
          <h2
            id="delete-lead-title"
            className="mt-2 text-xl font-semibold tracking-tight text-slate-900"
          >
            Remove {lead.name}?
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            This will permanently delete the lead from your pipeline.
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="truncate text-sm font-semibold text-slate-800">{lead.name}</p>
          <p className="mt-1 truncate text-sm text-slate-500">{lead.email}</p>
        </div>

        {mutationError ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {mutationError}
          </div>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </section>
    </div>
  );
};
