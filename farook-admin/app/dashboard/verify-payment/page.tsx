'use client';

import { useVerifyPayment } from "./hooks/useVerifyPayment";
import { VerifyPaymentHeader } from "./components/VerifyPaymentHeader";
import { VerifyPaymentTable } from "./components/VerifyPaymentTable";

export default function VerifyPaymentPage() {
  const {
    activeTab,
    setActiveTab,
    notesByPayment,
    setNotesByPayment,
    rejectionReasonByPayment,
    setRejectionReasonByPayment,
    selectedPaymentForDetails,
    setSelectedPaymentForDetails,
    isMilestoneDetailsOpen,
    setIsMilestoneDetailsOpen,
    isPropertyDetailsOpen,
    setIsPropertyDetailsOpen,
    searchQuery,
    setSearchQuery,
    activeActionByPayment,
    setActiveActionByPayment,
    paymentsLoading,
    verifyingPayment,
    filteredPayments,
    handleVerify
  } = useVerifyPayment();

  return (
    <div className="p-6 mx-auto space-y-6">
      <VerifyPaymentHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        filteredPaymentsCount={filteredPayments.length} 
      />

      <VerifyPaymentTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        paymentsLoading={paymentsLoading}
        filteredPayments={filteredPayments}
        activeTab={activeTab}
        activeActionByPayment={activeActionByPayment}
        setActiveActionByPayment={setActiveActionByPayment}
        notesByPayment={notesByPayment}
        setNotesByPayment={setNotesByPayment}
        rejectionReasonByPayment={rejectionReasonByPayment}
        setRejectionReasonByPayment={setRejectionReasonByPayment}
        handleVerify={handleVerify}
        verifyingPayment={verifyingPayment}
        setSelectedPaymentForDetails={setSelectedPaymentForDetails}
        setIsMilestoneDetailsOpen={setIsMilestoneDetailsOpen}
        setIsPropertyDetailsOpen={setIsPropertyDetailsOpen}
      />
    </div>
  );
}
