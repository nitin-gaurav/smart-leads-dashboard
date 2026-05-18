// Lead create and edit form.
import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from "react";
import { LEAD_SOURCES, LEAD_STATUSES } from "../constants/domain";
import { MESSAGES } from "../constants/messages";
import { Lead, LeadSource, LeadStatus } from "../types";

interface ILeadFormProps {
  initialData?: Partial<Lead>;
  onSubmit: (data: Partial<Lead>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

interface ILeadFormState {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

type LeadFormErrors = Partial<Record<keyof ILeadFormState, string>>;

const INITIAL_STATE: ILeadFormState = {
  name: "",
  email: "",
  status: "New",
  source: "Website",
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const LeadForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: ILeadFormProps): ReactElement => {
  const [form, setForm] = useState<ILeadFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<LeadFormErrors>({});

  useEffect(() => {
    setForm({
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      status: initialData?.status ?? "New",
      source: initialData?.source ?? "Website",
    });
    setErrors({});
  }, [initialData]);

  const validate = (): boolean => {
    const nextErrors: LeadFormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = MESSAGES.NAME_REQUIRED;
    }

    if (!form.email.trim()) {
      nextErrors.email = MESSAGES.EMAIL_REQUIRED;
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = MESSAGES.INVALID_EMAIL;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      status: form.status,
      source: form.source,
    });
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, name: event.target.value });
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, email: event.target.value });
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setForm({ ...form, status: event.target.value as LeadStatus });
  };

  const handleSourceChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setForm({ ...form, source: event.target.value as LeadSource });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="lead-name">
          Name
        </label>
        <input
          id="lead-name"
          type="text"
          value={form.name}
          onChange={handleNameChange}
          className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
        {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name}</p> : null}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="lead-email">
          Email
        </label>
        <input
          id="lead-email"
          type="email"
          value={form.email}
          onChange={handleEmailChange}
          className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
        {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="lead-status">
            Status
          </label>
          <select
            id="lead-status"
            value={form.status}
            onChange={handleStatusChange}
            className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          >
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="lead-source">
            Source
          </label>
          <select
            id="lead-source"
            value={form.source}
            onChange={handleSourceChange}
            className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          >
            {LEAD_SOURCES.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Saving..." : "Save Lead"}
        </button>
      </div>
    </form>
  );
};
