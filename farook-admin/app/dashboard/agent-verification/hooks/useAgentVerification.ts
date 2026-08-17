import { useState } from "react";
import { toast } from "sonner";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  useGetPendingAgentsQuery,
  useVerifyAgentByAdminMutation,
  useGetAgentStatsQuery,
  useGetAllAgentsByAdminQuery
} from "@/redux/api/adminApi";

// Utility functions from frontend
const extractArrayResponse = (response: unknown): any[] => {
  if (Array.isArray(response)) return response;
  if (response && typeof response === "object") {
    const wrapped = response as { data?: { data?: any[] } | any[] };
    if (Array.isArray(wrapped?.data)) return wrapped.data;
    if (Array.isArray((wrapped?.data as { data?: any[] })?.data)) {
      return (wrapped.data as { data?: any[] }).data || [];
    }
  }
  return [];
};

const extractObjectResponse = (response: unknown): Record<string, any> => {
  if (!response || typeof response !== "object" || Array.isArray(response)) return {};
  const wrapped = response as { data?: { data?: Record<string, any> } | Record<string, any> };
  const dataLevel = wrapped?.data;
  if (dataLevel && typeof dataLevel === "object" && !Array.isArray(dataLevel)) {
    const nested = (dataLevel as { data?: Record<string, any> }).data;
    if (nested && typeof nested === "object" && !Array.isArray(nested)) return nested;
    return dataLevel as Record<string, any>;
  }
  return wrapped as Record<string, any>;
};

export function useAgentVerification() {
  const { data: userData } = useGetMeQuery({});
  const admin = userData?.data?.data || userData?.data;

  const { data: pendingAgentsResponse, isLoading: pendingLoading } = useGetPendingAgentsQuery();
  const { data: allAgentsResponse, isLoading: allLoading } = useGetAllAgentsByAdminQuery(
    { adminId: admin?.id || "" },
    { skip: !admin?.id }
  );
  const { data: statsResponse } = useGetAgentStatsQuery(
    { adminId: admin?.id || "" },
    { skip: !admin?.id }
  );
  const [verifyAgent] = useVerifyAgentByAdminMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRega, setFilterRega] = useState("all");
  const [filterNafath, setFilterNafath] = useState("all");

  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [viewingAgent, setViewingAgent] = useState<any>(null);
  const [editForm, setEditForm] = useState({ isRega: false, isNafath: false });
  const [processingId, setProcessingId] = useState<string | null>(null);

  const statsData = extractObjectResponse(statsResponse);
  const pendingAgents = extractArrayResponse(pendingAgentsResponse);
  const allAgents = extractArrayResponse(allAgentsResponse);

  // Combine pending and all agents to show in the unified table design of farook-admin
  // To avoid duplicates, we can prefer the pending list items if they exist
  const combinedAgentsMap = new Map();
  allAgents.forEach(a => combinedAgentsMap.set(a.id || a.userId, a));
  pendingAgents.forEach(a => combinedAgentsMap.set(a.id || a.userId || a.user?.id, a));
  
  const agentsList = Array.from(combinedAgentsMap.values());

  const handleVerify = async (agent: any, isRega: boolean, isNafath: boolean) => {
    const agentId = agent?.userId || agent?.user?.id || agent?.id;
    if (!agentId) {
      toast.error("Agent ID not found");
      return;
    }
    setProcessingId(agentId);
    try {
      await verifyAgent({
        agentId,
        adminId: admin?.id,
        isRegaVerified: isRega,
        isNafathVerified: isNafath,
        notes: "Verified by admin",
      }).unwrap();
      toast.success("Agent verification updated");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update agent");
    } finally {
      setProcessingId(null);
    }
  };

  const openEditModal = (agent: any) => {
    const profile = agent?.agentProfile || agent;
    setEditForm({
      isRega: !!profile?.isRegaVerified,
      isNafath: !!profile?.isNafathVerified,
    });
    setEditingAgent(agent);
  };

  const handleSaveEdit = async () => {
    if (!editingAgent) return;
    await handleVerify(editingAgent, editForm.isRega, editForm.isNafath);
    setEditingAgent(null);
  };

  const filteredAgents = agentsList.filter((agent: any) => {
    const user = agent?.user || agent;
    const profile = agent?.agentProfile || agent;
    
    const fullName = (user?.fullName || "").toLowerCase();
    const email = (user?.email || "").toLowerCase();
    const licenseId = (profile?.licenseId || "").toLowerCase();
    const search = searchQuery.toLowerCase();
    
    const matchesSearch = fullName.includes(search) || email.includes(search) || licenseId.includes(search);
    
    let matchesRega = true;
    if (filterRega === 'verified') matchesRega = profile?.isRegaVerified === true;
    if (filterRega === 'pending') matchesRega = profile?.isRegaVerified !== true;
    
    let matchesNafath = true;
    if (filterNafath === 'verified') matchesNafath = profile?.isNafathVerified === true;
    if (filterNafath === 'pending') matchesNafath = profile?.isNafathVerified !== true;

    return matchesSearch && matchesRega && matchesNafath;
  });

  return {
    pendingLoading,
    allLoading,
    statsData,
    searchQuery,
    setSearchQuery,
    filterRega,
    setFilterRega,
    filterNafath,
    setFilterNafath,
    filteredAgents,
    processingId,
    handleVerify,
    openEditModal,
    viewingAgent,
    setViewingAgent,
    editingAgent,
    setEditingAgent,
    editForm,
    setEditForm,
    handleSaveEdit
  };
}
