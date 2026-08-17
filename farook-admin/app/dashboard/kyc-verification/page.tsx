"use client";

import { useKycVerification } from "./hooks/useKycVerification";
import { KycVerificationHeader } from "./components/KycVerificationHeader";
import { KycVerificationStats } from "./components/KycVerificationStats";
import { KycVerificationTable } from "./components/KycVerificationTable";
import { VerificationPortfolioModal } from "./components/modals/VerificationPortfolioModal";
import { FilePreviewModal } from "./components/modals/FilePreviewModal";

export default function KycVerificationPage() {
  const {
    searchUser,
    setSearchUser,
    selectedUserGroup,
    setSelectedUserGroup,
    processingDocumentIds,
    isFilePreviewOpen,
    setIsFilePreviewOpen,
    previewFileUrl,
    previewFileLabel,
    activeActionByDoc,
    setActiveActionByDoc,
    rejectionReasonByDoc,
    setRejectionReasonByDoc,
    pendingKycLoading,
    verifyingKyc,
    groupedUsers,
    stats,
    handleKycAction,
    handleOpenFilePreview,
  } = useKycVerification();

  return (
    <div className="p-6 mx-auto space-y-6">
      <KycVerificationHeader />

      <KycVerificationStats stats={stats} />

      <KycVerificationTable
        searchUser={searchUser}
        setSearchUser={setSearchUser}
        groupedUsers={groupedUsers}
        pendingKycLoading={pendingKycLoading}
        setSelectedUserGroup={setSelectedUserGroup}
      />

      <VerificationPortfolioModal
        selectedUserGroup={selectedUserGroup}
        setSelectedUserGroup={setSelectedUserGroup}
        processingDocumentIds={processingDocumentIds}
        activeActionByDoc={activeActionByDoc}
        setActiveActionByDoc={setActiveActionByDoc}
        rejectionReasonByDoc={rejectionReasonByDoc}
        setRejectionReasonByDoc={setRejectionReasonByDoc}
        handleOpenFilePreview={handleOpenFilePreview}
        handleKycAction={handleKycAction}
        verifyingKyc={verifyingKyc}
      />

      <FilePreviewModal
        isFilePreviewOpen={isFilePreviewOpen}
        setIsFilePreviewOpen={setIsFilePreviewOpen}
        previewFileUrl={previewFileUrl}
        previewFileLabel={previewFileLabel}
      />
    </div>
  );
}
