import React from 'react';
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  CircleAlert,
  Download,
  Eye,
  Shield,
  ShieldCheck,
  Lock,
  DollarSign,
  Layout,
  Calendar
} from 'lucide-react';

interface MilestoneCardProps {
  m: any;
  index: number;
  totalMilestones: number;
  role: 'BUYER' | 'AGENT' | 'ADMIN';
  isActive: boolean;
  isCompleted: boolean;
  isPending: boolean;
  isRejected: boolean;
  isUpcoming: boolean;
  handleViewNotes: (m: any) => void;
  handleMarkAsRead: (m: any) => void;
  handleMarkAsReceived: (m: any) => void;
  handleAdminVerify: (m: any) => void;
  handleDownloadDocument: (url: string) => void;
  onUploadClick: (m: any) => void;
}

export default function MilestoneCard({
  m,
  index,
  totalMilestones,
  role,
  isActive,
  isCompleted,
  isPending,
  isRejected,
  isUpcoming,
  handleViewNotes,
  handleMarkAsRead,
  handleMarkAsReceived,
  handleAdminVerify,
  handleDownloadDocument,
  onUploadClick
}: MilestoneCardProps) {
  return (
    <div className="relative group">
      {/* Timeline Icon */}
      <div className="absolute -left-13 top-1 z-10 transition-transform duration-300 group-hover:scale-105">
        {isCompleted ? (
          <div className="w-9 h-9 bg-emerald-500/15 rounded-full border border-emerald-500/40 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
        ) : isActive || isPending ? (
          <div className="w-9 h-9 bg-amber-500/15 rounded-full border border-amber-500/40 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
        ) : (
          <div className="w-9 h-9 bg-[#262626] rounded-full border border-white/10 flex items-center justify-center">
            <Lock className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </div>

      {/* Milestone Card */}
      <div className={`ml-2 p-4 sm:p-5 rounded border transition-all duration-500 ${isActive ? 'bg-[#1D2025] border-[#D0A700]' :
          isCompleted || isPending ? 'bg-[#1D2025] border-white/10' :
            'bg-[#1D2025]/60 border-white/10 opacity-70'
        }`}>

        {/* Header Row */}
        <div className="flex items-start justify-between mb-3 gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white mb-0.5 leading-snug">
              {m.tittle} <span className="text-gray-500 text-[10px] sm:text-xs font-normal ml-1.5">Step {index + 1} of {totalMilestones}</span>
            </h3>
            {isActive && <p className="text-gray-400 text-xs sm:text-[13px] leading-relaxed mt-1">{m.description || 'Proceed with this milestone payment'}</p>}
          </div>
          {isCompleted && <span className="text-[10px] bg-emerald-950/40 text-emerald-500 px-3 py-1 rounded-full font-bold border border-emerald-900/50 uppercase tracking-tighter">Completed</span>}
          {isPending && (
            <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-900/40 px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] text-amber-500 font-bold">
                {m.paymentStatus === 'AGENT_REVIEWED'
                  ? (role === 'ADMIN' ? 'Pending Your Review' : 'Pending Admin Review')
                  : (role === 'AGENT' ? 'Pending Your Review' : 'Pending Agent Review')}
              </span>
            </div>
          )}
          {isRejected && (
            <div className="flex items-center gap-2 bg-red-950/30 border border-red-900/40 px-3 py-1.5 rounded-full">
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[10px] text-red-400 font-bold">Rejected - Re-upload Required</span>
            </div>
          )}
          {(() => {
            const isOverdue = (!isCompleted && !isPending && !isRejected) && m.dueDate && new Date(m.dueDate) < new Date();
            if (isOverdue) {
              return (
                <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/30 px-3 py-1 rounded-full animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-[10px] text-red-500 font-black uppercase tracking-widest">Overdue</span>
                </div>
              );
            }
            if (isUpcoming) {
              return <span className="text-[10px] bg-gray-900/60 text-gray-600 px-3 py-1 rounded-full font-bold border border-gray-800/80 uppercase tracking-tighter">Upcoming</span>;
            }
            return null;
          })()}
        </div>

        {/* Details Section */}
        <div className="space-y-3 mb-5">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-[13px]">
            <div className="text-gray-400 flex items-center gap-2 font-medium">
              <span className="text-gray-600">•</span> 10% • SAR {m.amount?.toLocaleString()}
            </div>
            <div className="text-gray-400 font-medium">
              <span className="text-gray-600">•</span> Construction: {m.constructionProgress}% Required
            </div>
          </div>

          {isActive ? (
            <div className="flex flex-wrap gap-x-8 gap-y-3 py-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#EAB308] shrink-0" />
                  <span className="text-[13px] text-gray-400">Amount:</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-xl font-bold text-white tracking-tight">SAR {m.amount?.toLocaleString()}</span>
                  <span className="text-[11px] text-gray-600 font-bold shrink-0">(10%)</span>
                </div>
              </div>
              <div className="flex flex-wrap items-baseline gap-2 sm:border-l border-gray-800 sm:pl-8">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-[13px] text-gray-400">Construction Stage:</span>
                </div>
                <span className="text-base sm:text-xl font-bold text-white tracking-tight">{m.constructionProgress}%</span>
              </div>
            </div>
          ) : (m.paidAt || m.dueDate) && (
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <Calendar className="w-4 h-4 opacity-70" />
              <span>
                {isCompleted ? 'Paid on: ' : 'Due Date: '} 
                <strong className="text-gray-300">
                  {new Date(isCompleted ? m.paidAt : m.dueDate).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Admin Verification Box (Completed Only) */}
        {isCompleted && (
          <div className="bg-emerald-950/10 border border-emerald-900/20 rounded p-4 mb-6 transition-colors hover:bg-emerald-950/20">
            <div className="flex items-center gap-3 text-emerald-600 text-[13px] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified by: {m.adminName ? `Admin - ${m.adminName}` : 'Admin'}</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1 ml-7">
              {m.paidAt ? new Date(m.paidAt).toLocaleString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
              }) : ''}
            </p>
            {m.adminNote && (
              <div className="mt-3 pt-3 border-t border-emerald-900/20 ml-7">
                <p className="text-[12px] text-emerald-600/90 font-medium whitespace-pre-wrap"><span className="font-bold">Admin Note:</span> {m.adminNote}</p>
              </div>
            )}
          </div>
        )}

        {/* Shared Documents Header */}
        {((m.proofUrls?.length || 0) > 0 || (m.agentDocumentUrls?.length || 0) > 0 || m.proofUrl || m.agentDocumentUrl) && (
           <div className="mb-4">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Documentation</p>
               <div className="space-y-3">
                 {/* Buyer Documents Summary */}
                 {((m.proofUrls?.length || 0) > 0 || m.proofUrl) && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white/3 border border-gray-800/80 rounded hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => handleViewNotes(m)}>
                       <div className="flex gap-3 min-w-0">
                          <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                             <FileText className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                             <span className="text-[13px] text-gray-300 font-bold group-hover:text-[#EAB308] transition-colors truncate">Buyer Payment Proofs</span>
                             <span className="text-[10px] text-gray-500 font-medium tracking-tight truncate">{(m.proofUrls?.length || (m.proofUrl ? 1 : 0))} Document(s) • Click to view details</span>
                             <div className="flex flex-wrap items-center gap-2 mt-2 sm:hidden">
                                 {role === 'BUYER' && m.isReadByAgent && (
                                    <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold bg-blue-400/5 px-2 py-0.5 rounded-full border border-blue-400/20 whitespace-nowrap shrink-0">
                                       Agent Read
                                    </span>
                                 )}
                                 {role === 'BUYER' && !m.isReadByAgent && (
                                    <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold bg-gray-500/10 px-2 py-0.5 rounded-full border border-gray-500/20 whitespace-nowrap shrink-0">
                                       Agent Unread
                                    </span>
                                 )}
                                 {m.isReadByAdmin && (
                                    <span className="flex items-center gap-1 text-[10px] text-purple-400 font-bold bg-purple-400/5 px-2 py-0.5 rounded-full border border-purple-400/20 whitespace-nowrap shrink-0">
                                       Admin Read
                                    </span>
                                 )}
                                 {role === 'AGENT' && !m.isReadByAgent && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleMarkAsRead(m); }} 
                                      className="text-[11px] text-amber-500 font-bold hover:underline whitespace-nowrap shrink-0"
                                    >
                                      Mark as Read
                                    </button>
                                 )}
                                 {role === 'AGENT' && m.isReadByAgent && (
                                    <span className="flex items-center gap-1 text-[10px] text-emerald-500/80 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap shrink-0">
                                       <CheckCircle2 className="w-3 h-3" /> Read
                                    </span>
                                 )}
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-1 sm:mt-0">
                          <div className="hidden sm:flex flex-wrap items-center gap-2">
                             {role === 'BUYER' && m.isReadByAgent && (
                                <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold bg-blue-400/5 px-2 py-0.5 rounded-full border border-blue-400/20 whitespace-nowrap shrink-0">
                                   Agent Read
                                </span>
                             )}
                             {role === 'BUYER' && !m.isReadByAgent && (
                                <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold bg-gray-500/10 px-2 py-0.5 rounded-full border border-gray-500/20 whitespace-nowrap shrink-0">
                                   Agent Unread
                                </span>
                             )}
                             {m.isReadByAdmin && (
                                <span className="flex items-center gap-1 text-[10px] text-purple-400 font-bold bg-purple-400/5 px-2 py-0.5 rounded-full border border-purple-400/20 whitespace-nowrap shrink-0">
                                   Admin Read
                                </span>
                             )}
                             {role === 'AGENT' && !m.isReadByAgent && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleMarkAsRead(m); }} 
                                  className="text-[11px] text-amber-500 font-bold hover:underline whitespace-nowrap shrink-0"
                                >
                                  Mark as Read
                                </button>
                             )}
                             {role === 'AGENT' && m.isReadByAgent && (
                                <span className="flex items-center gap-1 text-[10px] text-emerald-500/80 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap shrink-0">
                                   <CheckCircle2 className="w-3 h-3" /> Read
                                </span>
                             )}
                          </div>
                          <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 group-hover:text-[#EAB308] group-hover:bg-[#EAB308]/10 transition-all shrink-0 ml-auto sm:ml-0">
                             <Eye className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 )}

                 {/* Agent Documents Summary */}
                 {((m.agentDocumentUrls?.length || 0) > 0 || m.agentDocumentUrl) && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white/3 border border-gray-800/80 rounded hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => handleViewNotes(m)}>
                       <div className="flex gap-3 min-w-0">
                          <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                             <Shield className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                             <span className="text-[13px] text-gray-300 font-bold group-hover:text-emerald-500 transition-colors truncate">Agent Confirmation Proofs</span>
                             <span className="text-[10px] text-gray-500 font-medium tracking-tight truncate">{(m.agentDocumentUrls?.length || (m.agentDocumentUrl ? 1 : 0))} Document(s) • Click to view details</span>
                             <div className="flex flex-wrap items-center gap-2 mt-2 sm:hidden">
                                 {role === 'AGENT' && m.isReadByBuyer && (
                                    <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold bg-blue-400/5 px-2 py-0.5 rounded-full border border-blue-400/20 whitespace-nowrap shrink-0">
                                       Buyer Read
                                    </span>
                                 )}
                                 {role === 'AGENT' && !m.isReadByBuyer && (
                                    <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold bg-gray-500/10 px-2 py-0.5 rounded-full border border-gray-500/20 whitespace-nowrap shrink-0">
                                       Buyer Unread
                                    </span>
                                 )}
                                 {role === 'BUYER' && !m.isReadByBuyer && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleMarkAsRead(m); }} 
                                      className="text-[11px] text-[#EAB308] font-bold hover:underline whitespace-nowrap shrink-0"
                                    >
                                      Mark as Read
                                    </button>
                                 )}
                                 {role === 'BUYER' && m.isReadByBuyer && (
                                    <span className="flex items-center gap-1 text-[10px] text-emerald-500/80 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap shrink-0">
                                       <CheckCircle2 className="w-3 h-3" /> Read
                                    </span>
                                 )}
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-1 sm:mt-0">
                          <div className="hidden sm:flex flex-wrap items-center gap-2">
                             {role === 'AGENT' && m.isReadByBuyer && (
                                <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold bg-blue-400/5 px-2 py-0.5 rounded-full border border-blue-400/20 whitespace-nowrap shrink-0">
                                   Buyer Read
                                </span>
                             )}
                             {role === 'AGENT' && !m.isReadByBuyer && (
                                <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold bg-gray-500/10 px-2 py-0.5 rounded-full border border-gray-500/20 whitespace-nowrap shrink-0">
                                   Buyer Unread
                                </span>
                             )}
                             {role === 'BUYER' && !m.isReadByBuyer && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleMarkAsRead(m); }} 
                                  className="text-[11px] text-[#EAB308] font-bold hover:underline whitespace-nowrap shrink-0"
                                >
                                  Mark as Read
                                </button>
                             )}
                             {role === 'BUYER' && m.isReadByBuyer && (
                                <span className="flex items-center gap-1 text-[10px] text-emerald-500/80 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap shrink-0">
                                   <CheckCircle2 className="w-3 h-3" /> Read
                                </span>
                             )}
                          </div>
                          <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all shrink-0 ml-auto sm:ml-0">
                             <Eye className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* Primary Action Row */}
        <div className="flex flex-wrap items-center gap-3 mt-5">
          {isActive && role === 'BUYER' && (!m.proofUrl || isRejected) && (
            m.dueDate && new Date(m.dueDate) > new Date() ? (
              <div className="text-gray-400 text-sm flex items-center gap-2 bg-gray-900/40 px-4 py-2.5 rounded border border-gray-800">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-gray-300">Payment window opens on {new Date(m.dueDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
              </div>
            ) : (
              <Button
                onClick={() => onUploadClick(m)}
                className="bg-transparent border border-[#EAB308] hover:bg-[#EAB308]/10 text-[#EAB308] font-bold px-5 sm:px-7 h-11 rounded flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>{isRejected ? 'Re-upload Receipt' : 'Upload Receipt'}</span>
                <CircleAlert className="w-4 h-4 opacity-70 ml-1" />
              </Button>
            )
          )}

          {m.paymentStatus === 'PENDING' && role === 'AGENT' && (
            <>
              {!m.agentDocumentUrl && (
                <Button
                  onClick={() => onUploadClick(m)}
                  className="bg-transparent border border-[#EAB308] hover:bg-[#EAB308]/10 text-[#EAB308] font-bold px-5 sm:px-7 h-11 rounded flex items-center gap-2.5 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Proof</span>
                </Button>
              )}
              <Button
                disabled={!m.agentDocumentUrl && (!m.agentDocumentUrls || m.agentDocumentUrls.length === 0)}
                onClick={() => handleMarkAsReceived(m)}
                className={`font-bold px-6 sm:px-9 h-11 rounded flex items-center gap-2.5 border-none shadow-lg transition-all ${
                  !m.agentDocumentUrl && (!m.agentDocumentUrls || m.agentDocumentUrls.length === 0)
                    ? 'bg-gray-600 cursor-not-allowed opacity-50 shadow-none'
                    : 'bg-[#059669] hover:bg-[#047857] text-white shadow-emerald-900/10 hover:scale-105'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Mark as Received</span>
                {!m.agentDocumentUrl && (!m.agentDocumentUrls || m.agentDocumentUrls.length === 0) && (
                  <Shield className="w-3.5 h-3.5 opacity-70 ml-1" />
                )}
              </Button>
            </>
          )}

          {m.paymentStatus === 'AGENT_REVIEWED' && (role === 'AGENT' || role === 'BUYER') && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-emerald-950/20 border border-emerald-900/30 px-6 py-3 rounded">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-500">
                  {role === 'BUYER' ? 'Waiting for Admin Final Approval' : 'Wait for Admin Verification'}
                </span>
              </div>
              
              {role === 'AGENT' && !m.agentDocumentUrl && (
                <Button
                  onClick={() => onUploadClick(m)}
                  className="bg-transparent border border-[#EAB308] hover:bg-[#EAB308]/10 text-[#EAB308] font-bold px-5 sm:px-7 h-11 rounded flex items-center gap-2.5 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Proof</span>
                </Button>
              )}
            </div>
          )}

          {isCompleted && (
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                className="bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-300 border border-gray-800 px-5 h-10 rounded flex items-center gap-2 text-sm font-bold"
                onClick={() => {
                  if ((m.proofUrls?.length || 0) > 1) {
                    handleViewNotes(m);
                  } else if (m.proofUrl) {
                    window.open(m.proofUrl, '_blank');
                  }
                }}
              >
                <FileText className="w-4 h-4" />
                {(m.proofUrls?.length || 0) > 1 ? `View All (${m.proofUrls.length})` : 'View Receipt'}
              </Button>
              <Button
                variant="secondary"
                className="bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-300 border border-gray-800 px-5 h-10 rounded flex items-center gap-2 text-sm font-bold"
                onClick={() => {
                  const url = m.proofUrls?.[0] || m.proofUrl;
                  if (url) handleDownloadDocument(url);
                }}
              >
                <Download className="w-4 h-4" /> Download
              </Button>
            </div>
          )}

          {role === 'ADMIN' && m.paymentStatus === 'AGENT_REVIEWED' && (
            <Button
              onClick={() => handleAdminVerify(m)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 h-12 rounded border-none shadow-xl transition-all hover:scale-105"
            >
              Verify Milestone
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
