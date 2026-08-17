"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useEditPropertyMutation,
  useGetPropertyByIdQuery,
} from "@/redux/api/propertyApi";
import { useGetDeveloperQuery } from "@/redux/api/developer.api";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";
import { toast } from "sonner";
import { useGetMeQuery } from "@/redux/api/authApi";
import { FaSpinner } from "react-icons/fa6";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGetAllZonesQuery } from "@/redux/api/zoneApi";

import { PropertyFormFields } from "./add-property/PropertyFormFields";
import { PropertyDetailsFields } from "./add-property/PropertyDetailsFields";
import { FinancialFields } from "./add-property/FinancialFields";
import { PropertyImageUpload } from "./add-property/PropertyImageUpload";

const formSchema = z.object({
  title: z.string().optional(),
  sakNumber: z.string().optional(),
  description: z.string().optional(),
  listingPurpose: z.enum(["SELL", "RENT"]),
  type: z
    .enum([
      "GOLDEN_VISA",
      "HIGH_YIELD",
      "GIGA_PROJECT",
      "OFF_PLAN",
      "LUXURY",
      "COMMERCIAL",
      "RESIDENTIAL",
      "KAFD_ELITE",
      "MADINAH",
      "MAKKAH",
    ])
    .optional(),
  addressLine: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  mapEmbedUrl: z.string().optional(),
  location: z.string().optional(),
  developerId: z.string(),
  zoneId: z.string().optional(),
  totalUnits: z.number().optional(),
  availableUnits: z.number().optional(),
  price: z.number().optional(),
  areaSqm: z.number().optional(),
  areaSqFt: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  balconies: z.number().optional(),
  floorNumber: z.number().optional(),
  yearBuilt: z.number().optional(),
  parkingSlots: z.number().optional(),
  roiProjectionPercent: z.number().optional(),
  estimatedRentalIncome: z.number().optional(),
  valueApproximate: z.number().optional(),
  featuredUntil: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function EditPropertyModal({
  onClose,
  propertyId,
}: {
  onClose: () => void;
  propertyId: string;
}) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const { data: propertyDataById } = useGetPropertyByIdQuery(propertyId);
  const property = propertyDataById?.data;
  
  const [editProperty, { isLoading: editPropertyLoading }] =
    useEditPropertyMutation();
  const [uploadImages] = useUploadImagesMutation();
  
  const { data: developerData } = useGetDeveloperQuery({});
  const developers = developerData?.data?.data || [];
  
  const { data: zonesRes } = useGetAllZonesQuery({});
  const zones = zonesRes?.data || [];
  
  const { data: userData } = useGetMeQuery({});
  const userId = (userData?.data?.data || userData?.data)?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listingPurpose: "SELL",
      developerId: "",
    },
  });

  useEffect(() => {
    if (property) {
      reset({
        title: property.title ?? "",
        sakNumber: property.sakNumber ?? "",
        description: property.description ?? "",
        listingPurpose: property.listingPurpose as "SELL" | "RENT",
        type: property.type as FormData["type"],
        addressLine: property.addressLine ?? "",
        latitude: property.latitude ?? undefined,
        longitude: property.longitude ?? undefined,
        mapEmbedUrl: property.mapEmbedUrl ?? "",
        location: property.location ?? "",
        developerId: property.developerId ?? "",
        zoneId: property.zoneId ?? undefined,
        totalUnits: property.totalUnits ?? undefined,
        availableUnits: property.availableUnits ?? undefined,
        price: property.price ?? undefined,
        areaSqm: property.areaSqm ?? undefined,
        areaSqFt: property.areaSqFt ?? undefined,
        bedrooms: property.bedrooms ?? undefined,
        bathrooms: property.bathrooms ?? undefined,
        balconies: property.balconies ?? undefined,
        floorNumber: property.floorNumber ?? undefined,
        yearBuilt: property.yearBuilt ?? undefined,
        parkingSlots: property.parkingSlots ?? undefined,
        roiProjectionPercent: property.roiProjectionPercent ?? undefined,
        estimatedRentalIncome: property.estimatedRentalIncome ?? undefined,
        valueApproximate: property.valueApproximate ?? undefined,
      });
      if (property.images && property.images.length > 0) {
        setExistingImages(property.images);
      }
    }
  }, [property, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (formData: FormData) => {
    if (!formData) return;
    try {
      let imageUrls: string[] = [];

      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((file) => {
          imageFormData.append("files", file);
        });
        const uploadResponse = await uploadImages(imageFormData).unwrap();
        if (uploadResponse?.success) {
          imageUrls = uploadResponse?.data?.data?.urls ?? [];
        }
      }
      const allImages = [...existingImages, ...imageUrls];

      const payload = {
        ...formData,
        images: allImages,
        currency: "SAR",
        estimatedRentalCurrency: "SAR",
        valueApproximateCurrency: "SAR",
        listingAgentId: userId,
      };

      const response = await editProperty({
        formData: payload,
        propertyId,
      }).unwrap();
      if (response?.success) {
        toast.success("Property updated successfully!");
      }
      reset();
      setImages([]);
      setPreviews([]);
      setExistingImages([]);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update property");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-stone-950 border border-white/40 rounded w-full max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="p-4 lg:px-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">
            Edit Property Listing (Sak)
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <PropertyFormFields
              register={register}
              control={control}
              errors={errors}
              setValue={setValue}
              watch={watch}
              developers={developers}
              zones={zones}
            />

            <PropertyDetailsFields register={register} errors={errors} />

            <FinancialFields register={register} errors={errors} />

            <div className="space-y-2">
              <Label className="text-white">Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Property Description"
                className="bg-stone-900 border-stone-700 text-white placeholder:text-gray-500"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message as string}
                </p>
              )}
            </div>

            <PropertyImageUpload
              images={images}
              previews={previews}
              existingImages={existingImages}
              handleImageChange={handleImageChange}
              removeImage={removeImage}
              removeExistingImage={removeExistingImage}
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-stone-800">
              <Button
                type="submit"
                className="cursor-pointer flex-1 bg-emerald-600 hover:bg-emerald-500 gap-2"
              >
                <Edit className="h-4 w-4" />
                {editPropertyLoading && <FaSpinner className="animate-spin" />}
                Update Property
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}