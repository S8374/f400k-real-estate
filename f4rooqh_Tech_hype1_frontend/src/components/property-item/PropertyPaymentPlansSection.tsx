"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Plus, ArrowRight, Trash2, Calendar } from "lucide-react";
import MilestonesList from "../modules/modal/MilestonesList";

interface PropertyPaymentPlansSectionProps {
  paymentPlan: number;
  paymentPlans: any[];
  activeTab: string;
  setActiveTab: (val: string) => void;
  selectedPlanId: string | undefined;
  setSelectedPlanId: (val: string | undefined) => void;
  setPaymentPlanModal: (val: boolean) => void;
  handleAddMilestone: () => void;
  handleDeletePlan: (id: string) => void;
  reachedLimit: boolean;
  selectedPlanMilestonesCount: number;
  totalInstallments: number;
}

export function PropertyPaymentPlansSection({
  paymentPlan,
  paymentPlans,
  activeTab,
  setActiveTab,
  selectedPlanId,
  setSelectedPlanId,
  setPaymentPlanModal,
  handleAddMilestone,
  handleDeletePlan,
  reachedLimit,
  selectedPlanMilestonesCount,
  totalInstallments,
}: PropertyPaymentPlansSectionProps) {
  return (
    <div className="border-t border-stone-700 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-semibold flex items-center gap-2 bg-linear-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">
          <CreditCard className="h-5 w-5 text-emerald-500" />
          Payment Plans & Milestones
        </h4>

        {paymentPlan > 0 ? (
          <Badge className="bg-emerald-700/20 text-emerald-400 border border-emerald-700">
            {paymentPlan} Plans
          </Badge>
        ) : (
          <Button
            onClick={() => setPaymentPlanModal(true)}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded"
          >
            <Plus className="h-4 w-4" /> Create Payment Plan
          </Button>
        )}
      </div>

      {paymentPlan > 0 ? (
        <Tabs
          defaultValue="plans"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            if (
              value === "milestones" &&
              paymentPlans?.length &&
              !selectedPlanId
            ) {
              setSelectedPlanId(paymentPlans[0].id);
            }
          }}
          className="w-full"
        >
          {/* Tabs */}
          <TabsList className="bg-stone-900 border border-stone-700 p-1 rounded">
            <TabsTrigger
              value="plans"
              className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
            >
              Payment Plans ({paymentPlan})
            </TabsTrigger>

            <TabsTrigger
              value="milestones"
              className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
            >
              Milestones ({selectedPlanId ? selectedPlanMilestonesCount : 0})
            </TabsTrigger>
          </TabsList>

          {/* PAYMENT PLANS TAB */}
          <TabsContent value="plans" className="mt-5">
            <div className="grid gap-4">
              {(paymentPlans || []).map((plan: any) => {
                const total = plan.totalInstallments || 6;

                return (
                  <Card
                    key={plan.id}
                    className={`bg-stone-800 border transition-all duration-300
                    ${
                      selectedPlanId === plan.id
                        ? "border-emerald-600 bg-emerald-900/20"
                        : "border-stone-700 hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-900/30"
                    }`}
                  >
                    <CardContent>
                      {/* TOP */}
                      <div className="flex justify-between items-start">
                        <h5 className="font-semibold text-white text-lg">
                          {plan.name}

                          {/* VIEW MILESTONES BUTTON */}
                          <Button
                            size="sm"
                            className="bg-emerald-600 ml-2.5 hover:bg-emerald-700 text-white"
                            onClick={() => {
                              setSelectedPlanId(plan.id);
                              setActiveTab("milestones");
                            }}
                          >
                            View Milestones
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </h5>

                        <div className="flex items-center">
                          <Badge className="bg-emerald-700/20 text-emerald-400 border border-emerald-700">
                            {total} Installments
                          </Badge>
                          <div className="flex items-center">
                            {/* DELETE */}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="cursor-pointer h-8 w-8 text-gray-400 hover:text-red-500"
                              onClick={() => {
                                handleDeletePlan(plan.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* MILESTONES TAB */}
          <TabsContent value="milestones" className="mt-5">
            {selectedPlanId ? (
              <div className="space-y-4">
                {/* CREATE MILESTONE */}
                {!reachedLimit && (
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddMilestone}
                      className="bg-linear-to-r from-emerald-600 to-green-500 hover:opacity-90 text-white gap-2"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Milestone ({selectedPlanMilestonesCount}/
                      {totalInstallments})
                    </Button>
                  </div>
                )}

                {/* LIMIT REACHED */}
                {reachedLimit && (
                  <div className="bg-emerald-900/20 border border-emerald-700 p-3 rounded text-center">
                    <p className="text-sm text-emerald-400">
                      All {totalInstallments} milestones created
                    </p>
                  </div>
                )}

                {/* MILESTONE LIST */}
                <MilestonesList
                  key={selectedPlanId}
                  planId={selectedPlanId}
                  totalSteps={totalInstallments}
                />
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-stone-700 rounded">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                <p className="text-lg text-white mb-2">Select a payment plan</p>
                <p className="text-sm text-gray-400 mb-4">
                  Choose a plan to see its milestones
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (paymentPlans?.length) {
                      setSelectedPlanId(paymentPlans[0].id);
                    }
                  }}
                  className="border-emerald-700 text-emerald-400 hover:bg-emerald-700/20"
                >
                  Select First Plan
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-stone-800 rounded">
          <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-600" />
          <p className="text-lg text-white mb-2">
            No payment plans created yet
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Create a payment plan to set up installments
          </p>
          <Button
            onClick={() => setPaymentPlanModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded"
          >
            Create Payment Plan
          </Button>
        </div>
      )}
    </div>
  );
}
