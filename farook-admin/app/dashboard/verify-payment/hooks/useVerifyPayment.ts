import { useState } from "react";
import { toast } from "sonner";
import {
  useGetPendingMilestonePaymentsByAdminQuery,
  useVerifyMilestonePaymentByAdminMutation,
} from "@/redux/api/adminApi";
import { useGetMeQuery } from "@/redux/api/authApi";

export const formatCurrency = (amount: number, currency = "SAR") => {
  return `${currency} ${Number(amount || 0).toLocaleString()}`;
};

export function useVerifyPayment() {
  const { data: userData } = useGetMeQuery(undefined);
  const adminId = userData?.id || userData?.data?.id || userData?.data?.data?.id;

  const [activeTab, setActiveTab] = useState<string>("PENDING");

  const [notesByPayment, setNotesByPayment] = useState<Record<string, string>>({});
  const [rejectionReasonByPayment, setRejectionReasonByPayment] = useState<Record<string, string>>({});
  const [selectedPaymentForDetails, setSelectedPaymentForDetails] = useState<any>(null);
  const [isMilestoneDetailsOpen, setIsMilestoneDetailsOpen] = useState(false);
  const [isPropertyDetailsOpen, setIsPropertyDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: paymentsData = [],
    isLoading: paymentsLoading,
  } = useGetPendingMilestonePaymentsByAdminQuery(
    {
      adminId: adminId || "",
      status: activeTab === "PENDING" ? "AGENT_REVIEWED" : "VERIFIED"
    },
    { skip: !adminId }
  );

  const payments = Array.isArray(paymentsData) ? paymentsData : [];

  const [verifyPayment, { isLoading: verifyingPayment }] = useVerifyMilestonePaymentByAdminMutation();
  const [activeActionByPayment, setActiveActionByPayment] = useState<Record<string, "APPROVE" | "REJECT" | null>>({});

  const handleVerify = async (payment: any, approve: boolean) => {
    const paymentId = payment?.id || payment?._id || payment?.paymentId;

    if (!paymentId) {
      toast.error("Invalid payment request");
      return;
    }

    const rejectionReason = rejectionReasonByPayment[paymentId]?.trim() || "";
    if (!approve && !rejectionReason) {
      toast.error("Please provide a rejection reason before rejecting.");
      return;
    }

    try {
      await verifyPayment({
        paymentId,
        adminId: adminId || "",
        approve,
        notes: notesByPayment[paymentId] || (approve ? "Payment verified" : "Payment rejected"),
        ...(!approve ? { rejectionReason } : {}),
      }).unwrap();

      toast.success(approve ? "Payment approved" : "Payment rejected");
      setActiveActionByPayment((prev) => ({ ...prev, [paymentId]: null }));
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to verify payment");
    }
  };

  const filteredPayments = payments.filter((p: any) => {
    const property = (p?.milestone?.plan?.property?.title || "").toLowerCase();
    const buyer = (p?.buyer?.fullName || p?.buyer?.name || p?.user?.fullName || "").toLowerCase();
    const milestone = (p?.milestone?.tittle || p?.milestone?.title || "").toLowerCase();
    const search = searchQuery.toLowerCase();
    return property.includes(search) || buyer.includes(search) || milestone.includes(search);
  });

  return {
    activeTab,
    setActiveTab,
    notesByPayment,
    setNotesByPayment,
    rejectionReasonByPayment,
    setRejectionReasonByPayment,
    selectedPaymentForDetails,
    setSelectedPaymentForDetails,
    isMilestoneDetailsOpen,
    setIsMilestoneDetailsOpen,
    isPropertyDetailsOpen,
    setIsPropertyDetailsOpen,
    searchQuery,
    setSearchQuery,
    activeActionByPayment,
    setActiveActionByPayment,
    paymentsLoading,
    verifyingPayment,
    filteredPayments,
    handleVerify
  };
}
