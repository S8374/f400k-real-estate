"use client";

import { useDevelopers, initialFormState } from "./hooks/useDevelopers";
import { DevelopersHeader } from "./components/DevelopersHeader";
import { DevelopersStats } from "./components/DevelopersStats";
import { DevelopersList } from "./components/DevelopersList";
import { EditDeveloperModal } from "./components/modals/EditDeveloperModal";

export default function DevelopersPage() {
  const {
    form,
    setForm,
    logoPreview,
    handleLogoSelect,
    removeSelectedLogo,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    editForm,
    setEditForm,
    editLogoPreview,
    handleEditLogoSelect,
    removeEditLogo,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    isLoadingDevelopers,
    filteredDevelopers,
    stats,
    isSaving,
    isUpdating,
    handleSubmit,
    handleEditSubmit,
    handleDeleteDeveloper,
    openEditModal,
    closeEditModal,
  } = useDevelopers();

  return (
    <div className="p-6 mx-auto space-y-6 animate-in fade-in duration-700">
      <DevelopersHeader
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        form={form}
        setForm={setForm}
        logoPreview={logoPreview}
        handleLogoSelect={handleLogoSelect}
        removeSelectedLogo={removeSelectedLogo}
        handleSubmit={handleSubmit}
        isSaving={isSaving}
        initialFormState={initialFormState}
      />

      <DevelopersStats stats={stats} />

      <DevelopersList
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isLoadingDevelopers={isLoadingDevelopers}
        filteredDevelopers={filteredDevelopers}
        openEditModal={openEditModal}
        handleDeleteDeveloper={handleDeleteDeveloper}
      />

      <EditDeveloperModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editForm={editForm}
        setEditForm={setEditForm}
        editLogoPreview={editLogoPreview}
        handleEditLogoSelect={handleEditLogoSelect}
        removeEditLogo={removeEditLogo}
        handleEditSubmit={handleEditSubmit}
        isUpdating={isUpdating}
        closeEditModal={closeEditModal}
      />
    </div>
  );
}
