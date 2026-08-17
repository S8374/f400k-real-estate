"use client";

import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";

import { MapPin, Tag, Bed, Bath, Ruler, Car, Clock, ArrowRight } from "lucide-react";
import { PropertyItemHeader } from "./property-item/PropertyItemHeader";
import { PropertyDetailsTab } from "./property-item/PropertyDetailsTab";
import { PropertyAttributesTab } from "./property-item/PropertyAttributesTab";
import { PropertyUnitsTab } from "./property-item/PropertyUnitsTab";
import { PropertyBankAccountTab } from "./property-item/PropertyBankAccountTab";
import { PropertyInvisitorTab } from "./property-item/PropertyInvisitorTab";
import { PropertyPaymentPlansSection } from "./property-item/PropertyPaymentPlansSection";
import { FeatureBox } from "./property-item/FeatureBox";
import { usePropertyItem } from "./property-item/hooks/usePropertyItem";
import { PropertyItemModals } from "./property-item/PropertyItemModals";

export function PropertyItem({
  id,
  title,
  price,
  status,
  gigaProject,
  sakNumber,
  listedDate,
  images,
  type,
  _count,
  isRegaVerified,
  paymentPlans,
  addressLine,
  location,
  bedrooms,
  bathrooms,
  areaSqm,
  parkingSlots,
  yearBuilt,
  floorNumber,
  balconies,
  furnished,
  roiProjectionPercent,
  estimatedRentalIncome,
  developer,
  attributes,
  units,
  totalUnits,
  availableUnits,
  createdAt,
  updatedAt,
}: {
  isRegaVerified?: boolean;
  id: string;
  title: string;
  price: string | number;
  status: string;
  visaEligible?: boolean;
  highYield?: boolean;
  gigaProject?: boolean;
  views: number;
  interactions: number;
  leads: number;
  sakNumber: string;
  listedDate: string;
  verification: string;
  images: string[];
  type?: string;
  addressLine?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  parkingSlots?: number;
  yearBuilt?: number;
  floorNumber?: number;
  balconies?: number;
  furnished?: boolean;
  roiProjectionPercent?: number;
  estimatedRentalIncome?: number;
  developer?: any;
  attributes?: any[];
  units?: any[];
  totalUnits?: number;
  availableUnits?: number;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    paymentPlans: number;
    propertyViews: number;
    savedBy: number;
    units: number;
    paymentMilestones?: number;
  };
  paymentPlans?: any[];
  viewType?: "table" | "card";
}) {
  const {
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
  } = usePropertyItem({
    id,
    price,
    status,
    paymentPlans,
    _count,
    totalUnits,
    availableUnits,
  });

  return (
    <>
      <Card className="group overflow-hidden py-0 border-none bg-transparent shadow-none">
        <CardContent className="p-0">
          <PropertyItemHeader
            id={id}
            title={title}
            images={images}
            status={status}
            statusColor={statusColor}
            type={type}
            isRegaVerified={isRegaVerified}
            gigaProject={gigaProject}
            formatCurrency={formatCurrency}
            price={price}
            deletePropertyLoading={deletePropertyLoading}
            handleDelete={handleDelete}
          />

          {/* Content */}
          <div className="space-y-6 p-5 md:p-6">
            {/* Additional Details Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-stone-800 border-stone-700 flex flex-wrap">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-emerald-700"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="attributes"
                  className="data-[state=active]:bg-emerald-700"
                >
                  Attributes ({attributes?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="units"
                  className="data-[state=active]:bg-emerald-700"
                >
                  Units ({units?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="bank-account"
                  className="data-[state=active]:bg-emerald-700"
                >
                  Bank Account ({bankAccounts?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="invisitor"
                  className="data-[state=active]:bg-emerald-700"
                >
                  Invisitor ({invisitors?.length || 0})
                </TabsTrigger>
              </TabsList>

              <PropertyDetailsTab
                yearBuilt={yearBuilt}
                floorNumber={floorNumber}
                balconies={balconies}
                furnished={furnished}
                roiProjectionPercent={roiProjectionPercent}
                estimatedRentalIncome={estimatedRentalIncome}
                developer={developer}
                createdAt={createdAt}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />

              <PropertyAttributesTab
                attributes={attributes || []}
                setAttributeModal={setAttributeModal}
                setSelectedAttribute={setSelectedAttribute}
                setEditAttributeModal={setEditAttributeModal}
                handleDeleteAttribute={handleDeleteAttribute}
              />

              <PropertyUnitsTab
                units={units || []}
                setUnitModalOpen={setUnitModalOpen}
                setUnitId={setUnitId}
                setEditUnitModalOpen={setEditUnitModalOpen}
                handleDeleteUnit={handleDeleteUnit}
              />

              <PropertyBankAccountTab
                bankAccounts={bankAccounts}
                hasBankAccount={hasBankAccount}
                setBankModalOpen={setBankModalOpen}
                setSelectedBankAccount={setSelectedBankAccount}
                setEditBankModalOpen={setEditBankModalOpen}
                deleteBankLoading={deleteBankLoading}
                handleDeleteBankAccount={handleDeleteBankAccount}
                formatIBAN={formatIBAN}
                copyToClipboard={copyToClipboard}
              />

              <PropertyInvisitorTab
                invisitors={invisitors}
                hasInvisitor={hasInvisitor}
                setInvisitorModal={setInvisitorModal}
                setSelectedInvisitor={setSelectedInvisitor}
                setEditInvisitorModal={setEditInvisitorModal}
                deleteInvisitorLoading={deleteInvisitorLoading}
                handleDeleteInvisitor={handleDeleteInvisitor}
              />
            </Tabs>
          </div>
          <div className="space-y-6 p-5 md:p-6">
            {/* Title and Location */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                {title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
                <span className="truncate max-w-[150px] sm:max-w-none">
                  {location ||
                    addressLine?.split(",")[0] ||
                    "Location not specified"}
                </span>
                {sakNumber && (
                  <>
                    <span className="w-1 h-1 bg-gray-600 rounded-full shrink-0" />
                    <span className="flex items-center gap-1 shrink-0">
                      <Tag className="h-3 w-3" />
                      Sak: {sakNumber}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <FeatureBox
                icon={<Bed className="h-4 w-4" />}
                label="Bedrooms"
                value={bedrooms || 0}
              />
              <FeatureBox
                icon={<Bath className="h-4 w-4" />}
                label="Bathrooms"
                value={bathrooms || 0}
              />
              <FeatureBox
                icon={<Ruler className="h-4 w-4" />}
                label="Area"
                value={`${areaSqm || 0} m²`}
              />
              <FeatureBox
                icon={<Car className="h-4 w-4" />}
                label="Parking"
                value={parkingSlots || 0}
              />
            </div>

            {/* Stats and Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Units Info */}
              <div className="bg-stone-800/50 rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Units</span>
                  <span className="text-emerald-400 gap-1 font-semibold">
                    {availableUnitsCount}/{totalUnitsCount} Available
                  </span>
                </div>
              </div>

              {/* Payment Plans */}
              <div className="bg-stone-800/50 flex justify-between rounded p-4">
                <div className="flex items-center gap-1 justify-between mb-2">
                  <span className="text-gray-400 text-sm">Payment Plans</span>
                  <span className="text-emerald-400 gap-1 font-semibold">
                    {paymentPlanCount}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">{paymentPlanCount}</p>
              </div>

              {/* Performance Metrics */}
              <div className="bg-stone-800/50 flex justify-between rounded p-4">
                <div className="flex items-center justify-between mb-2 gap-1">
                  <span className="text-gray-400 text-sm">Performance</span>
                </div>
                <div className="flex justify-between gap-1 text-sm">
                  <span className="text-gray-400">
                    Views:{" "}
                    <span className="text-white font-semibold">
                      {propertyViews}
                    </span>
                  </span>
                  <span className="text-gray-400">
                    Saved:{" "}
                    <span className="text-white font-semibold">{savedBy}</span>
                  </span>
                </div>
              </div>
            </div>

            <PropertyPaymentPlansSection
              paymentPlan={paymentPlanCount}
              paymentPlans={paymentPlans || []}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedPlanId={selectedPlanId}
              setSelectedPlanId={setSelectedPlanId}
              setPaymentPlanModal={setPaymentPlanModal}
              handleAddMilestone={handleAddMilestone}
              handleDeletePlan={handleDeletePlan}
              reachedLimit={reachedLimit}
              selectedPlanMilestonesCount={selectedPlanMilestonesCount}
              totalInstallments={totalInstallments}
            />

            {/* Footer with Date */}
            <div className="flex items-center justify-between border-t border-stone-700/80 pt-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-gray-400">
                  <Clock className="h-3 w-3" />
                  Listed: {formatDate(createdAt)}
                </span>
                {updatedAt && updatedAt !== createdAt && (
                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock className="h-3 w-3" />
                    Updated: {formatDate(updatedAt)}
                  </span>
                )}
              </div>
              <Button
                asChild
                className="group/cta h-10 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 text-emerald-200 hover:border-emerald-300/60 hover:bg-emerald-500/20 hover:text-white"
              >
                <Link
                  href={`/property/${id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <PropertyItemModals
        id={id}
        user={user}
        unitModalOpen={unitModalOpen}
        setUnitModalOpen={setUnitModalOpen}
        editUnitModalOpen={editUnitModalOpen}
        setEditUnitModalOpen={setEditUnitModalOpen}
        unitId={unitId}
        attributeModal={attributeModal}
        setAttributeModal={setAttributeModal}
        editAttributeModal={editAttributeModal}
        setEditAttributeModal={setEditAttributeModal}
        selectedAttribute={selectedAttribute}
        bankModalOpen={bankModalOpen}
        setBankModalOpen={setBankModalOpen}
        refetchBankAccounts={refetchBankAccounts}
        editBankModalOpen={editBankModalOpen}
        setEditBankModalOpen={setEditBankModalOpen}
        selectedBankAccount={selectedBankAccount}
        setSelectedBankAccount={setSelectedBankAccount}
        invisitorModal={invisitorModal}
        setInvisitorModal={setInvisitorModal}
        refetchInvisitors={refetchInvisitors}
        editInvisitorModal={editInvisitorModal}
        setEditInvisitorModal={setEditInvisitorModal}
        selectedInvisitor={selectedInvisitor}
        setSelectedInvisitor={setSelectedInvisitor}
        paymentPlanModal={paymentPlanModal}
        setPaymentPlanModal={setPaymentPlanModal}
        paymentMilestoneModal={paymentMilestoneModal}
        setPaymentMilestoneModal={setPaymentMilestoneModal}
        refetchMilestones={refetchMilestones}
        selectedPlanId={selectedPlanId}
        totalPropertyPrice={Number(totalPropertyPrice)}
      />
    </>
  );
}