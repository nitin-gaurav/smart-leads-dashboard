import axios from "axios";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/axios";
import { Filters } from "../components/Filters";
import { LeadForm } from "../components/LeadForm";
import { LeadTable } from "../components/LeadTable";
import { Pagination } from "../components/Pagination";
import { useAuth } from "../context/AuthContext";
import { ApiError, Lead, LeadFilters, PaginatedLeads } from "../types";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data.message ?? fallback;
  }

  return fallback;
};

const buildParams = (filters: LeadFilters): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.source) {
    params.set("source", filters.source);
  }

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  if (filters.page) {
    params.set("page", String(filters.page));
  }

  return params;
};

export const Dashboard = () => {
  const [filters, setFilters] = useState<LeadFilters>({
    sort: "latest",
    page: 1,
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const { user, logout, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const leadsQuery = useQuery({
    queryKey: ["leads", user?.id, filters],
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await api.get<PaginatedLeads>("/api/leads", {
        params: Object.fromEntries(buildParams(filters)),
      });
      return response.data;
    },
  });

  const closeForm = (): void => {
    setShowForm(false);
    setSelectedLead(null);
    setMutationError("");
  };

  const refreshLeads = async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: ["leads"] });
  };

  const createLeadMutation = useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      const response = await api.post<Lead>("/api/leads", data);
      return response.data;
    },
    onSuccess: async () => {
      closeForm();
      await refreshLeads();
    },
    onError: (error) => {
      setMutationError(getErrorMessage(error, "Could not create lead"));
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      if (!selectedLead) {
        throw new Error("No lead selected");
      }

      const response = await api.put<Lead>(`/api/leads/${selectedLead._id}`, data);
      return response.data;
    },
    onSuccess: async () => {
      closeForm();
      await refreshLeads();
    },
    onError: (error) => {
      setMutationError(getErrorMessage(error, "Could not update lead"));
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/leads/${id}`);
    },
    onSuccess: refreshLeads,
  });

  const handleFiltersChange = (nextFilters: LeadFilters): void => {
    setFilters({ ...nextFilters, page: nextFilters.page ?? 1 });
  };

  const handleSubmitLead = (data: Partial<Lead>): void => {
    setMutationError("");

    if (selectedLead) {
      updateLeadMutation.mutate(data);
      return;
    }

    createLeadMutation.mutate(data);
  };

  const handleDeleteLead = (id: string): void => {
    if (window.confirm("Delete this lead?")) {
      deleteLeadMutation.mutate(id);
    }
  };

  const handleExportCSV = async (): Promise<void> => {
    try {
      const response = await api.get<Blob>("/api/leads/export", {
        params: Object.fromEntries(buildParams(filters)),
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "leads.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMutationError(getErrorMessage(error, "Could not export CSV"));
    }
  };

  const isSaving = createLeadMutation.isPending || updateLeadMutation.isPending;
  const data = leadsQuery.data;
  const qualifiedCount =
    data?.leads.filter((lead) => lead.status === "Qualified").length ?? 0;
  const activeCount =
    data?.leads.filter((lead) => lead.status !== "Lost").length ?? 0;

  return (
    <main className="h-screen flex flex-col overflow-hidden bg-[#737b75] px-4 py-3 text-slate-950">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-sm bg-[#f8faf8] shadow-[0_32px_90px_rgba(15,23,42,0.24)]">
      <header className="border-b border-[#d7e4dc] bg-white">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#acd0c0] shadow-sm ring-1 ring-[#8fb8a5]/40">
              <span className="h-4 w-4 rounded bg-emerald-400" />
            </div>
            <div>
              <h1 className="font-serif text-xl italic tracking-tight text-slate-700">
                Smart Leads
              </h1>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Sales workspace
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs capitalize text-slate-500">{user?.role}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 space-y-3 px-6 py-3">
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
              onClick={() => {
                setSelectedLead(null);
                setShowForm(true);
              }}
              className="rounded-full bg-[#666666] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#565656] hover:shadow-lg"
            >
              Add Lead
            </button>
            {isAdmin ? (
              <button
                type="button"
                onClick={handleExportCSV}
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
            <p className="mt-1 text-xl font-semibold text-slate-700">
              {data?.total ?? 0}
            </p>
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
            <p className="mt-1 text-xl font-semibold text-cyan-600">
              {activeCount}
            </p>
          </div>
        </section>

        <Filters filters={filters} onChange={handleFiltersChange} />

        {leadsQuery.isError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {getErrorMessage(leadsQuery.error, "Could not load leads")}
          </div>
        ) : null}

        {mutationError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {mutationError}
          </div>
        ) : null}

        {leadsQuery.isPending && !leadsQuery.data ? (
          <div className="flex items-center gap-2 rounded-[18px] border border-[#d7e4dc] bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
            Loading leads
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-6 pb-3">
        <div className="h-full overflow-y-auto">
        <LeadTable
          leads={data?.leads ?? []}
          isAdmin={isAdmin}
          onEdit={(lead) => {
            setSelectedLead(lead);
            setShowForm(true);
          }}
          onDelete={handleDeleteLead}
          isLoading={leadsQuery.isPending && !leadsQuery.data}
        />
        </div>
      </div>

      <div className="px-6 py-2">
        <div className="rounded-xl border border-[#d7e4dc] bg-white px-3 py-2 shadow-sm">
        <Pagination
          page={data?.page ?? filters.page ?? 1}
          totalPages={data?.totalPages ?? 0}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
        </div>
      </div>
      </div>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
          <section className="auth-form-enter w-full max-w-lg rounded-[24px] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl italic text-slate-700">
                  {selectedLead ? "Edit Lead" : "Add Lead"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedLead
                    ? "Update lead details and pipeline stage."
                    : "Capture a new lead for the sales team."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
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
              initialData={selectedLead ?? undefined}
              onSubmit={handleSubmitLead}
              onCancel={closeForm}
              isLoading={isSaving}
            />
          </section>
        </div>
      ) : null}
      </div>
    </main>
  );
};
