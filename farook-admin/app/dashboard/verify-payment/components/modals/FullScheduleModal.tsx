import { XSquare, Building2, Info } from "lucide-react";
import { formatCurrency } from "../../hooks/useVerifyPayment";

interface FullScheduleModalProps {
  isPropertyDetailsOpen: boolean;
  setIsPropertyDetailsOpen: (val: boolean) => void;
  selectedPaymentForDetails: any;
}

export function FullScheduleModal({
  isPropertyDetailsOpen,
  setIsPropertyDetailsOpen,
  selectedPaymentForDetails
}: FullScheduleModalProps) {
  if (!isPropertyDetailsOpen || !selectedPaymentForDetails) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-lg w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#00B37E]" />
            Asset Settlement Schedule
          </h2>
          <button 
            onClick={() => setIsPropertyDetailsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XSquare className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-black/20">
          <div className="bg-[#1f1f1f] rounded p-4 border border-white/5 space-y-2">
            <h3 className="text-lg font-bold text-white mb-2 border-b border-white/5 pb-2">
              Plan: {selectedPaymentForDetails.milestone?.plan?.name || "Master Plan"}
            </h3>
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-gray-300">Target Asset: </span> 
              {selectedPaymentForDetails.milestone?.plan?.property?.title || "Property Reference"}
            </p>
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-gray-300">Contracting Party: </span> 
              {selectedPaymentForDetails.buyer?.fullName || selectedPaymentForDetails.buyer?.name || selectedPaymentForDetails.user?.fullName}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Milestone Sequence</h3>
            <div className="space-y-3">
              {selectedPaymentForDetails.milestone?.plan?.milestones && selectedPaymentForDetails.milestone.plan.milestones.length > 0 ? (
                selectedPaymentForDetails.milestone.plan.milestones.map((m: any, idx: number) => (
                  <div 
                    key={m.id || idx} 
                    className={`p-4 rounded border flex justify-between items-center transition-colors ${
                      m.id === selectedPaymentForDetails?.milestone?.id 
                        ? "bg-[#00B37E]/10 border-[#00B37E]/30" 
                        : "bg-[#1f1f1f] border-white/5"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <div className={`h-8 w-8 rounded flex items-center justify-center font-bold text-xs ${
                        m.id === selectedPaymentForDetails?.milestone?.id 
                          ? "bg-[#00B37E] text-white" 
                          : "bg-white/5 text-gray-400"
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${m.id === selectedPaymentForDetails?.milestone?.id ? "text-[#00B37E]" : "text-gray-300"}`}>
                          {m.tittle || m.title || "Phase Segment"}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">Priority Sequence: {m.milestoneOrder || "N/A"}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#00B37E]">{formatCurrency(m.amount || 0)}</p>
                      {m.id === selectedPaymentForDetails?.milestone?.id && (
                        <span className="bg-[#00B37E] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 inline-block">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                  <Info className="h-8 w-8 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">No linked milestones found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 shrink-0 flex justify-end">
          <button 
            onClick={() => setIsPropertyDetailsOpen(false)}
            className="px-6 py-2 rounded bg-white/10 text-white font-medium hover:bg-white/20 transition-colors text-sm"
          >
            Close Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
