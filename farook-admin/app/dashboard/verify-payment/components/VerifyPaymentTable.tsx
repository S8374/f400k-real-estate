import { Search, Eye, FileText, CheckCircle2, Clock, AlertCircle, Home, Info, X } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "../hooks/useVerifyPayment";

interface VerifyPaymentTableProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  paymentsLoading: boolean;
  filteredPayments: any[];
  activeTab: string;
  activeActionByPayment: Record<string, "APPROVE" | "REJECT" | null>;
  setActiveActionByPayment: React.Dispatch<React.SetStateAction<Record<string, "APPROVE" | "REJECT" | null>>>;
  notesByPayment: Record<string, string>;
  setNotesByPayment: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  rejectionReasonByPayment: Record<string, string>;
  setRejectionReasonByPayment: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleVerify: (payment: any, approve: boolean) => void;
  verifyingPayment: boolean;
  setSelectedPaymentForDetails: (payment: any) => void;
  setIsMilestoneDetailsOpen: (val: boolean) => void;
  setIsPropertyDetailsOpen: (val: boolean) => void;
}

export function VerifyPaymentTable({
  searchQuery,
  setSearchQuery,
  paymentsLoading,
  filteredPayments,
  activeTab,
  activeActionByPayment,
  setActiveActionByPayment,
  notesByPayment,
  setNotesByPayment,
  rejectionReasonByPayment,
  setRejectionReasonByPayment,
  handleVerify,
  verifyingPayment,
  setSelectedPaymentForDetails,
  setIsMilestoneDetailsOpen,
  setIsPropertyDetailsOpen
}: VerifyPaymentTableProps) {
  return (
    <div className="bg-[#1A1A1A] rounded shadow-lg border border-white/5 overflow-hidden">
      {/* Table Toolbar */}
      <div className="border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <div className="w-full max-w-sm relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded border-0 bg-white/5 py-2 pl-10 pr-3 text-white placeholder:text-gray-400 focus:bg-white/10 outline-none text-sm"
            placeholder="Search property, buyer, or milestone..."
            type="text"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-white/5">
            <tr>
              <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-white">Property Context</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Buyer Entity</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Milestone Detail</th>
              <th scope="col" className="px-6 py-3.5 text-right text-sm font-semibold text-white">Settlement Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-transparent">
            {paymentsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="whitespace-nowrap py-6 pl-6 pr-3"><div className="h-10 w-48 bg-white/10 rounded"></div></td>
                  <td className="whitespace-nowrap px-3 py-6"><div className="h-10 w-32 bg-white/10 rounded"></div></td>
                  <td className="whitespace-nowrap px-3 py-6"><div className="h-10 w-32 bg-white/10 rounded"></div></td>
                  <td className="whitespace-nowrap px-6 py-6"><div className="h-10 w-24 bg-white/10 rounded ml-auto"></div></td>
                </tr>
              ))
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-[#00B37E]/40 mb-3" />
                  <p className="text-white text-lg font-medium">Queue is empty</p>
                  <p className="text-gray-400 text-sm">No payment requests match your current filters.</p>
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment: any) => {
                const paymentId = payment?.id || payment?._id || payment?.paymentId;
                const propertyTitle = payment?.milestone?.plan?.property?.title || "Property N/A";
                const buyerName = payment?.buyer?.fullName || payment?.buyer?.name || payment?.user?.fullName || "Buyer N/A";
                const milestoneName = payment?.milestone?.tittle || payment?.milestone?.title || "Milestone N/A";
                const amount = payment?.amountPaid || payment?.amount || 0;
                const currency = payment?.currency || "SAR";
                const activeAction = activeActionByPayment[paymentId];

                return (
                  <tr key={paymentId} className="hover:bg-white/5 transition-colors">
                    <td className="whitespace-nowrap py-5 pl-6 pr-3 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-[#1f1f1f] flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                          {(payment?.milestone?.plan?.property?.media?.find((m: any) => m.isPrimary)?.url || payment?.milestone?.plan?.property?.media?.[0]?.url) ? (
                            <img 
                              src={payment?.milestone?.plan?.property?.media?.find((m: any) => m.isPrimary)?.url || payment?.milestone?.plan?.property?.media?.[0]?.url} 
                              alt={propertyTitle} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <Home className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white truncate max-w-[200px]">{propertyTitle}</p>
                          <p className="text-[10px] text-gray-500 font-mono">ID: {payment?.milestone?.plan?.property?.id?.slice(-8)?.toUpperCase() || paymentId?.slice(-8)?.toUpperCase() || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm">
                      <div>
                        <p className="font-medium text-white">{buyerName}</p>
                        <p className="text-xs text-gray-500">{payment?.buyer?.email || "No email provided"}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{milestoneName}</span>
                          <span className="bg-[#00B37E]/20 text-[#00B37E] font-bold text-xs px-2 py-0.5 rounded">
                            {formatCurrency(amount, currency)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/dashboard/verify-payment/${paymentId}`}
                            className="text-xs text-[#00B37E] hover:text-[#00B37E]/80 flex items-center gap-1 font-semibold underline-offset-2 hover:underline"
                          >
                            <Eye className="h-3.5 w-3.5" /> View Verification Details
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-right">
                      <div className="flex flex-col items-end gap-2">
                        {activeTab === "VERIFIED" ? (
                          <span className="bg-[#00B37E]/20 text-[#00B37E] border border-[#00B37E]/20 font-bold px-3 py-1 rounded">
                            VERIFIED
                          </span>
                        ) : !activeAction ? (
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1.5 text-xs font-semibold rounded bg-[#00B37E]/10 text-[#00B37E] border border-[#00B37E]/20 hover:bg-[#00B37E] hover:text-white transition-colors"
                              onClick={() => setActiveActionByPayment(p => ({ ...p, [paymentId]: "APPROVE" }))}
                            >
                              Approve
                            </button>
                            <button
                              className="px-3 py-1.5 text-xs font-semibold rounded bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors"
                              onClick={() => setActiveActionByPayment(p => ({ ...p, [paymentId]: "REJECT" }))}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end gap-2">
                            <textarea
                              value={activeAction === "APPROVE" ? (notesByPayment[paymentId] || "") : (rejectionReasonByPayment[paymentId] || "")}
                              onChange={(e) => activeAction === "APPROVE"
                                ? setNotesByPayment(prev => ({ ...prev, [paymentId]: e.target.value }))
                                : setRejectionReasonByPayment(prev => ({ ...prev, [paymentId]: e.target.value }))
                              }
                              placeholder={activeAction === "APPROVE" ? "Internal approval note..." : "Mandatory rejection reason..."}
                              className={`w-64 h-16 bg-[#1f1f1f] border text-xs text-white rounded p-2 outline-none ${activeAction === "APPROVE" ? "border-[#00B37E]/50 focus:border-[#00B37E]" : "border-red-500/50 focus:border-red-500"}`}
                            />
                            <div className="flex gap-2">
                              <button
                                className={`px-3 py-1 text-xs font-semibold rounded text-white transition-colors ${activeAction === "APPROVE" ? "bg-[#00B37E] hover:bg-[#00B37E]/80" : "bg-red-500 hover:bg-red-500/80"} ${verifyingPayment ? "opacity-50" : ""}`}
                                onClick={() => handleVerify(payment, activeAction === "APPROVE")}
                                disabled={verifyingPayment}
                              >
                                {verifyingPayment ? "Processing..." : "Confirm"}
                              </button>
                              <button
                                className="px-3 py-1 text-xs font-semibold rounded bg-white/5 text-gray-400 hover:text-white transition-colors"
                                onClick={() => setActiveActionByPayment(p => ({ ...p, [paymentId]: null }))}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
