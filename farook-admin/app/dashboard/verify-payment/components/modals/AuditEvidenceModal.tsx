import { XSquare, FileText, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "../../hooks/useVerifyPayment";

interface AuditEvidenceModalProps {
  isMilestoneDetailsOpen: boolean;
  setIsMilestoneDetailsOpen: (val: boolean) => void;
  selectedPaymentForDetails: any;
}

export function AuditEvidenceModal({
  isMilestoneDetailsOpen,
  setIsMilestoneDetailsOpen,
  selectedPaymentForDetails
}: AuditEvidenceModalProps) {
  if (!isMilestoneDetailsOpen || !selectedPaymentForDetails) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-lg w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#00B37E]" />
            Audit Evidence: {selectedPaymentForDetails.milestone?.tittle || selectedPaymentForDetails.milestone?.title}
          </h2>
          <button 
            onClick={() => setIsMilestoneDetailsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XSquare className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-black/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transaction Ledger */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Transaction Ledger</h3>
              <div className="bg-[#1f1f1f] rounded p-4 border border-white/5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Payment ID</span>
                  <span className="text-white font-mono">{selectedPaymentForDetails.id || selectedPaymentForDetails._id || selectedPaymentForDetails.paymentId}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Milestone Phase</span>
                  <span className="text-white font-medium">{selectedPaymentForDetails.milestone?.tittle || selectedPaymentForDetails.milestone?.title}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Claimed Amount</span>
                  <span className="text-[#00B37E] font-bold">
                    {formatCurrency(selectedPaymentForDetails.amountPaid || selectedPaymentForDetails.amount || 0, selectedPaymentForDetails.currency)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Declaration Date</span>
                  <span className="text-white">
                    {new Date(selectedPaymentForDetails.createdAt || selectedPaymentForDetails.updatedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payer Entity</span>
                  <span className="text-white">
                    {selectedPaymentForDetails.buyer?.fullName || selectedPaymentForDetails.buyer?.name || selectedPaymentForDetails.user?.fullName}
                  </span>
                </div>
              </div>
            </div>

            {/* Uploaded Receipt */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Digital Receipt</h3>
              <div className="bg-[#1f1f1f] rounded border border-white/5 overflow-hidden flex items-center justify-center min-h-[250px] relative">
                {selectedPaymentForDetails.receiptImage || selectedPaymentForDetails.receiptUrl || selectedPaymentForDetails.evidence ? (
                  <Image 
                    src={selectedPaymentForDetails.receiptImage || selectedPaymentForDetails.receiptUrl || selectedPaymentForDetails.evidence} 
                    alt="Payment Receipt" 
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No digital receipt attached to this ledger entry.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 shrink-0 flex justify-end">
          <button 
            onClick={() => setIsMilestoneDetailsOpen(false)}
            className="px-6 py-2 rounded bg-white/10 text-white font-medium hover:bg-white/20 transition-colors text-sm"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
