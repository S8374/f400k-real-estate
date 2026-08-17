"use client";

import CreateUnitModal from "../modules/modal/CreateUnitModal";
import EditUnitModal from "../modules/modal/EditUnitModal";
import CreateAttributeModal from "../modules/modal/CreateAttributeModal";
import EditAttributeModal from "../modules/modal/EditAttributeModal";
import CreateBankAccountModal from "../modules/modal/CreateBankAccountModal";
import EditBankAccountModal from "../modules/modal/EditBankAccountModal";
import CreateInvisitorModal from "../modules/modal/CreateInvisitorModal";
import EditInvisitorModal from "../modules/modal/EditInvisitorModal";
import CreatePaymentPlanModal from "../modules/modal/CreatePaymentPlanModal";
import CreatePaymentMilestoneModal1 from "../modules/modal/CreatePaymentMilestoneModal1";

interface PropertyItemModalsProps {
  id: string;
  user: any;
  unitModalOpen: boolean;
  setUnitModalOpen: (val: boolean) => void;
  editUnitModalOpen: boolean;
  setEditUnitModalOpen: (val: boolean) => void;
  unitId: string;
  attributeModal: boolean;
  setAttributeModal: (val: boolean) => void;
  editAttributeModal: boolean;
  setEditAttributeModal: (val: boolean) => void;
  selectedAttribute: any;
  bankModalOpen: boolean;
  setBankModalOpen: (val: boolean) => void;
  refetchBankAccounts: () => void;
  editBankModalOpen: boolean;
  setEditBankModalOpen: (val: boolean) => void;
  selectedBankAccount: any;
  setSelectedBankAccount: (val: any) => void;
  invisitorModal: boolean;
  setInvisitorModal: (val: boolean) => void;
  refetchInvisitors: () => void;
  editInvisitorModal: boolean;
  setEditInvisitorModal: (val: boolean) => void;
  selectedInvisitor: any;
  setSelectedInvisitor: (val: any) => void;
  paymentPlanModal: boolean;
  setPaymentPlanModal: (val: boolean) => void;
  paymentMilestoneModal: boolean;
  setPaymentMilestoneModal: (val: boolean) => void;
  refetchMilestones: () => void;
  selectedPlanId?: string;
  totalPropertyPrice: number;
}

export function PropertyItemModals({
  id,
  user,
  unitModalOpen,
  setUnitModalOpen,
  editUnitModalOpen,
  setEditUnitModalOpen,
  unitId,
  attributeModal,
  setAttributeModal,
  editAttributeModal,
  setEditAttributeModal,
  selectedAttribute,
  bankModalOpen,
  setBankModalOpen,
  refetchBankAccounts,
  editBankModalOpen,
  setEditBankModalOpen,
  selectedBankAccount,
  setSelectedBankAccount,
  invisitorModal,
  setInvisitorModal,
  refetchInvisitors,
  editInvisitorModal,
  setEditInvisitorModal,
  selectedInvisitor,
  setSelectedInvisitor,
  paymentPlanModal,
  setPaymentPlanModal,
  paymentMilestoneModal,
  setPaymentMilestoneModal,
  refetchMilestones,
  selectedPlanId,
  totalPropertyPrice,
}: PropertyItemModalsProps) {
  return (
    <>
      <CreateUnitModal
        open={unitModalOpen}
        onClose={() => setUnitModalOpen(false)}
        propertyId={id}
      />
      <EditUnitModal
        open={editUnitModalOpen}
        onClose={() => setEditUnitModalOpen(false)}
        propertyId={id}
        unitId={unitId}
      />
      <CreateAttributeModal
        open={attributeModal}
        onClose={() => setAttributeModal(false)}
        propertyId={id}
      />
      <EditAttributeModal
        open={editAttributeModal}
        onClose={() => setEditAttributeModal(false)}
        propertyId={id}
        attribute={selectedAttribute}
      />
      <CreateBankAccountModal
        open={bankModalOpen}
        onClose={() => {
          setBankModalOpen(false);
          refetchBankAccounts();
        }}
        propertyId={id}
        userId={user?.id}
      />
      <EditBankAccountModal
        open={editBankModalOpen}
        onClose={() => {
          setEditBankModalOpen(false);
          setSelectedBankAccount(null);
          refetchBankAccounts();
        }}
        bankAccount={selectedBankAccount}
        propertyId={id}
      />
      <CreateInvisitorModal
        open={invisitorModal}
        setOpen={(open: boolean) => {
          setInvisitorModal(open);
          if (!open) refetchInvisitors();
        }}
        propertyId={id}
        userId={user?.id}
      />
      <EditInvisitorModal
        open={editInvisitorModal}
        onClose={() => {
          setEditInvisitorModal(false);
          setSelectedInvisitor(null);
          refetchInvisitors();
        }}
        invisitor={selectedInvisitor}
        propertyId={id}
      />
      <CreatePaymentPlanModal
        open={paymentPlanModal}
        onClose={() => {
          setPaymentPlanModal(false);
        }}
        propertyId={id}
      />

      <CreatePaymentMilestoneModal1
        open={paymentMilestoneModal}
        onClose={() => {
          setPaymentMilestoneModal(false);
          refetchMilestones();
        }}
        propertyId={id}
        paymentPlanId={selectedPlanId}
        totalPropertyPrice={Number(totalPropertyPrice)}
      />
    </>
  );
}
