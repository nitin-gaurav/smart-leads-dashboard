// Authenticated lead dashboard page.
import { ReactElement } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardLeadSection } from "../components/DashboardLeadSection";
import { DashboardSummary } from "../components/DashboardSummary";
import { DeleteLeadDialog } from "../components/DeleteLeadDialog";
import { LeadModal } from "../components/LeadModal";
import { useAuth } from "../context/AuthContext";
import { useDashboardLeads } from "../hooks/useDashboardLeads";

export const Dashboard = (): ReactElement => {
  const { user, logout, isAdmin } = useAuth();
  const {
    activeCount,
    cancelDeleteLead,
    closeForm,
    confirmDeleteLead,
    data,
    filters,
    handleAddLead,
    handleDeleteLead,
    handleEditLead,
    handleExportCSV,
    handleFiltersChange,
    handlePageChange,
    handleSubmitLead,
    isDeleting,
    isInitialLoading,
    isSaving,
    leadsError,
    mutationError,
    pendingDeleteLead,
    qualifiedCount,
    selectedLead,
    showForm,
  } = useDashboardLeads();

  return (
    <main className="h-screen flex flex-col overflow-hidden bg-[#737b75] px-4 py-3 text-slate-950">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-sm bg-[#f8faf8] shadow-[0_32px_90px_rgba(15,23,42,0.24)]">
        <DashboardHeader user={user} onLogout={logout} />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 space-y-3 px-6 py-3">
            <DashboardSummary
              activeCount={activeCount}
              isAdmin={isAdmin}
              onAddLead={handleAddLead}
              onExportCSV={handleExportCSV}
              qualifiedCount={qualifiedCount}
              totalLeads={data?.total ?? 0}
            />
          </div>

          <DashboardLeadSection
            filters={filters}
            leads={data?.leads ?? []}
            isAdmin={isAdmin}
            isInitialLoading={isInitialLoading}
            leadsError={leadsError}
            mutationError={mutationError}
            onEdit={handleEditLead}
            onDelete={handleDeleteLead}
            onFiltersChange={handleFiltersChange}
            onPageChange={handlePageChange}
            page={data?.page ?? filters.page ?? 1}
            totalPages={data?.totalPages ?? 0}
          />
        </div>

        {showForm ? (
          <LeadModal
            initialData={selectedLead ?? undefined}
            isLoading={isSaving}
            mutationError={mutationError}
            onCancel={closeForm}
            onSubmit={handleSubmitLead}
          />
        ) : null}

        {pendingDeleteLead ? (
          <DeleteLeadDialog
            lead={pendingDeleteLead}
            isDeleting={isDeleting}
            mutationError={mutationError}
            onCancel={cancelDeleteLead}
            onConfirm={confirmDeleteLead}
          />
        ) : null}
      </div>
    </main>
  );
};
