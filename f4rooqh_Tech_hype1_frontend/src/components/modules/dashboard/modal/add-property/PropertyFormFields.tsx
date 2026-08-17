"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import AddressInput from "../AddressInput";

interface PropertyFormFieldsProps {
  register: any;
  control: any;
  errors: any;
  setValue: any;
  watch: any;
  developers: any[];
  zones: any[];
}

export function PropertyFormFields({
  register,
  control,
  errors,
  setValue,
  watch,
  developers,
  zones,
}: PropertyFormFieldsProps) {
  const selectedZoneId = watch("zoneId");
  const selectedZone = zones.find((z: any) => z.id === selectedZoneId);
  const zoneName = selectedZone?.name;

  return (
    <>
      {/* Property Title */}
      <div className="space-y-2">
        <Label className="text-white">Property Title</Label>
        <Input
          {...register("title")}
          placeholder="Luxury Villa in Al Malqa"
          className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message as string}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-white">Sak Number</Label>
        <Input
          {...register("sakNumber")}
          placeholder="Enter Sak Number"
          className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
        />
        {errors.sakNumber && (
          <p className="text-red-500 text-sm">
            {errors.sakNumber.message as string}
          </p>
        )}
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <Label className="text-white">Listing Purpose</Label>
        <Controller
          name="listingPurpose"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="bg-stone-900 border-stone-700 text-white w-full">
                <SelectValue placeholder="Select your listing purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SELL">Sale</SelectItem>
                <SelectItem value="RENT">Rent</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-white">Select Developer</Label>
        <Controller
          name="developerId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="bg-stone-900 border-stone-700 text-white w-full">
                <SelectValue placeholder="Select your developer" />
              </SelectTrigger>
              <SelectContent>
                {developers?.map((dev: any) => (
                  <SelectItem key={dev.id} value={dev.id}>
                    {dev.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-white">Select Zone</Label>
        <Controller
          name="zoneId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="bg-stone-900 border-stone-700 text-white w-full">
                <SelectValue placeholder="Select property zone" />
              </SelectTrigger>
              <SelectContent>
                {zones?.filter((z: any) => !z.parentId).map((parent: any) => (
                  <SelectGroup key={parent.id}>
                    <SelectLabel className="text-emerald-500 font-bold">{parent.name}</SelectLabel>
                    <SelectItem value={parent.id}>{parent.name} (Main)</SelectItem>
                    {parent.children?.map((child: any) => (
                      <SelectItem key={child.id} value={child.id} className="pl-6">
                        ↳ {child.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <AddressInput
        register={register}
        setValue={setValue}
        addressLineFieldName="addressLine"
        latitudeFieldName="latitude"
        longitudeFieldName="longitude"
        mapEmbedUrlFieldName="mapEmbedUrl"
        locationFieldName="location"
        placeholder="Search your address"
        zoneName={zoneName}
      />

      {errors.addressLine && (
        <p className="text-red-500 text-sm">
          {errors.addressLine.message as string}
        </p>
      )}
      <div className="space-y-2">
        <Label className="text-white">Property Type</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="bg-stone-900 border-stone-700 text-white w-full">
                <SelectValue placeholder="Select your property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GOLDEN_VISA">Golden Visa</SelectItem>
                <SelectItem value="HIGH_YIELD">High Yield</SelectItem>
                <SelectItem value="GIGA_PROJECT">
                  Giga-Project
                </SelectItem>
                <SelectItem value="LUXURY">Luxury</SelectItem>
                <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                <SelectItem value="KAFD_ELITE">KAFD Elite</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </>
  );
}
