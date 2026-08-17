"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface PropertyDetailsFieldsProps {
  register: any;
  errors: any;
}

export function PropertyDetailsFields({ register, errors }: PropertyDetailsFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-white">Total Units</Label>
          <Input
            {...register("totalUnits", { valueAsNumber: true })}
            placeholder="Total Units"
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.totalUnits && (
            <p className="text-red-500 text-sm">
              {errors.totalUnits.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-white">Available Units</Label>
          <Input
            type="number"
            {...register("availableUnits", { valueAsNumber: true })}
            placeholder="Available Units"
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.availableUnits && (
            <p className="text-red-500 text-sm">
              {errors.availableUnits.message as string}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-white">Price (SAR)</Label>
          <Input
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="Enter price"
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message as string}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-white">Area (sqm)</Label>
          <Input
            type="number"
            {...register("areaSqm", { valueAsNumber: true })}
            placeholder="Enter area in sqm"
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.areaSqm && (
            <p className="text-red-500 text-sm">
              {errors.areaSqm.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-white">Area (sqft)</Label>
          <Input
            type="number"
            {...register("areaSqFt", { valueAsNumber: true })}
            placeholder="Enter area in sqft"
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.areaSqFt && (
            <p className="text-red-500 text-sm">
              {errors.areaSqFt.message as string}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-white">Bedrooms</Label>
          <Input
            type="number"
            {...register("bedrooms", { valueAsNumber: true })}
            placeholder="Bedrooms"
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.bedrooms && (
            <p className="text-red-500 text-sm">
              {errors.bedrooms.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-white">Bathrooms</Label>
          <Input
            type="number"
            {...register("bathrooms", { valueAsNumber: true })}
            placeholder="Bathrooms"
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.bathrooms && (
            <p className="text-red-500 text-sm">
              {errors.bathrooms.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-white">Balconies</Label>
          <Input
            type="number"
            {...register("balconies", { valueAsNumber: true })}
            placeholder="Balconies"
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.balconies && (
            <p className="text-red-500 text-sm">
              {errors.balconies.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-white">Floor Number</Label>
          <Input
            type="number"
            {...register("floorNumber", { valueAsNumber: true })}
            placeholder="Floor Number"
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.floorNumber && (
            <p className="text-red-500 text-sm">
              {errors.floorNumber.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-white">Year Built</Label>
          <Input
            type="number"
            {...register("yearBuilt", { valueAsNumber: true })}
            placeholder="Year Built (e.g., 2024)"
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.yearBuilt && (
            <p className="text-red-500 text-sm">
              {errors.yearBuilt.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-white">Parking Slots</Label>
          <Input
            type="number"
            {...register("parkingSlots", { valueAsNumber: true })}
            placeholder="Parking Slots"
            className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
          />
          {errors.parkingSlots && (
            <p className="text-red-500 text-sm">
              {errors.parkingSlots.message as string}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
