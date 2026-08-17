"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface FinancialFieldsProps {
  register: any;
  errors: any;
}

export function FinancialFields({ register, errors }: FinancialFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-white">ROI Projection (%)</Label>
          <Input
            type="number"
            step="0.1"
            {...register("roiProjectionPercent", { valueAsNumber: true })}
            placeholder="e.g., 8.5"
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.roiProjectionPercent && (
            <p className="text-red-500 text-sm">
              {errors.roiProjectionPercent.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-white">Estimated Rental Income</Label>
          <Input
            type="number"
            {...register("estimatedRentalIncome", { valueAsNumber: true })}
            placeholder="Yearly rental income"
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.estimatedRentalIncome && (
            <p className="text-red-500 text-sm">
              {errors.estimatedRentalIncome.message as string}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-white">Value Approximate</Label>
          <Input
            type="number"
            {...register("valueApproximate", { valueAsNumber: true })}
            placeholder="Approximate property value"
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.valueApproximate && (
            <p className="text-red-500 text-sm">
              {errors.valueApproximate.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-white">Featured Until</Label>
          <Input
            type="date"
            {...register("featuredUntil", { valueAsDate: true })}
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.featuredUntil && (
            <p className="text-red-500 text-sm">
              {errors.featuredUntil.message as string}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
