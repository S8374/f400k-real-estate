'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Building2, CheckCircle2, Clock, FileText, Info, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetPaymentDetailsByAdminQuery, useVerifyMilestonePaymentByAdminMutation } from "@/redux/api/adminApi";
import { formatCurrency } from "../hooks/useVerifyPayment";

export default function VerifyPaymentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const paymentId = params?.id as string;

  const { data: userData } = useGetMeQuery({});
  const adminId = userData?.id || userData?.data?.id || userData?.data?.data?.id;

  const {
    data: paymentDetails,
    isLoading: isPaymentLoading,
    refetch,
  } = useGetPaymentDetailsByAdminQuery(
    { id: paymentId, adminId: adminId || "" },
    { skip: !adminId || !paymentId }
  );

  const [verifyPayment, { isLoading: verifyingPayment }] = useVerifyMilestonePaymentByAdminMutation();
  const [rejectionReason, setRejectionReason] = useState("");
  const [notes, setNotes] = useState("");
  const [activeAction, setActiveAction] = useState<"APPROVE" | "REJECT" | null>(null);

  const payment = paymentDetails || null;
  const plan = payment?.milestone?.plan;

  const handleVerify = async (approve: boolean) => {
    if (!adminId || !paymentId) return;
    
    if (!approve && !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      await verifyPayment({
        paymentId,
        adminId,
        approve,
        rejectionReason: !approve ? rejectionReason : undefined,
        notes: !approve ? `Rejected: ${rejectionReason}` : (notes.trim() || "Verified by admin"),
      }).unwrap();

      toast.success(`Payment ${approve ? 'verified' : 'rejected'} successfully`);
      setActiveAction(null);
      setRejectionReason("");
      setNotes("");
      refetch();
      
      if (approve) {
        setTimeout(() => router.push("/dashboard/verify-payment"), 1500);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to process verification");
    }
  };

  if (isPaymentLoading) {
    return (
      <div className="p-6 h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B37E]"></div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="p-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="bg-[#1a1a1a] p-10 rounded-lg text-center border border-white/10">
          <p className="text-gray-400">Payment details not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 mx-auto  space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Verifications
        </button>
        <div className="flex items-center gap-3">
          {payment.status === 'VERIFIED' ? (
            <span className="bg-[#00B37E]/20 text-[#00B37E] font-bold px-4 py-2 rounded border border-[#00B37E]/30 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Verified
            </span>
          ) : payment.status === 'REJECTED' ? (
            <span className="bg-red-500/20 text-red-500 font-bold px-4 py-2 rounded border border-red-500/30 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Rejected
            </span>
          ) : (
            <span className="bg-amber-500/20 text-amber-500 font-bold px-4 py-2 rounded border border-amber-500/30 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Pending Verification
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Schedule & Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-lg shadow-2xl p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-[#00B37E]" />
              Property Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Target Asset</p>
                <p className="font-medium text-white">{plan?.property?.title || "Property Reference"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Contracting Party</p>
                <p className="font-medium text-white">{payment.buyer?.fullName || payment.buyer?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Handling Agent</p>
                <p className="font-medium text-white">{payment.agent?.fullName || payment.agent?.name || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-white/10 rounded-lg shadow-2xl p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-[#00B37E]" />
              Asset Settlement Schedule
            </h2>
            <div className="space-y-3">
              {plan?.milestones && plan.milestones.length > 0 ? (
                [...plan.milestones]
                  .sort((a, b) => a.milestoneOrder - b.milestoneOrder)
                  .map((m: any, idx: number) => {
                    const isCurrent = m.id === payment.milestone?.id;
                    const isVerified = m.payments?.some((p: any) => p.status === 'VERIFIED');
                    const hasPendingPayment = m.payments?.some((p: any) => p.status === 'AGENT_REVIEWED' || p.status === 'PENDING');
                    
                    let statusLabel = "Upcoming";
                    let statusColor = "text-gray-500 bg-gray-500/10 border-gray-500/20";
                    let iconColor = "bg-white/5 text-gray-500";
                    let titleColor = "text-gray-400";
                    
                    if (isVerified) {
                      statusLabel = "Completed";
                      statusColor = "text-[#00B37E] bg-[#00B37E]/10 border-[#00B37E]/20";
                      iconColor = "bg-[#00B37E] text-white";
                      titleColor = "text-gray-200";
                    } else if (isCurrent || hasPendingPayment) {
                      statusLabel = isCurrent ? "Reviewing" : "Pending Review";
                      statusColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
                      iconColor = "bg-amber-500 text-white";
                      titleColor = "text-amber-500";
                    }

                    return (
                      <div 
                        key={m.id || idx} 
                        className={`p-3 rounded border flex flex-col gap-3 transition-colors ${
                          isCurrent 
                            ? "bg-amber-500/5 border-amber-500/30" 
                            : "bg-[#1f1f1f] border-white/5"
                        }`}
                      >
                        <div className="flex gap-3 items-center">
                          <div className={`h-6 w-6 shrink-0 rounded flex items-center justify-center font-bold text-[10px] ${iconColor}`}>
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold text-xs truncate ${titleColor}`}>
                              {m.tittle || m.title || "Phase Segment"}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate mt-0.5">
                              {m.description || `Milestone ${idx + 1}`}
                            </p>
                          </div>
                          <div className="text-right shrink-0 flex flex-col items-end gap-1">
                            <p className={`text-xs font-bold ${isVerified ? 'text-[#00B37E]' : 'text-gray-300'}`}>
                              {formatCurrency(m.amount || 0)}
                            </p>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${statusColor}`}>
                              {statusLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                  <p className="text-sm text-gray-400">No linked milestones.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Audit Evidence & Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-lg shadow-2xl p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <FileText className="h-5 w-5 text-[#00B37E]" />
              Audit Evidence: {payment.milestone?.tittle || payment.milestone?.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Transaction Ledger */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Transaction Ledger</h3>
                <div className="bg-[#1f1f1f] rounded p-4 border border-white/5 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Payment ID</span>
                    <span className="text-white font-mono text-xs">{payment.id?.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Claimed Amount</span>
                    <span className="text-[#00B37E] font-bold">
                      {formatCurrency(payment.amountPaid || payment.amount || 0, payment.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Declaration Date</span>
                    <span className="text-white">
                      {new Date(payment.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {(payment.notes || payment.agentDocumentNote) && (
                  <div className="bg-[#1f1f1f] rounded p-4 border border-white/5 space-y-2 mt-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Historical Notes</h3>
                    {payment.notes && <p className="text-sm text-gray-300 whitespace-pre-wrap">{payment.notes}</p>}
                    {payment.agentDocumentNote && <p className="text-sm text-gray-300 mt-2"><span className="text-blue-400 font-semibold text-xs">AGENT:</span> {payment.agentDocumentNote}</p>}
                  </div>
                )}
              </div>

              {/* Uploaded Receipt */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Digital Receipts</h3>
                
                {payment.proofUrls && payment.proofUrls.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Buyer Uploads</p>
                    <div className="bg-[#1f1f1f] rounded border border-white/5 overflow-hidden flex items-center justify-center min-h-[150px] relative">
                      <Image src={payment.proofUrls[0]} alt="Buyer Receipt" fill className="object-contain" />
                    </div>
                  </div>
                ) : payment.receiptImage || payment.receiptUrl || payment.evidence ? (
                   <div className="bg-[#1f1f1f] rounded border border-white/5 overflow-hidden flex items-center justify-center min-h-[200px] relative">
                      <Image src={payment.receiptImage || payment.receiptUrl || payment.evidence} alt="Buyer Receipt" fill className="object-contain" />
                   </div>
                ) : (
                  <div className="text-center p-4 text-gray-500 bg-[#1f1f1f] rounded border border-white/5">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="text-xs">No buyer receipt attached.</p>
                  </div>
                )}

                {payment.agentDocumentUrls && payment.agentDocumentUrls.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Agent Uploads</p>
                    <div className="bg-[#1f1f1f] rounded border border-white/5 overflow-hidden flex items-center justify-center min-h-[150px] relative">
                      <Image src={payment.agentDocumentUrls[0]} alt="Agent Receipt" fill className="object-contain" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {payment.status === 'AGENT_REVIEWED' && (
              <div className="mt-auto pt-6 border-t border-white/10">
                {!activeAction ? (
                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={() => setActiveAction("REJECT")}
                      className="px-6 py-2.5 font-bold rounded bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                    >
                      Reject Payment
                    </button>
                    <button
                      onClick={() => setActiveAction("APPROVE")}
                      className="px-6 py-2.5 font-bold rounded bg-[#00B37E]/10 text-[#00B37E] border border-[#00B37E]/20 hover:bg-[#00B37E] hover:text-white transition-all shadow-[0_0_15px_rgba(0,179,126,0.1)]"
                    >
                      Verify & Approve
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#1f1f1f] p-5 rounded-lg border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h4 className={`text-sm font-bold mb-3 ${activeAction === 'APPROVE' ? 'text-[#00B37E]' : 'text-red-500'}`}>
                      {activeAction === 'APPROVE' ? 'Confirm Verification' : 'Provide Rejection Reason'}
                    </h4>
                    
                    {activeAction === 'REJECT' && (
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Explain why this payment is being rejected..."
                        className="w-full bg-[#141414] border border-white/10 rounded p-3 text-sm text-white mb-4 min-h-[100px] focus:outline-none focus:border-red-500/50"
                      />
                    )}
                    
                    {activeAction === 'APPROVE' && (
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-3">
                          You are about to verify this payment of <strong className="text-white">{formatCurrency(payment.amountPaid || payment.amount || 0, payment.currency)}</strong>. This action cannot be undone.
                        </p>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Optional notes for this verification (e.g., 'Checked with bank statement')..."
                          className="w-full bg-[#141414] border border-white/10 rounded p-3 text-sm text-white min-h-[80px] focus:outline-none focus:border-[#00B37E]/50"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => { setActiveAction(null); setRejectionReason(""); }}
                        disabled={verifyingPayment}
                        className="px-4 py-2 text-sm font-medium rounded text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleVerify(activeAction === 'APPROVE')}
                        disabled={verifyingPayment || (activeAction === 'REJECT' && !rejectionReason.trim())}
                        className={`px-6 py-2 text-sm font-bold rounded text-white flex items-center gap-2 transition-all ${
                          activeAction === 'APPROVE' 
                            ? 'bg-[#00B37E] hover:bg-[#00B37E]/90 disabled:bg-[#00B37E]/50' 
                            : 'bg-red-500 hover:bg-red-500/90 disabled:bg-red-500/50'
                        }`}
                      >
                        {verifyingPayment ? (
                          <>
                            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Processing...
                          </>
                        ) : activeAction === 'APPROVE' ? 'Confirm Verification' : 'Confirm Rejection'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
