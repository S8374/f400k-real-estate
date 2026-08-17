"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useCreatePropertyMutation } from "@/redux/api/propertyApi";
import { useGetDeveloperQuery } from "@/redux/api/developer.api";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";
import { toast } from "sonner";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetAllZonesQuery } from "@/redux/api/zoneApi";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { PropertyFormFields } from "./add-property/PropertyFormFields";
import { PropertyDetailsFields } from "./add-property/PropertyDetailsFields";
import { FinancialFields } from "./add-property/FinancialFields";
import { PropertyImageUpload } from "./add-property/PropertyImageUpload";
import { PropertyConfirmModal } from "./add-property/PropertyConfirmModal";

const formSchema = z.object({
  title: z.string().min(3, "Property title is required"),
  sakNumber: z.string().min(3, "Sak number is required"),
  description: z.string().min(1, "Description is required!"),
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

  addressLine: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  mapEmbedUrl: z.string(),
  location: z.string().optional(),

  developerId: z.string(),
  zoneId: z.string(),
  totalUnits: z.number().optional(),
  availableUnits: z.number().optional(),
  price: z.number().min(1, "Price must be greater than 0"),
  areaSqm: z.number().optional(),
  areaSqFt: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  balconies: z.number().optional(),
  floorNumber: z.number().optional(),
  yearBuilt: z
    .number()
    .optional()
    .refine((val) => val === undefined || val >= 1800, {
      message: "Year must be 1800 or later",
    }),
  parkingSlots: z.number().optional(),
  roiProjectionPercent: z.number().optional(),
  estimatedRentalIncome: z.number().optional(),
  valueApproximate: z.number().optional(),
  featuredUntil: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AddPropertyModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  
  const router = useRouter();
  
  const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadImagesMutation();
  const isLoading = isCreating || isUploading;

  const { data: developerData } = useGetDeveloperQuery({});
  const developersRaw =
    developerData?.data?.data?.data ||
    developerData?.data?.data ||
    developerData?.data ||
    [];
  const developers = Array.isArray(developersRaw) ? developersRaw : [];
  
  const { data: zonesRes } = useGetAllZonesQuery({});
  const zones = zonesRes?.data || [];
  
  const { data: userData } = useGetMeQuery({});
  const currentUser = userData?.data?.data || userData?.data || userData;
  const userId =
    currentUser?.id ||
    currentUser?._id ||
    currentUser?.uid ||
    currentUser?.userId;

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
  });

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

  const onSubmit = (data: FormData) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handlePublish = async () => {
    if (!formData) return;

    if (!userId) {
      toast.error("User session not ready. Please refresh and try again.");
      return;
    }

    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((file) => {
          imageFormData.append("files", file);
        });

        const uploadResponse = await uploadImages(imageFormData).unwrap();
        imageUrls =
          uploadResponse?.data?.urls ||
          uploadResponse?.data?.data?.urls ||
          [];

        if (images.length > 0 && imageUrls.length === 0) {
          toast.error("Failed to upload property images");
          return;
        }
      }

      const payload = {
        ...formData,
        images: imageUrls,
        currency: "SAR",
        estimatedRentalCurrency: "SAR",
        valueApproximateCurrency: "SAR",
        listingAgentId: userId,
        status: "PENDING",
      };
      const response = await createProperty(payload).unwrap();
      if (response?.success) {
        toast.success("Property created successfully!");
      } else {
        toast.success("Property created successfully!");
      }

      reset();
      setImages([]);
      setPreviews([]);
      setShowConfirmModal(false);
      onSuccess?.();
      router.refresh();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create property");
    }
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="bg-stone-950 border border-white/40 rounded w-full max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <div className="p-4 lg:px-6 space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">
              Smart Property Listing (Sak)
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
                handleImageChange={handleImageChange}
                removeImage={removeImage}
              />

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-stone-800">
                <Button
                  type="submit"
                  className="cursor-pointer flex-1 bg-emerald-600 hover:bg-emerald-500 gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Submit Listing
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <PropertyConfirmModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        title={formData?.title}
        isLoading={isLoading}
        handlePublish={handlePublish}
      />
    </>
  );
}
