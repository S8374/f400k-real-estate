import { Eye, FileText, XSquare } from "lucide-react";
import { getDocumentId, getDocumentUrls, getStatus } from "../../hooks/useKycVerification";

interface VerificationPortfolioModalProps {
  selectedUserGroup: any;
  setSelectedUserGroup: (group: any) => void;
  processingDocumentIds: Record<string, boolean>;
  activeActionByDoc: Record<string, "APPROVE" | "REJECT" | null>;
  setActiveActionByDoc: React.Dispatch<React.SetStateAction<Record<string, "APPROVE" | "REJECT" | null>>>;
  rejectionReasonByDoc: Record<string, string>;
  setRejectionReasonByDoc: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleOpenFilePreview: (url: string, label?: string) => void;
  handleKycAction: (doc: any, isApproved: boolean) => void;
  verifyingKyc: boolean;
}

export function VerificationPortfolioModal({
  selectedUserGroup,
  setSelectedUserGroup,
  processingDocumentIds,
  activeActionByDoc,
  setActiveActionByDoc,
  rejectionReasonByDoc,
  setRejectionReasonByDoc,
  handleOpenFilePreview,
  handleKycAction,
  verifyingKyc
}: VerificationPortfolioModalProps) {
  if (!selectedUserGroup) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-lg w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            {selectedUserGroup?.user?.profileImage ? (
              <img src={selectedUserGroup.user.profileImage} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-[#1f1f1f] flex items-center justify-center">
                <span className="text-xs font-bold text-gray-500">{selectedUserGroup?.userName?.charAt(0) || "U"}</span>
              </div>
            )}
            Verification Portfolio: {selectedUserGroup?.userName}
          </h2>
          <button 
            onClick={() => setSelectedUserGroup(null)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XSquare className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-4">
          {(selectedUserGroup?.documents || []).map((doc: any) => {
            const docId = getDocumentId(doc);
            const status = getStatus(doc);
            const urls = getDocumentUrls(doc);
            const isVerified = status === "VERIFIED";
            const isRejected = status === "REJECTED";
            const isProcessing = docId ? Boolean(processingDocumentIds[String(docId)]) : false;

            return (
              <div key={docId} className={`rounded border p-5 transition-all ${
                isVerified ? 'bg-[#00B37E]/5 border-[#00B37E]/30' : 
                isRejected ? 'bg-red-500/5 border-red-500/30' : 
                'bg-[#1f1f1f] border-white/10'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#00B37E]" />
                      {doc?.documentType || "ID Document"}
                    </h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Ref: {docId?.slice(-10)}</p>
                  </div>
                  <span className={`px-3 py-1 font-bold text-xs rounded ${
                    isVerified ? 'bg-[#00B37E] text-white' : 
                    isRejected ? 'bg-red-600 text-white' : 
                    'bg-yellow-600 text-white'
                  }`}>
                    {status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div className="space-y-3">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Evidence Links</p>
                    <div className="flex flex-wrap gap-2">
                      {urls.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOpenFilePreview(url, `${doc?.documentType || 'Doc'} Part ${idx + 1}`)}
                          className="px-3 py-1.5 border border-white/10 hover:border-[#00B37E] rounded text-white text-[11px] font-bold flex items-center gap-2 transition-colors bg-white/5"
                        >
                          <Eye className="h-3 w-3" /> Proof {urls.length > 1 ? idx + 1 : ""}
                        </button>
                      ))}
                      {urls.length === 0 && <p className="text-xs text-gray-600 italic">No files attached</p>}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {doc?.rejectionReason && (
                      <>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Rejection Reason</p>
                        <p className="text-xs text-red-400 italic bg-red-500/10 p-2 rounded">{doc.rejectionReason}</p>
                      </>
                    )}
                    {doc?.notes && !doc?.rejectionReason && (
                      <>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Admin Notes</p>
                        <p className="text-xs text-gray-300 italic bg-white/5 p-2 rounded">{doc.notes}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10 w-full">
                  {activeActionByDoc[docId] === "REJECT" ? (
                    <div className="flex flex-col items-end gap-2 w-full">
                      <textarea
                        value={rejectionReasonByDoc[docId] || ""}
                        onChange={(e) => setRejectionReasonByDoc(prev => ({ ...prev, [docId]: e.target.value }))}
                        placeholder="Please provide a mandatory reason for rejection..."
                        className="w-full bg-[#1f1f1f] border border-red-500/50 focus:border-red-500 rounded p-3 text-sm text-white outline-none min-h-[80px] placeholder:text-gray-500 transition-colors"
                      />
                      <div className="flex gap-2">
                        <button
                          className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-1.5 rounded text-sm transition-colors disabled:opacity-50"
                          onClick={() => handleKycAction(doc, false)}
                          disabled={verifyingKyc || isProcessing || !rejectionReasonByDoc[docId]?.trim()}
                        >
                          {isProcessing ? "Saving..." : "Confirm Reject"}
                        </button>
                        <button
                          className="bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-bold px-4 py-1.5 rounded text-sm transition-colors"
                          onClick={() => setActiveActionByDoc(prev => ({ ...prev, [docId]: null }))}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {!isVerified && (
                        <button
                          className="bg-[#00B37E] hover:bg-[#00B37E]/80 text-white font-bold px-5 py-1.5 rounded text-sm transition-colors disabled:opacity-50"
                          onClick={() => handleKycAction(doc, true)}
                          disabled={verifyingKyc || isProcessing}
                        >
                          {isProcessing ? "Authorizing..." : isRejected ? "Re-Authorize" : "Authorize"}
                        </button>
                      )}
                      {!isRejected && (
                        <button
                          className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-1.5 rounded text-sm transition-colors disabled:opacity-50"
                          onClick={() => setActiveActionByDoc(prev => ({ ...prev, [docId]: "REJECT" }))}
                          disabled={verifyingKyc || isProcessing}
                        >
                          {isProcessing ? "Wait..." : isVerified ? "Decline" : "Decline"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 bg-[#1f1f1f] border-t border-white/10 flex justify-end shrink-0">
          <button 
            onClick={() => setSelectedUserGroup(null)} 
            className="text-gray-400 hover:text-white transition-colors px-4 py-2 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
