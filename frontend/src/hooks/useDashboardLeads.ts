// Dashboard lead data and UI state hook.
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/axios";
import { MESSAGES } from "../constants/messages";
import { Lead, LeadFilters, PaginatedLeads } from "../types";
import { getApiErrorMessage } from "../utils/auth";
import { useAuth } from "../context/AuthContext";
interface IUseDashboardLeadsResult {
  activeCount: number;
  closeForm: () => void;
  data?: PaginatedLeads;
  filters: LeadFilters;
  handleAddLead: () => void;
  handleDeleteLead: (id: string) => void;
  handleEditLead: (lead: Lead) => void;
  handleExportCSV: () => Promise<void>;
  handleFiltersChange: (nextFilters: LeadFilters) => void;
  handlePageChange: (page: number) => void;
  handleSubmitLead: (data: Partial<Lead>) => void;
  isInitialLoading: boolean;
  isSaving: boolean;
  leadsError: string;
  mutationError: string;
  qualifiedCount: number;
  selectedLead: Lead | null;
  showForm: boolean;
}

const buildParams = (filters: LeadFilters): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.search) params.set("search", filters.search);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", String(filters.page));
  return params;
};
export const useDashboardLeads = (): IUseDashboardLeadsResult => {
  const [filters, setFilters] = useState<LeadFilters>({ sort: "latest", page: 1 });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const leadsQuery = useQuery({
    queryKey: ["leads", user?.id, filters],
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const response = await api.get<PaginatedLeads>("/api/leads", {
          params: Object.fromEntries(buildParams(filters)),
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });

  const closeForm = (): void => {
    setShowForm(false);
    setSelectedLead(null);
    setMutationError("");
  };
  const refreshLeads = async (): Promise<void> => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["leads"] });
    } catch (error) {
      throw error;
    }
  };

  const createLeadMutation = useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      try {
        const response = await api.post<Lead>("/api/leads", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      closeForm();
      await refreshLeads();
    },
    onError: (error) => {
      setMutationError(getApiErrorMessage(error, MESSAGES.CREATE_LEAD_FAILED));
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      if (!selectedLead) throw new Error(MESSAGES.NO_LEAD_SELECTED);

      try {
        const response = await api.put<Lead>(`/api/leads/${selectedLead._id}`, data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      closeForm();
      await refreshLeads();
    },
    onError: (error) => {
      setMutationError(getApiErrorMessage(error, MESSAGES.UPDATE_LEAD_FAILED));
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await api.delete(`/api/leads/${id}`);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: refreshLeads,
  });

  const handleFiltersChange = (nextFilters: LeadFilters): void => {
    setFilters({ ...nextFilters, page: nextFilters.page ?? 1 });
  };

  const handleSubmitLead = (data: Partial<Lead>): void => {
    setMutationError("");
    selectedLead ? updateLeadMutation.mutate(data) : createLeadMutation.mutate(data);
  };

  const handleDeleteLead = (id: string): void => {
    if (window.confirm(MESSAGES.DELETE_LEAD_CONFIRM)) deleteLeadMutation.mutate(id);
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
      setMutationError(getApiErrorMessage(error, MESSAGES.EXPORT_FAILED));
    }
  };

  const handleAddLead = (): void => {
    setSelectedLead(null);
    setShowForm(true);
  };

  const handleEditLead = (lead: Lead): void => {
    setSelectedLead(lead);
    setShowForm(true);
  };

  const handlePageChange = (page: number): void => {
    setFilters({ ...filters, page });
  };

  const data = leadsQuery.data;

  return {
    activeCount: data?.leads.filter((lead) => lead.status !== "Lost").length ?? 0,
    closeForm,
    data,
    filters,
    handleAddLead,
    handleDeleteLead,
    handleEditLead,
    handleExportCSV,
    handleFiltersChange,
    handlePageChange,
    handleSubmitLead,
    isInitialLoading: leadsQuery.isPending && !data,
    isSaving: createLeadMutation.isPending || updateLeadMutation.isPending,
    leadsError: leadsQuery.isError
      ? getApiErrorMessage(leadsQuery.error, MESSAGES.LEADS_LOAD_FAILED)
      : "",
    mutationError,
    qualifiedCount: data?.leads.filter((lead) => lead.status === "Qualified").length ?? 0,
    selectedLead,
    showForm,
  };
};
