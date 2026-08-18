import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  useUploadBuyerPaymentMutation,
  useReviewPaymentMutation,
  useUploadAgentDocumentMutation,
  useVerifyPaymentMutation,
  useMarkAsReadMutation
} from '@/redux/api/mileston.api';
import { useUploadImagesMutation } from '@/redux/api/uploade.api';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import MilestoneCard from './components/MilestoneCard';
import UploadDocumentModal from './components/UploadDocumentModal';
import NotesViewModal from './components/NotesViewModal';
import DocumentViewerModal from './components/DocumentViewerModal';

interface PaymentMilestonesProps {
  milestones: any[];
  propertyId: string;
  paymentPlanId: string;
  role: 'BUYER' | 'AGENT' | 'ADMIN';
  userId: string;
}

export default function PaymentMilestones({
  milestones,
  propertyId,
  paymentPlanId,
  role,
  userId
}: PaymentMilestonesProps) {
  const [uploadBuyerPayment] = useUploadBuyerPaymentMutation();
  const [reviewPayment] = useReviewPaymentMutation();
  const [uploadAgentDocument] = useUploadAgentDocumentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [uploadImages] = useUploadImagesMutation();
  const [markAsRead] = useMarkAsReadMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetMilestone, setTargetMilestone] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [note, setNote] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Note View State
  const [isNotesViewOpen, setIsNotesViewOpen] = useState(false);
  const [viewNotesMilestone, setViewNotesMilestone] = useState<any>(null);

  // Document Viewer Modal State
  const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);
  const [viewDocumentUrls, setViewDocumentUrls] = useState<string[]>([]);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [viewDocumentType, setViewDocumentType] = useState<'pdf' | 'image' | 'document'>('document');

  const hasMilestones = milestones && milestones.length > 0;
  console.log(milestones)
  // Find active milestone
  const nextUnpaidOrder = hasMilestones
    ? [...milestones].sort((a, b) => a.order - b.order).find(m => m.paymentStatus !== 'VERIFIED')?.order
    : null;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(files)]);
      setIsNoteModalOpen(true);
    }
  };

  const handleConfirmUpload = async () => {
    if (selectedFiles.length === 0 || !targetMilestone) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const uploadRes: any = await uploadImages(formData).unwrap();

      // Extract URLs from the response
      let documentUrls: string[] = [];
      if (uploadRes?.data?.urls) {
        documentUrls = uploadRes.data.urls;
      } else if (Array.isArray(uploadRes?.urls)) {
        documentUrls = uploadRes.urls;
      } else {
        // Fallback to deep search if response is unusual
        const findUrlsDeep = (obj: any): string[] => {
          if (!obj) return [];
          if (typeof obj === 'string' && obj.startsWith('http')) return [obj];
          if (Array.isArray(obj)) return obj.flatMap(item => findUrlsDeep(item));
          if (typeof obj === 'object') {
            if (obj.urls) return obj.urls;
            if (obj.url) return [obj.url];
            return Object.values(obj).flatMap(val => findUrlsDeep(val));
          }
          return [];
        };
        documentUrls = findUrlsDeep(uploadRes);
      }

      if (documentUrls.length === 0) throw new Error("No document URLs received.");

      if (role === 'BUYER') {
        await uploadBuyerPayment({
          dto: {
            milestoneId: targetMilestone.id,
            propertyId,
            paymentplanId: paymentPlanId,
            amountPaid: targetMilestone.amount,
            proofUrls: documentUrls,
            notes: note || "Payment submitted",
          },
          buyerId: userId,
        }).unwrap();
        toast.success(`Payment submitted with ${documentUrls.length} file(s)`);
      } else if (role === 'AGENT') {
        if (!targetMilestone.paymentId) throw new Error("Payment ID not found");
        await uploadAgentDocument({
          paymentId: targetMilestone.paymentId,
          agentId: userId,
          agentDocumentUrls: documentUrls,
          notes: note,
        }).unwrap();
        toast.success(`Review completed with ${documentUrls.length} file(s)`);
      }
      setIsNoteModalOpen(false);
      setNote('');
      setSelectedFiles([]);
      setTargetMilestone(null);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewNotes = (m: any) => {
    setViewNotesMilestone(m);
    setIsNotesViewOpen(true);
  };

  const handleViewDocument = (url: string, allUrls?: string[]) => {
    const urls = allUrls || [url];
    const index = urls.indexOf(url);
    setViewDocumentUrls(urls);
    setCurrentDocIndex(index !== -1 ? index : 0);
    
    // Determine document type from URL
    const targetUrl = url;
    if (targetUrl.toLowerCase().includes('.pdf')) {
      setViewDocumentType('pdf');
    } else if (targetUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      setViewDocumentType('image');
    } else {
      setViewDocumentType('document');
    }
    setIsDocumentViewOpen(true);
  };

  const nextDoc = () => {
    const nextIdx = (currentDocIndex + 1) % viewDocumentUrls.length;
    setCurrentDocIndex(nextIdx);
    const url = viewDocumentUrls[nextIdx];
    if (url.toLowerCase().includes('.pdf')) setViewDocumentType('pdf');
    else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) setViewDocumentType('image');
    else setViewDocumentType('document');
  };

  const prevDoc = () => {
    const prevIdx = (currentDocIndex - 1 + viewDocumentUrls.length) % viewDocumentUrls.length;
    setCurrentDocIndex(prevIdx);
    const url = viewDocumentUrls[prevIdx];
    if (url.toLowerCase().includes('.pdf')) setViewDocumentType('pdf');
    else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) setViewDocumentType('image');
    else setViewDocumentType('document');
  };

  const handleDownloadDocument = async (url: string) => {
    try {
      if (!url) {
        toast.error('Document URL is missing');
        return;
      }

      console.log('Starting download from:', url);

      // Fetch the file as blob
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const blob = await response.blob();
      console.log('Blob received, size:', blob.size);

      // Extract filename
      let filename = 'document.pdf';
      const contentDisposition = response.headers.get('content-disposition');

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=(["\']?)([^"\';]*)\1/);
        if (filenameMatch) {
          filename = filenameMatch[2];
        }
      } else {
        try {
          const urlObj = new URL(url);
          const pathname = urlObj.pathname;
          const urlFilename = pathname.split('/').pop();
          if (urlFilename && urlFilename.trim().length > 0) {
            filename = urlFilename.split('?')[0];
          }
        } catch (e) {
          console.warn('Could not parse filename from URL');
        }
      }

      // Create blob URL and download
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.style.display = 'none';
      link.setAttribute('target', '_self'); // Ensure no new tab

      document.body.appendChild(link);
      link.click();

      // Clean up immediately
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

      toast.success(`Downloaded: ${filename}`);
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(`Download failed: ${error.message}`);
    }
  };

  const handleMarkAsRead = async (m: any) => {
    if (!m.paymentId) return;
    try {
      await markAsRead({ paymentId: m.paymentId, userId, userRole: role }).unwrap();
      toast.success('Marked as read');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to mark as read');
    }
  };

  const handleMarkAsReceived = async (m: any) => {
    if (!m.paymentId) return;
    
    // Safety check: Ensure the agent has uploaded proof
    if (!m.agentDocumentUrl && (!m.agentDocumentUrls || m.agentDocumentUrls.length === 0)) {
      toast.error('You must upload a document proof before marking as received');
      return;
    }

    try {
      await reviewPayment({ paymentId: m.paymentId, agentId: userId, status: 'AGENT_REVIEWED' }).unwrap();
      toast.success('Milestone marked as received');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update review status');
    }
  };

  const handleAdminVerify = async (m: any) => {
    if (!m.paymentId) return;
    try {
      await markAsRead({ paymentId: m.paymentId, userId, userRole: role }).unwrap();
      await verifyPayment({ paymentId: m.paymentId, adminId: userId, status: 'VERIFIED' }).unwrap();
      toast.success('Verified');
    } catch (error: any) {
      toast.error('Failed to verify');
    }
  };

  const onUploadClick = (m: any) => {
    setTargetMilestone(m);
    fileInputRef.current?.click();
  };

  return (
    <div className="text-white space-y-0 relative">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-200">Payment Milestones</h2>

      <div className="relative pl-12 space-y-5">
        <div className="absolute left-5.75 top-4 bottom-8 w-px bg-white/10" />

        {milestones?.map((m: any, index: number) => {
          const isCompleted = m.paymentStatus === 'VERIFIED';
          const isRejected = String(m.paymentStatus || '').toUpperCase().includes('REJECT');
          const isPending = m.paymentStatus === 'PENDING' || m.paymentStatus === 'AGENT_REVIEWED';
          const isActive = m.order === nextUnpaidOrder;
          const isUpcoming = !isCompleted && !isPending && !isRejected && !isActive;

          return (
            <MilestoneCard
              key={m.id}
              m={m}
              index={index}
              totalMilestones={milestones.length}
              role={role}
              isActive={isActive}
              isCompleted={isCompleted}
              isPending={isPending}
              isRejected={isRejected}
              isUpcoming={isUpcoming}
              handleViewNotes={handleViewNotes}
              handleMarkAsRead={handleMarkAsRead}
              handleMarkAsReceived={handleMarkAsReceived}
              handleAdminVerify={handleAdminVerify}
              handleDownloadDocument={handleDownloadDocument}
              onUploadClick={onUploadClick}
            />
          );
        })}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" multiple />

      <UploadDocumentModal
        isOpen={isNoteModalOpen}
        onOpenChange={(open) => {
          setIsNoteModalOpen(open);
          if (!open) {
            setSelectedFiles([]);
            setNote('');
          }
        }}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        fileInputRef={fileInputRef}
        note={note}
        setNote={setNote}
        isUploading={isUploading}
        handleConfirmUpload={handleConfirmUpload}
      />

      <NotesViewModal
        isOpen={isNotesViewOpen}
        onOpenChange={setIsNotesViewOpen}
        viewNotesMilestone={viewNotesMilestone}
        handleViewDocument={handleViewDocument}
      />

      <DocumentViewerModal
        isOpen={isDocumentViewOpen}
        onOpenChange={setIsDocumentViewOpen}
        documentUrls={viewDocumentUrls}
        currentIndex={currentDocIndex}
        documentType={viewDocumentType}
        onNext={nextDoc}
        onPrev={prevDoc}
        onDownload={handleDownloadDocument}
      />
    </div>
  );
}