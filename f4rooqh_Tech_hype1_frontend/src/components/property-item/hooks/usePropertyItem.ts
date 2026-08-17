import { useState, useEffect } from "react";
import { useDeletePropertyMutation } from "@/redux/api/propertyApi";
import { toast } from "sonner";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetMilestonesByPlanQuery } from "@/redux/api/mileston.api";
import { useDeletePropertyAttributesMutation } from "@/redux/api/attributeApi";
import { useDeletePropertyUnitsMutation } from "@/redux/api/unitApi";
import { useDeletePaymentPlanByIdMutation } from "@/redux/api/paymentPlanApi";
import {
  useGetBankAccountsByPropertyQuery,
  useDeleteBankAccountMutation,
} from "@/redux/api/bankAccountApi";
import {
  useGetPropertyInvisitorsByPropertyQuery,
  useDeletePropertyInvisitorMutation,
} from "@/redux/api/invisitorApi";

export function usePropertyItem({
  id,
  price,
  status,
  paymentPlans,
  _count,
  totalUnits,
  availableUnits,
}: {
  id: string;
  price: string | number;
  status: string;
  paymentPlans?: any[];
  _count?: any;
  totalUnits?: number;
  availableUnits?: number;
}) {
  const paymentPlanCount = paymentPlans?.length || _count?.paymentPlans || 0;
  const propertyViews = _count?.propertyViews || 0;
  const savedBy = _count?.savedBy || 0;
  const unitsCount = _count?.units || 0;
  const statusColor =
    {
      ACTIVE: "bg-emerald-600",
      PENDING: "bg-yellow-600",
      SOLD: "bg-red-600",
      RENTED: "bg-blue-600",
    }[status] || "bg-gray-600";

  const { data: userData } = useGetMeQuery({});
  const user = userData?.data?.data || userData?.data;

  // Fetch bank accounts for this property
  const { data: bankAccountsData, refetch: refetchBankAccounts } =
    useGetBankAccountsByPropertyQuery({ propertyId: id }, { skip: !id });
  const bankAccounts = bankAccountsData?.data?.data || [];
  const hasBankAccount = bankAccounts.length > 0;

  // Fetch invisitors for this property
  const { data: invisitorsData, refetch: refetchInvisitors } =
    useGetPropertyInvisitorsByPropertyQuery({ propertyId: id }, { skip: !id });
  const invisitors = invisitorsData?.data?.data || [];
  const hasInvisitor = invisitors.length > 0;

  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [editUnitModalOpen, setEditUnitModalOpen] = useState(false);
  const [attributeModal, setAttributeModal] = useState(false);
  const [editAttributeModal, setEditAttributeModal] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<any>(null);
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [editBankModalOpen, setEditBankModalOpen] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<any>(null);
  const [invisitorModal, setInvisitorModal] = useState(false);
  const [editInvisitorModal, setEditInvisitorModal] = useState(false);
  const [selectedInvisitor, setSelectedInvisitor] = useState<any>(null);
  const [paymentPlanModal, setPaymentPlanModal] = useState(false);
  const [paymentMilestoneModal, setPaymentMilestoneModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<string>("plans");
  const [unitId, setUnitId] = useState("");

  const [deleteProperty, { isLoading: deletePropertyLoading }] =
    useDeletePropertyMutation();
  const [deleteAttribute] = useDeletePropertyAttributesMutation();
  const [deleteUnit] = useDeletePropertyUnitsMutation();
  const [deletePlan] = useDeletePaymentPlanByIdMutation();
  const [deleteBankAccount, { isLoading: deleteBankLoading }] =
    useDeleteBankAccountMutation();
  const [deleteInvisitor, { isLoading: deleteInvisitorLoading }] =
    useDeletePropertyInvisitorMutation();

  // Fetch milestones count for selected plan
  const { data: milestonesData, refetch: refetchMilestones } =
    useGetMilestonesByPlanQuery(
      { planId: selectedPlanId! },
      { skip: !selectedPlanId }
    );

  const selectedPlanMilestones = milestonesData?.data?.data || [];
  const selectedPlanMilestonesCount = selectedPlanMilestones.length;
  const selectedPlan = paymentPlans?.find((p) => p.id === selectedPlanId);
  const totalInstallments = selectedPlan?.totalInstallments || 6;
  const reachedLimit = selectedPlanMilestonesCount >= totalInstallments;

  useEffect(() => {
    if (selectedPlanId && milestonesData?.data?.data) {
      refetchMilestones();
    }
  }, [selectedPlanId, milestonesData, refetchMilestones]);

  const handleDeletePlan = async (planId: string) => {
    try {
      await deletePlan(planId).unwrap();
      toast.success("Plan deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete Plan!.");
    }
  };

  const handleDeleteAttribute = async (attrId: string) => {
    try {
      await deleteAttribute(attrId).unwrap();
      toast.success("Attribute deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete attribute.");
    }
  };

  const handleDeleteUnit = async (uId: string) => {
    try {
      await deleteUnit(uId).unwrap();
      toast.success("Unit deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete unit.");
    }
  };

  const handleDeleteBankAccount = async (bId: string) => {
    try {
      await deleteBankAccount(bId).unwrap();
      toast.success("Bank account deleted successfully.");
      refetchBankAccounts();
    } catch (error) {
      toast.error("Failed to delete bank account.");
    }
  };

  const handleDeleteInvisitor = async (iId: string) => {
    try {
      await deleteInvisitor(iId).unwrap();
      toast.success("Invisitor deleted successfully.");
      refetchInvisitors();
    } catch (error) {
      toast.error("Failed to delete invisitor.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProperty(id).unwrap();
      toast.success("Property deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete property.");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const totalUnitsCount = totalUnits || unitsCount || 0;
  const availableUnitsCount = availableUnits || 0;
  const totalPropertyPrice = price || 0;

  const handleAddMilestone = () => {
    if (!selectedPlanId) {
      toast.error("Please select a payment plan first");
      return;
    }
    setPaymentMilestoneModal(true);
  };

  const formatIBAN = (iban: string) => {
    if (!iban) return "";
    return iban.replace(/(.{4})/g, "$1 ").trim();
  };

  return {
    paymentPlanCount,
    propertyViews,
    savedBy,
    statusColor,
    user,
    bankAccounts,
    hasBankAccount,
    refetchBankAccounts,
    invisitors,
    hasInvisitor,
    refetchInvisitors,
    unitModalOpen,
    setUnitModalOpen,
    editUnitModalOpen,
    setEditUnitModalOpen,
    attributeModal,
    setAttributeModal,
    editAttributeModal,
    setEditAttributeModal,
    selectedAttribute,
    setSelectedAttribute,
    bankModalOpen,
    setBankModalOpen,
    editBankModalOpen,
    setEditBankModalOpen,
    selectedBankAccount,
    setSelectedBankAccount,
    invisitorModal,
    setInvisitorModal,
    editInvisitorModal,
    setEditInvisitorModal,
    selectedInvisitor,
    setSelectedInvisitor,
    paymentPlanModal,
    setPaymentPlanModal,
    paymentMilestoneModal,
    setPaymentMilestoneModal,
    selectedPlanId,
    setSelectedPlanId,
    activeTab,
    setActiveTab,
    unitId,
    setUnitId,
    deletePropertyLoading,
    deleteBankLoading,
    deleteInvisitorLoading,
    refetchMilestones,
    selectedPlanMilestonesCount,
    totalInstallments,
    reachedLimit,
    handleDeletePlan,
    handleDeleteAttribute,
    handleDeleteUnit,
    handleDeleteBankAccount,
    handleDeleteInvisitor,
    handleDelete,
    formatCurrency,
    formatDate,
    copyToClipboard,
    totalUnitsCount,
    availableUnitsCount,
    totalPropertyPrice,
    handleAddMilestone,
    formatIBAN,
  };
}
