"use client";

import { useAgentVerification } from "./hooks/useAgentVerification";
import { AgentVerificationStats } from "./components/AgentVerificationStats";
import { AgentVerificationTable } from "./components/AgentVerificationTable";
import { EditVerificationModal } from "./components/modals/EditVerificationModal";
import { ViewAgentModal } from "./components/modals/ViewAgentModal";

export default function AgentVerificationPage() {
  const {
    pendingLoading,
    allLoading,
    statsData,
    searchQuery,
    setSearchQuery,
    filterRega,
    setFilterRega,
    filterNafath,
    setFilterNafath,
    filteredAgents,
    processingId,
    handleVerify,
    openEditModal,
    viewingAgent,
    setViewingAgent,
    editingAgent,
    setEditingAgent,
    editForm,
    setEditForm,
    handleSaveEdit
  } = useAgentVerification();

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Agent Verification</h1>
          <p className="mt-1 text-sm text-gray-400">
            Review and manage agent REGA and Nafath verifications.
          </p>
        </div>
      </div>

      <AgentVerificationStats statsData={statsData} />

      <AgentVerificationTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterRega={filterRega}
        setFilterRega={setFilterRega}
        filterNafath={filterNafath}
        setFilterNafath={setFilterNafath}
        pendingLoading={pendingLoading}
        allLoading={allLoading}
        filteredAgents={filteredAgents}
        processingId={processingId}
        handleVerify={handleVerify}
        openEditModal={openEditModal}
        setViewingAgent={setViewingAgent}
      />

      <EditVerificationModal
        editingAgent={editingAgent}
        setEditingAgent={setEditingAgent}
        editForm={editForm}
        setEditForm={setEditForm}
        handleSaveEdit={handleSaveEdit}
      />

      <ViewAgentModal
        viewingAgent={viewingAgent}
        setViewingAgent={setViewingAgent}
      />
    </div>
  );
}
