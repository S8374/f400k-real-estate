import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetAllKycDocumentsByAdminQuery, useVerifyKycDocumentByAdminMutation } from "@/redux/api/adminApi";

export const getStatus = (doc: any) => {
  const raw = doc?.status || doc?.verificationStatus || doc?.verifyStatus;
  if (raw) return String(raw).toUpperCase();
  if (doc?.isVerified === true) return "VERIFIED";
  if (doc?.isVerified === false) return "REJECTED";
  return "PENDING";
};

export const getUserName = (doc: any) =>
  doc?.user?.fullName ||
  doc?.user?.name ||
  doc?.fullName ||
  doc?.name ||
  doc?.userName ||
  doc?.userId ||
  "Anonymous User";

export const getDocumentId = (doc: any) =>
  doc?.documentUID ||
  doc?.documentId ||
  doc?.kycDocumentId ||
  doc?.uid ||
  doc?.id ||
  doc?._id ||
  null;

export const getDocumentUrls = (doc: any): string[] => {
  const candidates = [
    doc?.fileUrl,
    doc?.url,
    doc?.documentUrl,
    doc?.imageUrl,
    doc?.frontImageUrl,
    doc?.backImageUrl,
    doc?.selfieUrl,
    doc?.passportUrl,
    doc?.nidFrontUrl,
    doc?.nidBackUrl,
  ];

  if (Array.isArray(doc?.files)) {
    for (const f of doc.files) {
      if (typeof f === "string") candidates.push(f);
      else candidates.push(f?.url, f?.fileUrl, f?.documentUrl);
    }
  }

  return candidates.filter((u): u is string => Boolean(u && typeof u === "string"));
};

export const normalizeKycDocs = (data: any[]) => {
  const list = Array.isArray(data) ? data : [];
  const normalized: any[] = [];

  for (const item of list) {
    const nestedDocs = item?.documents || item?.kycDocuments || item?.docs;

    if (Array.isArray(nestedDocs) && nestedDocs.length > 0) {
      for (const nested of nestedDocs) {
        normalized.push({
          ...nested,
          user: nested?.user || item?.user,
          fullName: nested?.fullName || item?.fullName,
          userId: nested?.userId || item?.userId,
        });
      }
      continue;
    }

    normalized.push(item);
  }

  return normalized;
};

export const getPreviewFileType = (url: string): "image" | "pdf" | "other" => {
  const lower = url.toLowerCase();
  if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|#|$)/.test(lower)) return "image";
  if (/\.pdf(\?|#|$)/.test(lower)) return "pdf";
  return "other";
};

export function useKycVerification() {
  const { data: userData } = useGetMeQuery({});
  const admin = userData?.data?.data || userData?.data;

  const [searchUser, setSearchUser] = useState("");
  const [selectedUserGroup, setSelectedUserGroup] = useState<any | null>(null);
  const [processingDocumentIds, setProcessingDocumentIds] = useState<Record<string, boolean>>({});
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState("");
  const [previewFileLabel, setPreviewFileLabel] = useState("KYC Document");
  const [activeActionByDoc, setActiveActionByDoc] = useState<Record<string, "APPROVE" | "REJECT" | null>>({});
  const [rejectionReasonByDoc, setRejectionReasonByDoc] = useState<Record<string, string>>({});

  const {
    data: allKycDocs = [],
    isLoading: pendingKycLoading,
    refetch: refetchAllKycDocs,
  } = useGetAllKycDocumentsByAdminQuery({});
  
  const [verifyKyc, { isLoading: verifyingKyc }] = useVerifyKycDocumentByAdminMutation();

  const groupedUsers = useMemo(() => {
    const keyword = searchUser.trim().toLowerCase();
    const list = normalizeKycDocs(allKycDocs);
    const groupedMap = new Map<string, { userName: string; userId: string; user: any; documents: any[] }>();

    for (const doc of list) {
      const userName = String(getUserName(doc));
      const user = doc?.user || {};
      const rawUserId = user?.id || user?._id || doc?.userId || doc?.email || user?.email || userName;

      const userId = String(rawUserId || userName);
      const key = userId.toLowerCase();

      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          userName,
          userId,
          user,
          documents: [],
        });
      }

      groupedMap.get(key)?.documents.push(doc);
    }

    const groups = Array.from(groupedMap.values()).sort((a, b) =>
      a.userName.toLowerCase().localeCompare(b.userName.toLowerCase())
    );

    if (!keyword) return groups;

    return groups.filter((group) => group.userName.toLowerCase().includes(keyword));
  }, [allKycDocs, searchUser]);

  const stats = useMemo(() => {
    const list = normalizeKycDocs(allKycDocs);
    const total = list.length;
    const pending = list.filter((d: any) => getStatus(d) === "PENDING").length;
    const verified = list.filter((d: any) => getStatus(d) === "VERIFIED").length;
    const rejected = list.filter((d: any) => getStatus(d) === "REJECTED").length;
    return { total, pending, verified, rejected };
  }, [allKycDocs]);

  const handleKycAction = async (doc: any, isApproved: boolean) => {
    const docId = getDocumentId(doc);

    if (!docId) {
      toast.error("KYC document id not found");
      return;
    }

    if (!admin?.id) {
      toast.error("Admin session not ready");
      return;
    }

    try {
      const docIdKey = String(docId);
      setProcessingDocumentIds((prev) => ({ ...prev, [docIdKey]: true }));

      const rejectionReason = isApproved ? undefined : (rejectionReasonByDoc[docIdKey]?.trim() || "Rejected by admin");
      const noteText = isApproved ? "KYC approved" : "KYC rejected";

      await verifyKyc({
        documentId: docId,
        adminId: admin?.id,
        status: isApproved ? "VERIFIED" : "REJECTED",
        notes: noteText,
        rejectionReason,
      }).unwrap();

      setSelectedUserGroup((prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          documents: (prev.documents || []).map((item: any) => {
            const itemId = getDocumentId(item);
            if (String(itemId) !== docIdKey) return item;

            return {
              ...item,
              status: isApproved ? "VERIFIED" : "REJECTED",
              verificationStatus: isApproved ? "VERIFIED" : "REJECTED",
              verifyStatus: isApproved ? "VERIFIED" : "REJECTED",
              isVerified: isApproved,
              rejectionReason: isApproved ? undefined : rejectionReason,
            };
          }),
        };
      });

      setActiveActionByDoc(prev => ({ ...prev, [docIdKey]: null }));
      setRejectionReasonByDoc(prev => ({ ...prev, [docIdKey]: "" }));
      refetchAllKycDocs();
      toast.success(isApproved ? "KYC approved" : "KYC rejected");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update KYC status");
    } finally {
      const docIdKey = String(docId);
      setProcessingDocumentIds((prev) => {
        const next = { ...prev };
        delete next[docIdKey];
        return next;
      });
    }
  };

  const handleOpenFilePreview = (url: string, label?: string) => {
    setPreviewFileUrl(url);
    setPreviewFileLabel(label || "KYC Document");
    setIsFilePreviewOpen(true);
  };

  return {
    searchUser,
    setSearchUser,
    selectedUserGroup,
    setSelectedUserGroup,
    processingDocumentIds,
    setProcessingDocumentIds,
    isFilePreviewOpen,
    setIsFilePreviewOpen,
    previewFileUrl,
    setPreviewFileUrl,
    previewFileLabel,
    setPreviewFileLabel,
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
  };
}
