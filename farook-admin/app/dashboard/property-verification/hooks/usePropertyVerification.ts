import { useState } from "react";
import { toast } from "sonner";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  useGetPendingPropertiesQuery,
  useGetVerifiedPropertiesQuery,
  useGetPropertyByIdQuery,
  useVerifyPropertyByAdminMutation,
  useDeletePropertyByAdminMutation,
} from "@/redux/api/adminApi";

// Helper to safely extract arrays from various API response shapes
export const extractArrayResponse = (response: any): any[] => {
  if (Array.isArray(response)) return response;
  if (response && typeof response === "object") {
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.data)) return response.data.data;
    if (Array.isArray(response.data?.properties)) return response.data.properties;
    if (Array.isArray(response.properties)) return response.properties;
  }
  return [];
};

export function usePropertyVerification() {
  const { data: userData } = useGetMeQuery({});
  const admin = userData?.data?.data || userData?.data;

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [propertyForm, setPropertyForm] = useState<Record<string, { sakNumber: string }>>({});
  const [viewingProperty, setViewingProperty] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const { data: pendingRes, isLoading: pendingLoading } = useGetPendingPropertiesQuery({});
  const { data: verifiedRes, isLoading: verifiedLoading } = useGetVerifiedPropertiesQuery({});
  
  const { data: detailsData, isFetching: detailsLoading } = useGetPropertyByIdQuery(viewingProperty?.id, { skip: !viewingProperty });
  const fullProperty = detailsData?.data?.data || detailsData?.data || detailsData || viewingProperty;

  const [verifyProperty] = useVerifyPropertyByAdminMutation();
  const [deleteProperty] = useDeletePropertyByAdminMutation();

  const pendingProperties = extractArrayResponse(pendingRes);
  const verifiedProperties = extractArrayResponse(verifiedRes);

  // Deduplicate properties by ID to handle RTK Query cache overlaps during mutations
  const allPropertiesMap = new Map();
  [...pendingProperties, ...verifiedProperties].forEach(p => {
    if (p && p.id) {
      allPropertiesMap.set(p.id, p);
    }
  });
  const allProperties = Array.from(allPropertiesMap.values());
  const isLoading = pendingLoading || verifiedLoading;

  const handlePropertyVerify = async (property: any) => {
    const rowState = propertyForm[property.id] || { sakNumber: property?.sakNumber || "" };

    if (!rowState.sakNumber) {
      toast.error("Sak number is required before verification");
      return;
    }

    try {
      setIsProcessing(`verify-${property.id}`);
      await verifyProperty({
        propertyId: property.id,
        adminId: admin?.id,
        isRegaVerified: true,
        sakNumber: rowState.sakNumber,
        notes: "Property verified by admin",
      }).unwrap();
      toast.success("Property verified successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to verify property");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleUnverify = async (property: any) => {
    try {
      setIsProcessing(`unverify-${property.id}`);
      await verifyProperty({
        propertyId: property.id,
        adminId: admin?.id,
        isRegaVerified: false,
        sakNumber: property.sakNumber || "",
        notes: "Unverified by admin",
      }).unwrap();
      toast.success("Property unverified successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to unverify property");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      setIsProcessing(`delete-${id}`);
      await deleteProperty(id).unwrap();
      toast.success("Property deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete property");
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredProperties = allProperties.filter((p) => {
    const title = p?.title?.toLowerCase() || "";
    const owner = (p?.user?.fullName || p?.ownerName || "").toLowerCase();
    const sak = (p?.sakNumber || "").toLowerCase();
    const search = searchQuery.toLowerCase();
    
    const matchesSearch = title.includes(search) || owner.includes(search) || sak.includes(search);
    
    let matchesStatus = true;
    const isVerified = p?.isVerified || p?.isRegaVerified;
    if (filterStatus === 'verified') matchesStatus = isVerified;
    if (filterStatus === 'pending') matchesStatus = !isVerified;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: allProperties.length,
    verified: verifiedProperties.length,
    pending: pendingProperties.length
  };

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    propertyForm,
    setPropertyForm,
    viewingProperty,
    setViewingProperty,
    isProcessing,
    isLoading,
    detailsLoading,
    fullProperty,
    filteredProperties,
    stats,
    handlePropertyVerify,
    handleUnverify,
    handleDelete
  };
}
