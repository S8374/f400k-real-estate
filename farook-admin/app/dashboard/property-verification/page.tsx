"use client";

import { usePropertyVerification } from "./hooks/usePropertyVerification";
import { PropertyVerificationHeader } from "./components/PropertyVerificationHeader";
import { PropertyVerificationStats } from "./components/PropertyVerificationStats";
import { PropertyVerificationTable } from "./components/PropertyVerificationTable";
import { PropertyDetailsModal } from "./components/modals/PropertyDetailsModal";

export default function PropertyVerificationPage() {
  const {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    propertyForm,
    setPropertyForm,
    viewingProperty,
    setViewingProperty,
    isProcessing,
    isLoading,
    detailsLoading,
    fullProperty,
    filteredProperties,
    stats,
    handlePropertyVerify,
    handleUnverify,
    handleDelete
  } = usePropertyVerification();

  return (
    <div className="space-y-6">
      <PropertyVerificationHeader />

      <PropertyVerificationStats stats={stats} />

      <PropertyVerificationTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        isLoading={isLoading}
        filteredProperties={filteredProperties}
        propertyForm={propertyForm}
        setPropertyForm={setPropertyForm}
        setViewingProperty={setViewingProperty}
        isProcessing={isProcessing}
        handlePropertyVerify={handlePropertyVerify}
        handleUnverify={handleUnverify}
        handleDelete={handleDelete}
      />

      <PropertyDetailsModal
        viewingProperty={viewingProperty}
        setViewingProperty={setViewingProperty}
        fullProperty={fullProperty}
        detailsLoading={detailsLoading}
      />
    </div>
  );
}
