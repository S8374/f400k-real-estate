"use client";

import { useGetMeQuery } from "@/redux/api/authApi";
import {
    KycDocument,
    useDeleteKycDocumentMutation,
    useGetKycDocumentsByUserQuery,
    useUpdateKycDocumentMutation,
    useUploadKycDocumentMutation,
} from "@/redux/api/kycDocumentApi";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
    KYC_DOCUMENTS,
    KycDocumentConfig,
    KycDocumentType,
    getDocumentPriority,
    getDocumentTimestamp,
    getDocumentUID,
    normalizeDocType,
    normalizeStatus,
} from "./kyc-components/kyc.utils";
import KycDocumentRow from "./kyc-components/KycDocumentRow";
import KycDocumentUploadModal from "./kyc-components/KycDocumentUploadModal";
import KycDocumentPreviewModal from "./kyc-components/KycDocumentPreviewModal";

export default function BuyerProfileKYCDocuments() {
    const { data: meData, isLoading: isMeLoading } = useGetMeQuery({});
    const user = meData?.data?.data || meData?.data || meData;
    const userId = user?.id || user?._id || user?.uid || user?.userId;

    const {
        data: kycDocuments = [],
        refetch: refetchKycDocuments,
    } = useGetKycDocumentsByUserQuery(userId, {
        skip: !userId,
    });

    const [uploadImages, { isLoading: isUploadingImage }] = useUploadImagesMutation();
    const [uploadKycDocument, { isLoading: isUploadingKyc }] = useUploadKycDocumentMutation();
    const [updateKycDocument, { isLoading: isUpdatingKyc }] = useUpdateKycDocumentMutation();
    const [deleteKycDocument, { isLoading: isDeletingKyc }] = useDeleteKycDocumentMutation();

    const [activeModalType, setActiveModalType] = useState<KycDocumentType | null>(null);
    const [previewModalType, setPreviewModalType] = useState<KycDocumentType | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<Partial<Record<KycDocumentType, File>>>({});
    const [selectedPreviews, setSelectedPreviews] = useState<Partial<Record<KycDocumentType, string>>>({});

    const serverDocumentsByType = useMemo(() => {
        return kycDocuments.reduce<Partial<Record<KycDocumentType, KycDocument>>>(
            (acc: any, item: any) => {
                const type = normalizeDocType(item?.documentType);
                if (type) {
                    const current = acc[type];

                    if (!current) {
                        acc[type] = item;
                    } else {
                        const currentTimestamp = getDocumentTimestamp(current);
                        const itemTimestamp = getDocumentTimestamp(item);

                        if (itemTimestamp > currentTimestamp) {
                            acc[type] = item;
                        } else if (
                            itemTimestamp === currentTimestamp &&
                            getDocumentPriority(item) >= getDocumentPriority(current)
                        ) {
                            acc[type] = item;
                        }
                    }
                }
                return acc;
            },
            {}
        );
    }, [kycDocuments]);

    const handleFileChange = (type: KycDocumentType, file?: File) => {
        if (!file) return;

        setSelectedFiles((prev) => ({ ...prev, [type]: file }));

        if (!file.type.startsWith("image/")) {
            setSelectedPreviews((prev) => ({ ...prev, [type]: "" }));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setSelectedPreviews((prev) => ({
                ...prev,
                [type]: typeof reader.result === "string" ? reader.result : "",
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveSelectedFile = (type: KycDocumentType) => {
        setSelectedFiles((prev) => ({
            ...prev,
            [type]: undefined,
        }));
        setSelectedPreviews((prev) => ({
            ...prev,
            [type]: undefined,
        }));
    };

    const handleSubmitDocument = async (doc: KycDocumentConfig) => {
        const selectedFile = selectedFiles[doc.type];
        const existingDocument = serverDocumentsByType[doc.type];
        const documentUID = getDocumentUID(existingDocument);
        const previousStatus = normalizeStatus(existingDocument);

        if (isMeLoading) {
            toast.error("User information is still loading. Please wait a moment.");
            return;
        }

        if (!userId) {
            toast.error("User information not found. Please refresh and try again.");
            return;
        }

        if (!selectedFile) {
            toast.error("Please choose a file before uploading.");
            return;
        }

        try {
            const imageFormData = new FormData();
            imageFormData.append("files", selectedFile);

            const uploadResponse: any = await uploadImages(imageFormData).unwrap();
            const fileUrl = uploadResponse?.data?.urls?.[0] || uploadResponse?.data?.data?.urls?.[0];

            if (!fileUrl) {
                toast.error("Upload failed: file URL not found.");
                return;
            }

            if (documentUID) {
                await updateKycDocument({
                    documentUID,
                    fileUrl,
                }).unwrap();
            } else {
                await uploadKycDocument({
                    userId,
                    documentType: doc.type,
                    fileUrl,
                    notes: doc.notes,
                }).unwrap();
            }

            setSelectedFiles((prev) => ({
                ...prev,
                [doc.type]: undefined,
            }));
            setSelectedPreviews((prev) => ({
                ...prev,
                [doc.type]: undefined,
            }));

            setActiveModalType(null);
            refetchKycDocuments();
            toast.success(
                documentUID && previousStatus !== "REJECTED" && previousStatus !== "VERIFIED"
                    ? `${doc.label} updated successfully.`
                    : `${doc.label} uploaded successfully. Pending verification.`
            );
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to upload ${doc.label}.`);
        }
    };

    const handleDeleteDocument = async (doc: KycDocumentConfig) => {
        const existingDocument = serverDocumentsByType[doc.type];
        const documentUID = getDocumentUID(existingDocument);

        if (!documentUID) {
            toast.error("Document not found.");
            return;
        }

        try {
            await deleteKycDocument(documentUID).unwrap();
            setSelectedFiles((prev) => ({ ...prev, [doc.type]: undefined }));
            setSelectedPreviews((prev) => ({ ...prev, [doc.type]: undefined }));
            setPreviewModalType(null);
            setActiveModalType(null);
            refetchKycDocuments();
            toast.success(`${doc.label} deleted successfully.`);
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to delete ${doc.label}.`);
        }
    };

    return (
        <div className="bg-[#2c2a2a] p-4 rounded mt-4">
            <h3 className="text-lg font-semibold mb-4">KYC Documents</h3>

            <div className="space-y-4">
                {KYC_DOCUMENTS.map((doc) => {
                    const serverDocument = serverDocumentsByType[doc.type];
                    const documentUID = getDocumentUID(serverDocument);
                    const fileUrl = serverDocument?.fileUrl;

                    const isModalOpen = activeModalType === doc.type;
                    const isPreviewModalOpen = previewModalType === doc.type;
                    const selectedFile = selectedFiles[doc.type];
                    const selectedPreview = selectedPreviews[doc.type];
                    const isSubmitting = isUploadingImage || isUploadingKyc || isUpdatingKyc;
                    const isDeleting = isDeletingKyc;
                    const isUploadedImage = Boolean(fileUrl) && /\.(png|jpe?g|webp|gif|bmp|svg|pdf)(\?.*)?$/i.test(fileUrl || "");

                    return (
                        <div key={doc.type}>
                            <KycDocumentRow
                                doc={doc}
                                serverDocument={serverDocument}
                                isDeleting={isDeleting}
                                setActiveModalType={setActiveModalType}
                                setPreviewModalType={setPreviewModalType}
                                handleDeleteDocument={handleDeleteDocument}
                            />

                            <KycDocumentUploadModal
                                isOpen={isModalOpen}
                                onOpenChange={(open) => setActiveModalType(open ? doc.type : null)}
                                doc={doc}
                                documentUID={documentUID}
                                selectedFile={selectedFile}
                                selectedPreview={selectedPreview}
                                isSubmitting={isSubmitting}
                                handleFileChange={handleFileChange}
                                handleRemoveSelectedFile={handleRemoveSelectedFile}
                                handleSubmitDocument={handleSubmitDocument}
                            />

                            <KycDocumentPreviewModal
                                isOpen={isPreviewModalOpen}
                                onOpenChange={(open) => setPreviewModalType(open ? doc.type : null)}
                                doc={doc}
                                fileUrl={fileUrl}
                                isUploadedImage={isUploadedImage}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}